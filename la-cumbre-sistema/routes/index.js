// RUTAS: qué dirección usa qué controlador (y qué rol puede entrar)
const router = require('express').Router();
const { soloRol } = require('../middleware/auth');
const auth = require('../controllers/authController');
const tienda = require('../controllers/tiendaController');
const admin = require('../controllers/adminController');
const dev = require('../controllers/devController');
const seguro = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => {
  console.error(e);
  res.status(500).render('mensaje', { titulo: 'Error', texto: 'Ocurrió un problema. Intenta de nuevo.' });
});

// Públicas
router.get('/', seguro(tienda.catalogo));
router.get('/producto/:id', seguro(tienda.detalle));
router.get('/idioma/:cod', auth.idioma);
router.get('/login', auth.formLogin);
router.post('/login', seguro(auth.login));
router.get('/registro', auth.formRegistro);
router.post('/registro', seguro(auth.registro));
router.get('/salir', auth.salir);

// Rol usuario (cliente)
const cliente = soloRol('usuario');
router.post('/carrito/agregar', cliente, seguro(tienda.agregar));
router.get('/carrito', cliente, seguro(tienda.verCarrito));
router.post('/carrito/cantidad', cliente, seguro(tienda.cambiarCantidad));
router.post('/carrito/quitar', cliente, seguro(tienda.quitar));
router.get('/pago', cliente, seguro(tienda.formPago));
router.post('/pago', cliente, seguro(tienda.pagar));
router.get('/mis-pedidos', cliente, seguro(tienda.misPedidos));

// Rol administrador (el desarrollador también entra)
const admins = soloRol('administrador', 'desarrollador');
router.get('/admin', admins, (req, res) => res.redirect('/admin/resumen'));
router.get('/admin/:sec', admins, seguro(admin.panel));
router.post('/admin/estado', admins, seguro(admin.estado));
router.post('/admin/producto', admins, seguro(admin.guardarProducto));
router.post('/admin/producto/visibilidad', admins, seguro(admin.alternarProducto));
router.post('/admin/envio', admins, seguro(admin.envio));
router.post('/admin/metal', admins, seguro(admin.metal));
router.post('/admin/diseno', admins, seguro(admin.diseno));

// Rol desarrollador
const devs = soloRol('desarrollador');
router.get('/dev', devs, (req, res) => res.redirect('/dev/consola'));
router.get('/dev/diagrama/:nombre', devs, dev.diagrama);
router.post('/dev/sql', devs, seguro(dev.sql));
router.post('/dev/rol', devs, seguro(dev.rol));
router.get('/dev/:sec', devs, seguro(dev.panel));

module.exports = router;
