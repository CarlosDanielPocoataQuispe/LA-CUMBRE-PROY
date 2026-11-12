// CONTROLADOR de la tienda: catálogo, detalle, carrito, pago y pedidos del cliente
const Producto = require('../models/producto');
const Carrito = require('../models/carrito');
const Pedido = require('../models/pedido');
const Usuario = require('../models/usuario');
const minimo = (res) => parseInt(res.locals.cfg.minimo_mayor) || 6;
const volver = (res, ruta, m) => res.redirect(ruta + '?m=' + encodeURIComponent(m));

exports.catalogo = async (req, res) => {
  const { q = '', cat = '', orden = 'nuevos' } = req.query;
  res.render('inicio', { productos: await Producto.listar({ q, cat, orden }), categorias: await Producto.categorias(), q, cat, orden });
};
exports.detalle = async (req, res) => {
  const p = await Producto.buscar(req.params.id);
  if (!p || !p.activo) return res.status(404).render('mensaje', { titulo: '404', texto: 'Producto no encontrado.' });
  res.render('producto', { p, relacionados: await Producto.relacionados(p.categoria, p.id_producto) });
};
exports.agregar = async (req, res) => {
  const n = Math.max(1, parseInt(req.body.cantidad) || 1);
  await Carrito.agregar(req.usuario.id, req.body.id_producto, n);
  volver(res, '/carrito', 'Producto agregado al carrito');
};
exports.verCarrito = async (req, res) => {
  const items = await Carrito.listar(req.usuario.id);
  res.render('carrito', { items, total: items.reduce((s, i) => s + i.cantidad * i.precio, 0), min: minimo(res) });
};
exports.cambiarCantidad = async (req, res) => { await Carrito.fijar(req.usuario.id, req.body.id_producto, Math.max(1, parseInt(req.body.cantidad) || 1)); res.redirect('/carrito'); };
exports.quitar = async (req, res) => { await Carrito.quitar(req.usuario.id, req.body.id_producto); res.redirect('/carrito'); };

// Pantalla de pago: viene del carrito o de "Comprar ahora" (directo)
async function itemsDe(req, fuente) {
  if (fuente.directo) {
    const p = await Producto.buscar(fuente.id_producto);
    return p && p.activo ? [{ ...p, cantidad: Math.max(1, parseInt(fuente.cantidad) || 1) }] : [];
  }
  return Carrito.listar(req.usuario.id);
}
exports.formPago = async (req, res) => {
  const items = await itemsDe(req, req.query);
  const u = await Usuario.porId(req.usuario.id);
  res.render('checkout', { items, total: items.reduce((s, i) => s + i.cantidad * i.precio, 0), directo: !!req.query.directo, idp: req.query.id_producto, u, min: minimo(res), error: '' });
};
exports.pagar = async (req, res) => {
  const items = await itemsDe(req, req.body);
  const piezas = items.reduce((s, i) => s + i.cantidad, 0);
  if (!items.length) return volver(res, '/carrito', 'No hay productos para pagar');
  if (piezas < minimo(res)) return volver(res, '/carrito', 'Venta por mayor: mínimo ' + minimo(res) + ' piezas por pedido');
  try {
    await Pedido.crear(req.usuario.id, items.map((i) => ({ id_producto: i.id_producto, cantidad: i.cantidad })), req.body.metodo, req.body.direccion);
    if (!req.body.directo) await Carrito.vaciar(req.usuario.id);
    volver(res, '/mis-pedidos', 'Pedido registrado correctamente');
  } catch (e) { volver(res, '/carrito', e.message); }
};
exports.misPedidos = async (req, res) => res.render('mis_pedidos', { pedidos: await Pedido.listarDeUsuario(req.usuario.id) });
