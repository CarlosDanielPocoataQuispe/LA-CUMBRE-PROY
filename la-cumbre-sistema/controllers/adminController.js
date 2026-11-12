// CONTROLADOR del administrador: resumen, pedidos, productos, envíos, metales y diseño del sitio
const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const Metal = require('../models/metal');
const Config = require('../models/config');
const volver = (res, sec, m) => res.redirect('/admin/' + sec + '?m=' + encodeURIComponent(m));
const SECCIONES = ['resumen', 'pedidos', 'productos', 'envios', 'metales', 'diseno'];

exports.panel = async (req, res) => {
  const sec = SECCIONES.includes(req.params.sec) ? req.params.sec : 'resumen';
  const d = { sec, estados: Pedido.ESTADOS, estadosEnvio: Pedido.ESTADOS_ENVIO };
  if (sec === 'resumen') d.r = await Pedido.resumen();
  if (sec === 'pedidos') d.pedidos = await Pedido.listarTodos();
  if (sec === 'productos') { d.productos = await Producto.listar({ todos: true }); d.edit = req.query.editar ? await Producto.buscar(req.query.editar) : null; }
  if (sec === 'envios') d.envios = await Pedido.listarEnvios();
  if (sec === 'metales') d.metales = await Metal.listar();
  res.render('admin', d);
};
exports.estado = async (req, res) => { await Pedido.cambiarEstado(req.body.id_pedido, req.body.estado, req.body.transportista); volver(res, 'pedidos', 'Estado actualizado'); };
exports.guardarProducto = async (req, res) => {
  if (req.body.id_producto) await Producto.actualizar(req.body.id_producto, req.body); else await Producto.crear(req.body);
  volver(res, 'productos', 'Producto guardado');
};
exports.alternarProducto = async (req, res) => { await Producto.cambiarActivo(req.body.id_producto); volver(res, 'productos', 'Visibilidad actualizada'); };
exports.envio = async (req, res) => { await Pedido.actualizarEnvio(req.body.id_envio, req.body.transportista, req.body.cod_seguimiento, req.body.estado); volver(res, 'envios', 'Envío actualizado'); };
exports.metal = async (req, res) => { await Metal.actualizar(req.body.id_metal, req.body.stock_kg, req.body.costo_kg); volver(res, 'metales', 'Inventario actualizado'); };
exports.diseno = async (req, res) => {
  const b = req.body, d = {};
  ['nombre_tienda', 'eslogan', 'banner_titulo', 'banner_texto', 'direccion', 'facebook', 'minimo_mayor', 'horario', 'entregas', 'paises_envio', 'materia_prima'].forEach((k) => { if (b[k] !== undefined) d[k] = String(b[k]).slice(0, 300); });
  if (/^#[0-9a-fA-F]{6}$/.test(b.color_principal || '')) d.color_principal = b.color_principal;
  await Config.guardar(d);
  volver(res, 'diseno', 'Diseño guardado');
};
