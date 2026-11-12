// MODELO Pedido (incluye envíos y resumen para el administrador)
const db = require('../config/db');
const ESTADOS = ['Registrado', 'Confirmado', 'En producción', 'Listo', 'Enviado', 'Entregado', 'Cancelado'];
const ESTADOS_ENVIO = ['Preparando', 'En camino', 'Entregado'];

// items = [{id_producto, cantidad}]. Todo ocurre en una transacción: si algo falla, no se guarda nada.
async function crear(idUsuario, items, metodo, direccion) {
  const c = await db.connect();
  try {
    await c.query('BEGIN');
    const ped = (await c.query('INSERT INTO pedidos (id_usuario,metodo_pago,direccion_envio) VALUES ($1,$2,$3) RETURNING id_pedido', [idUsuario, metodo, direccion])).rows[0];
    let total = 0;
    for (const it of items) {
      const p = (await c.query('SELECT * FROM productos WHERE id_producto = $1 FOR UPDATE', [it.id_producto])).rows[0];
      if (!p || !p.activo) throw new Error('Un producto ya no está disponible');
      if (p.stock < it.cantidad) throw new Error('Stock insuficiente de: ' + p.nombre);
      await c.query('INSERT INTO detalle_pedido (id_pedido,id_producto,cantidad,precio_unit) VALUES ($1,$2,$3,$4)', [ped.id_pedido, p.id_producto, it.cantidad, p.precio]);
      await c.query('UPDATE productos SET stock = stock - $1 WHERE id_producto = $2', [it.cantidad, p.id_producto]);
      total += Number(p.precio) * it.cantidad;
    }
    await c.query('UPDATE pedidos SET total = $1 WHERE id_pedido = $2', [total, ped.id_pedido]);
    await c.query('COMMIT');
    return ped.id_pedido;
  } catch (e) { await c.query('ROLLBACK'); throw e; } finally { c.release(); }
}
const listarDeUsuario = async (id) => (await db.query('SELECT p.*, e.cod_seguimiento, e.estado AS estado_envio FROM pedidos p LEFT JOIN envios e ON e.id_pedido = p.id_pedido WHERE p.id_usuario = $1 ORDER BY p.id_pedido DESC', [id])).rows;
const listarTodos = async () => (await db.query('SELECT p.*, u.nombre AS cliente, u.ciudad, u.pais FROM pedidos p JOIN usuarios u ON u.id_usuario = p.id_usuario ORDER BY p.id_pedido DESC')).rows;

async function cambiarEstado(id, estado, transportista) {
  if (!ESTADOS.includes(estado)) throw new Error('Estado no válido');
  const antes = (await db.query('SELECT estado, direccion_envio FROM pedidos WHERE id_pedido = $1', [id])).rows[0];
  if (!antes) return;
  await db.query('UPDATE pedidos SET estado = $1 WHERE id_pedido = $2', [estado, id]);
  if (estado === 'Cancelado' && antes.estado !== 'Cancelado')   // al cancelar, el stock vuelve
    await db.query('UPDATE productos SET stock = stock + d.cantidad FROM detalle_pedido d WHERE d.id_pedido = $1 AND productos.id_producto = d.id_producto', [id]);
  if (estado === 'Enviado')
    await db.query("INSERT INTO envios (id_pedido,transportista,cod_seguimiento,fecha_despacho,destino) SELECT $1::int,$2::text,'LC-'||$1::int||'-'||floor(random()*9000+1000)::int,NOW(),$3::text WHERE NOT EXISTS (SELECT 1 FROM envios WHERE id_pedido = $1::int)", [id, transportista || 'Por asignar', antes.direccion_envio]);
}
const listarEnvios = async () => (await db.query('SELECT e.*, u.nombre AS cliente FROM envios e JOIN pedidos p ON p.id_pedido = e.id_pedido JOIN usuarios u ON u.id_usuario = p.id_usuario ORDER BY e.id_envio DESC')).rows;
const actualizarEnvio = (id, transportista, cod, estado) => db.query('UPDATE envios SET transportista=$1, cod_seguimiento=$2, estado=$3 WHERE id_envio=$4', [transportista, cod, ESTADOS_ENVIO.includes(estado) ? estado : 'Preparando', id]);
const resumen = async () => (await db.query(`SELECT (SELECT count(*) FROM pedidos) AS pedidos, (SELECT COALESCE(SUM(total),0) FROM pedidos WHERE estado <> 'Cancelado') AS ventas,
  (SELECT count(*) FROM productos WHERE activo) AS productos, (SELECT count(*) FROM productos WHERE activo AND stock < 10) AS stock_bajo, (SELECT count(*) FROM usuarios WHERE id_rol = (SELECT id_rol FROM roles WHERE nombre='usuario')) AS clientes`)).rows[0];
module.exports = { ESTADOS, ESTADOS_ENVIO, crear, listarDeUsuario, listarTodos, cambiarEstado, listarEnvios, actualizarEnvio, resumen };
