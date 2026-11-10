// CONTROLADOR del desarrollador: usuarios, roles y estado del sistema
const Usuario = require('../models/usuario');
const db = require('../config/db');

exports.panel = async (req, res) => {
  const hora = (await db.query('SELECT NOW() AS ahora')).rows[0].ahora;   // prueba de que la base responde
  res.render('dev', { usuarios: await Usuario.listar(), roles: await Usuario.roles(), hora, mensaje: req.query.m || '' });
};
exports.cambiarRol = async (req, res) => {
  await Usuario.cambiarRol(req.body.id_usuario, req.body.id_rol);
  res.redirect('/dev?m=' + encodeURIComponent('Rol actualizado'));
};
