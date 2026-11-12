// MODELO Usuario: consultas SQL de la tabla usuarios
const db = require('../config/db');

exports.buscarPorEmail = async (email) => {
  const r = await db.query('SELECT u.*, r.nombre AS rol FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol WHERE u.email = $1', [email]);
  return r.rows[0];
};
exports.crear = (nombre, email, hash, telefono, pais, ciudad) =>
  db.query("INSERT INTO usuarios (nombre,email,password_hash,telefono,pais,ciudad,id_rol) VALUES ($1,$2,$3,$4,$5,$6,(SELECT id_rol FROM roles WHERE nombre='usuario'))",
    [nombre, email, hash, telefono, pais, ciudad]);
exports.listar = async () => (await db.query('SELECT u.id_usuario,u.nombre,u.email,u.id_rol,r.nombre AS rol FROM usuarios u JOIN roles r ON r.id_rol=u.id_rol ORDER BY u.id_usuario')).rows;
exports.roles = async () => (await db.query('SELECT * FROM roles ORDER BY id_rol')).rows;
exports.cambiarRol = (id, idRol) => db.query('UPDATE usuarios SET id_rol=$1 WHERE id_usuario=$2', [idRol, id]);
exports.porId = async (id) => (await db.query('SELECT id_usuario,nombre,email,telefono,pais,ciudad FROM usuarios WHERE id_usuario=$1', [id])).rows[0];
