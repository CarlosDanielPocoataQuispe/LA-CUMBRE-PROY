// Aquí se arma la aplicación: configuración + rutas
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const rutas = require('./routes');
const i18n = require('./i18n');
const Config = require('./models/config');
const Carrito = require('./models/carrito');
const { leerUsuario } = require('./middleware/auth');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(leerUsuario);

// Datos que todas las vistas pueden usar: configuración del sitio, idioma, mensaje y carrito
app.use(async (req, res, next) => {
  try { res.locals.cfg = await Config.todas(); } catch (e) { res.locals.cfg = { nombre_tienda: 'La Cumbre', color_principal: '#c9a24b' }; }
  res.locals.lang = req.cookies.lang === 'en' ? 'en' : 'es';
  res.locals.t = i18n(res.locals.lang);
  res.locals.msg = req.query.m || '';
  res.locals.img = (n) => (/^https?:\/\//.test(n || '') ? n : '/img/' + (n || 'sin-imagen.svg'));
  res.locals.bs = (n) => 'Bs ' + Number(n).toFixed(2);
  res.locals.nCarrito = 0;
  if (req.usuario && req.usuario.rol === 'usuario') { try { res.locals.nCarrito = await Carrito.contar(req.usuario.id); } catch (e) {} }
  next();
});
app.use('/', rutas);
app.use((req, res) => res.status(404).render('mensaje', { titulo: '404', texto: 'Esa página no existe.' }));
module.exports = app;
