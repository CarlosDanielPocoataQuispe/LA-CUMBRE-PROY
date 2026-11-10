// MODELO Pedido
const db = require('../config/db');
const ESTADOS = ['Registrado', 'Confirmado', 'En producción', 'Listo', 'Enviado', 'Entregado', 'Cancelado'];

// Crea el pedido, su detalle y descuenta el stock. Si algo falla, no se guarda nada (transacción).
async function crear(idUsuario, idProducto, cantidad) {
  const c = await db.connect();
  try {
    await c.query('BEGIN');
    const p = (await c.query('SELECT * FROM productos WHERE id_producto=$1 FOR UPDATE', [idProducto])).rows[0];
    if (!p) throw new Error('El producto no existe');
    if (p.stock < cantidad) throw new Error('No hay stock suficiente');
    const ped = (await c.query('INSERT INTO pedidos (id_usuario,total) VALUES ($1,$2) RETURNING id_pedido', [idUsuario, Number(p.precio) * cantidad])).rows[0];
    await c.query('INSERT INTO detalle_pedido (id_pedido,id_producto,cantidad,precio_unit) VALUES ($1,$2,$3,$4)', [ped.id_pedido, idProducto, cantidad, p.precio]);
    await c.query('UPDATE productos SET stock = stock - $1 WHERE id_producto=$2', [cantidad, idProducto]);
    await c.query('COMMIT');
  } catch (e) {
    await c.query('ROLLBACK');
    throw e;
  } finally {
    c.release();
  }
}
const listarDeUsuario = async (id) => (await db.query(
  'SELECT p.*, e.cod_seguimiento FROM pedidos p LEFT JOIN envios e ON e.id_pedido=p.id_pedido WHERE p.id_usuario=$1 ORDER BY p.id_pedido DESC', [id])).rows;
const listarTodos = async () => (await db.query(
  'SELECT p.*, u.nombre AS cliente, u.ciudad, u.pais FROM pedidos p JOIN usuarios u ON u.id_usuario=p.id_usuario ORDER BY p.id_pedido DESC')).rows;

// Cambia el estado. Si pasa a "Enviado" crea el envío con un código de seguimiento.
async function cambiarEstado(id, estado, transportista) {
  if (!ESTADOS.includes(estado)) throw new Error('Estado no válido');
  await db.query('UPDATE pedidos SET estado=$1 WHERE id_pedido=$2', [estado, id]);
  if (estado === 'Enviado')
    await db.query("INSERT INTO envios (id_pedido,transportista,cod_seguimiento,fecha_despacho) SELECT $1::int,$2::text,'LC-'||$1::int||'-'||floor(random()*9000+1000)::int,NOW() WHERE NOT EXISTS (SELECT 1 FROM envios WHERE id_pedido=$1::int)", [id, transportista || 'Por asignar']);
}
module.exports = { ESTADOS, crear, listarDeUsuario, listarTodos, cambiarEstado };
