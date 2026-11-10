// RUTAS: qué dirección usa qué controlador (y qué rol puede entrar)
const router = require('express').Router();
const { soloRol } = require('../middleware/auth');
const auth = require('../controllers/authController');
const tienda = require('../controllers/tiendaController');
const admin = require('../controllers/adminController');
const dev = require('../controllers/devController');

// Si algo falla dentro de un controlador, mostramos un mensaje en vez de romper la página
const seguro = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => {
  console.error(e);
  res.status(500).render('mensaje', { titulo: 'Error', texto: 'Ocurrió un problema. Intenta de nuevo.' });
});

router.get('/', seguro(tienda.inicio));
router.get('/login', auth.formLogin);
router.post('/login', seguro(auth.login));
router.get('/registro', auth.formRegistro);
router.post('/registro', seguro(auth.registro));
router.get('/salir', auth.salir);

// Rol: usuario
router.post('/pedidos', soloRol('usuario'), seguro(tienda.pedir));
router.get('/mis-pedidos', soloRol('usuario'), seguro(tienda.misPedidos));

// Rol: administrador (el desarrollador también puede entrar)
const admins = soloRol('administrador', 'desarrollador');
router.get('/admin', admins, seguro(admin.panel));
router.post('/admin/estado', admins, seguro(admin.cambiarEstado));
router.post('/admin/producto', admins, seguro(admin.crearProducto));

// Rol: desarrollador
router.get('/dev', soloRol('desarrollador'), seguro(dev.panel));
router.post('/dev/rol', soloRol('desarrollador'), seguro(dev.cambiarRol));

module.exports = router;
