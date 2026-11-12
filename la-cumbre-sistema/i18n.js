// Textos de la interfaz en español e inglés. Uso en las vistas: <%= t('catalogo') %>
const D = {
  es: { catalogo:'Catálogo', buscar:'Buscar productos…', ordenar:'Ordenar por', todas:'Todas las categorías', az:'Nombre A-Z', menor:'Precio: menor a mayor', mayor:'Precio: mayor a menor', nuevos:'Más nuevos',
    detalle:'Ver detalle', agregar:'Agregar al carrito', comprar:'Comprar ahora', carrito:'Carrito', pedidos:'Mis pedidos', ingresar:'Ingresar', registro:'Registrarse', salir:'Salir',
    admin:'Administración', dev:'Desarrollador', stock:'Stock', categoria:'Categoría', material:'Material', medidas:'Medidas', descripcion:'Descripción', total:'Total', cantidad:'Cantidad',
    quitar:'Quitar', pagar:'Ir a pagar', vacio:'Tu carrito está vacío', relacionados:'Productos relacionados', minimo:'Venta por mayor: mínimo {n} piezas por pedido',
    sin_resultados:'No se encontraron productos', confirmar:'Confirmar pedido', pago:'Método de pago', direccion:'Dirección de envío', precio:'Precio', contacto:'Contacto', agotado:'Agotado',
    volver:'Volver al catálogo', filtrar:'Filtrar', actualizar:'Actualizar', subtotal:'Subtotal', unidades:'unidades', ver_todo:'Ver catálogo completo', iniciar_para:'Ingresa para comprar' },
  en: { catalogo:'Catalog', buscar:'Search products…', ordenar:'Sort by', todas:'All categories', az:'Name A-Z', menor:'Price: low to high', mayor:'Price: high to low', nuevos:'Newest',
    detalle:'View details', agregar:'Add to cart', comprar:'Buy now', carrito:'Cart', pedidos:'My orders', ingresar:'Sign in', registro:'Sign up', salir:'Sign out',
    admin:'Administration', dev:'Developer', stock:'Stock', categoria:'Category', material:'Material', medidas:'Size', descripcion:'Description', total:'Total', cantidad:'Quantity',
    quitar:'Remove', pagar:'Checkout', vacio:'Your cart is empty', relacionados:'Related products', minimo:'Wholesale only: minimum {n} pieces per order',
    sin_resultados:'No products found', confirmar:'Place order', pago:'Payment method', direccion:'Shipping address', precio:'Price', contacto:'Contact', agotado:'Sold out',
    volver:'Back to catalog', filtrar:'Filter', actualizar:'Update', subtotal:'Subtotal', unidades:'units', ver_todo:'View full catalog', iniciar_para:'Sign in to buy' }
};
module.exports = (lang) => (k, n) => {
  const s = (D[lang] || D.es)[k] || D.es[k] || k;
  return n !== undefined ? s.replace('{n}', n) : s;
};
