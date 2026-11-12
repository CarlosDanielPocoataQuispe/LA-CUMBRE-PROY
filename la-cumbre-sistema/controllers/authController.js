// CONTROLADOR de autenticación: registro, ingreso y salida
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const DESTINO = { usuario: '/', administrador: '/admin', desarrollador: '/dev' };

exports.formLogin = (req, res) => res.render('login', { error: '' });
exports.formRegistro = (req, res) => res.render('registro', { error: '' });
exports.registro = async (req, res) => {
  const { nombre, email, password, telefono, pais, ciudad } = req.body;
  if (!nombre || !email || !password || password.length < 6) return res.render('registro', { error: 'Completa todos los datos (clave de mínimo 6 caracteres).' });
  if (await Usuario.buscarPorEmail(email)) return res.render('registro', { error: 'Ese correo ya está registrado.' });
  await Usuario.crear(nombre, email, bcrypt.hashSync(password, 10), telefono, pais, ciudad);
  res.redirect('/login?m=' + encodeURIComponent('Cuenta creada, ya puedes ingresar'));
};
exports.login = async (req, res) => {
  const u = await Usuario.buscarPorEmail(req.body.email);
  if (!u || !bcrypt.compareSync(req.body.password, u.password_hash)) return res.render('login', { error: 'Correo o clave incorrectos.' });
  const token = jwt.sign({ id: u.id_usuario, nombre: u.nombre, rol: u.rol }, process.env.JWT_SECRET, { expiresIn: '3h' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3 * 3600 * 1000 });
  res.redirect(DESTINO[u.rol] || '/');
};
exports.salir = (req, res) => { res.clearCookie('token'); res.redirect('/'); };
exports.idioma = (req, res) => {
  res.cookie('lang', req.params.cod === 'en' ? 'en' : 'es', { maxAge: 365 * 86400 * 1000 });
  let volver = '/';
  try { const u = new URL(req.get('referer') || '/', 'http://x'); volver = u.pathname + u.search; } catch (e) {}
  res.redirect(volver);
};
