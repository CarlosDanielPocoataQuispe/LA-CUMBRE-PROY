// Aquí se arma la aplicación: configuración + rutas
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const rutas = require('./routes');
const { leerUsuario } = require('./middleware/auth');

const app = express();
app.set('view engine', 'ejs');                       // las vistas son archivos .ejs
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));     // leer datos de los formularios
app.use(cookieParser());                             // leer cookies
app.use(express.static(path.join(__dirname, 'public'))); // css e imágenes
app.use(leerUsuario);                                // saber quién está conectado
app.use('/', rutas);
app.use((req, res) => res.status(404).render('mensaje', { titulo: 'No encontrado', texto: 'Esa página no existe.' }));

module.exports = app;
