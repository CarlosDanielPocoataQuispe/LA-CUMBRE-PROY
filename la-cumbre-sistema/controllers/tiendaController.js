// CONTROLADOR de la tienda (rol usuario): catálogo y pedidos
const Producto = require('../models/producto');
const Pedido = require('../models/pedido');
const MINIMO = 6;   // los pedidos son por mayor

exports.inicio = async (req, res) => res.render('inicio', { productos: await Producto.listar(), mensaje: req.query.m || '', minimo: MINIMO });

exports.pedir = async (req, res) => {
  const cantidad = parseInt(req.body.cantidad);
  if (!(cantidad >= MINIMO)) return res.redirect('/?m=' + encodeURIComponent('El pedido es por mayor: mínimo ' + MINIMO + ' piezas'));
  try {
    await Pedido.crear(req.usuario.id, req.body.id_producto, cantidad);
    res.redirect('/mis-pedidos');
  } catch (e) {
    res.redirect('/?m=' + encodeURIComponent(e.message));
  }
};

exports.misPedidos = async (req, res) => res.render('mis_pedidos', { pedidos: await Pedido.listarDeUsuario(req.usuario.id) });
