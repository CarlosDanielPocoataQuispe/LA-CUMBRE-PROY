// Guarda en req.usuario a la persona que inició sesión (si la hay)
const jwt = require('jsonwebtoken');

function leerUsuario(req, res, next) {
  req.usuario = null;
  const token = req.cookies.token;
  if (token) {
    try { req.usuario = jwt.verify(token, process.env.JWT_SECRET); } catch (e) { /* token inválido */ }
  }
  res.locals.usuario = req.usuario;   // así las vistas también lo ven
  next();
}

// Uso: soloRol('administrador')  -> solo deja pasar a ese rol
function soloRol(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.redirect('/login');
    if (!roles.includes(req.usuario.rol))
      return res.status(403).render('mensaje', { titulo: 'Sin permiso', texto: 'Tu rol no puede entrar aquí.' });
    next();
  };
}
module.exports = { leerUsuario, soloRol };
