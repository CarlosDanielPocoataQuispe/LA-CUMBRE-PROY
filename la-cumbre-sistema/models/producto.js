// MODELO Producto
const db = require('../config/db');
exports.listar = async () => (await db.query('SELECT * FROM productos ORDER BY id_producto')).rows;
exports.crear = (nombre, categoria, precio, stock, imagen) =>
  db.query('INSERT INTO productos (nombre,categoria,precio,stock,imagen) VALUES ($1,$2,$3,$4,$5)', [nombre, categoria, precio, stock, imagen || 'sin-imagen.svg']);
