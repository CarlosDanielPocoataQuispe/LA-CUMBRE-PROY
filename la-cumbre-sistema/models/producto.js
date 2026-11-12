// MODELO Producto
const db = require('../config/db');
const ORDEN = { az: 'nombre ASC', menor: 'precio ASC', mayor: 'precio DESC', nuevos: 'id_producto DESC' };

// Busca, filtra por categoría y ordena. todos=true incluye los productos ocultos (para el admin)
exports.listar = async ({ q = '', cat = '', orden = 'nuevos', todos = false } = {}) => {
  const w = [], p = [];
  if (!todos) w.push('activo = true');
  if (q) { p.push('%' + q + '%'); w.push(`(nombre ILIKE $${p.length} OR descripcion ILIKE $${p.length} OR categoria ILIKE $${p.length})`); }
  if (cat) { p.push(cat); w.push(`categoria = $${p.length}`); }
  const sql = `SELECT * FROM productos ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY ${ORDEN[orden] || ORDEN.nuevos}`;
  return (await db.query(sql, p)).rows;
};
exports.categorias = async () => (await db.query('SELECT DISTINCT categoria FROM productos WHERE activo = true AND categoria IS NOT NULL ORDER BY categoria')).rows.map((r) => r.categoria);
exports.buscar = async (id) => (Number.isInteger(+id) ? (await db.query('SELECT * FROM productos WHERE id_producto = $1', [id])).rows[0] : null);
exports.relacionados = async (cat, id) => (await db.query('SELECT * FROM productos WHERE activo = true AND categoria = $1 AND id_producto <> $2 ORDER BY random() LIMIT 4', [cat, id])).rows;
exports.crear = (d) => db.query('INSERT INTO productos (nombre,categoria,precio,stock,imagen,descripcion,material,medidas) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
  [d.nombre, d.categoria, d.precio, d.stock, d.imagen || 'sin-imagen.svg', d.descripcion, d.material || 'Estaño', d.medidas || null]);
exports.actualizar = (id, d) => db.query('UPDATE productos SET nombre=$1,categoria=$2,precio=$3,stock=$4,imagen=$5,descripcion=$6,material=$7,medidas=$8 WHERE id_producto=$9',
  [d.nombre, d.categoria, d.precio, d.stock, d.imagen || 'sin-imagen.svg', d.descripcion, d.material || 'Estaño', d.medidas || null, id]);
// "Quitar" un producto = ocultarlo (así no se pierden los pedidos antiguos que lo incluyen)
exports.cambiarActivo = (id) => db.query('UPDATE productos SET activo = NOT activo WHERE id_producto = $1', [id]);
