// CONTROLADOR del administrador: pedidos, productos e inventario de metales
const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const Metal = require('../models/metal');

exports.panel = async (req, res) => res.render('admin', {
  pedidos: await Pedido.listarTodos(), productos: await Producto.listar(), metales: await Metal.listar(),
  estados: Pedido.ESTADOS, mensaje: req.query.m || ''
});
exports.cambiarEstado = async (req, res) => {
  await Pedido.cambiarEstado(req.body.id_pedido, req.body.estado, req.body.transportista);
  res.redirect('/admin?m=' + encodeURIComponent('Estado actualizado'));
};
exports.crearProducto = async (req, res) => {
  const { nombre, categoria, precio, stock, imagen } = req.body;
  await Producto.crear(nombre, categoria, precio, stock, imagen);
  res.redirect('/admin?m=' + encodeURIComponent('Producto agregado'));
};
