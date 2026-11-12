// MODELO Carrito: productos que el cliente guarda para pagar después
const db = require('../config/db');
exports.listar = async (idU) => (await db.query('SELECT c.cantidad, p.* FROM carrito c JOIN productos p ON p.id_producto = c.id_producto WHERE c.id_usuario = $1 ORDER BY p.nombre', [idU])).rows;
exports.agregar = (idU, idP, n) => db.query('INSERT INTO carrito (id_usuario,id_producto,cantidad) VALUES ($1,$2,$3) ON CONFLICT (id_usuario,id_producto) DO UPDATE SET cantidad = carrito.cantidad + EXCLUDED.cantidad', [idU, idP, n]);
exports.fijar = (idU, idP, n) => db.query('UPDATE carrito SET cantidad = $3 WHERE id_usuario = $1 AND id_producto = $2', [idU, idP, n]);
exports.quitar = (idU, idP) => db.query('DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2', [idU, idP]);
exports.vaciar = (idU) => db.query('DELETE FROM carrito WHERE id_usuario = $1', [idU]);
exports.contar = async (idU) => Number((await db.query('SELECT COALESCE(SUM(cantidad),0) AS n FROM carrito WHERE id_usuario = $1', [idU])).rows[0].n);
