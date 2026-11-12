// CONTROLADOR del desarrollador: consola SQL, usuarios y roles, y diagramas del sistema
const path = require('path');
const db = require('../config/db');
const Usuario = require('../models/usuario');
const relaciones = require('../private/diagramas/relaciones.json');
// Lista de diagramas que ve el desarrollador. Para ocultar uno, pon // al inicio de su línea.
const DIAGRAMAS = [
  ['dfd_contexto', 'Diagrama de contexto (DFD nivel 0)'],
  ['dfd_nivel1', 'DFD nivel 1'],
  ['clases', 'Diagrama de clases'],
  ['casos_uso', 'Casos de uso por rol'],
  ['mer', 'Modelo entidad-relación'],
  // ['secuencia_compra', 'Secuencia: compra desde el carrito'],
  ['estados_pedido', 'Estados del pedido'],
  // ['arquitectura', 'Arquitectura MVC y despliegue'],
];
const tablas = async () => (await db.query('SELECT relname AS tabla, n_live_tup AS filas FROM pg_stat_user_tables ORDER BY relname')).rows;

exports.panel = async (req, res) => {
  const sec = ['consola', 'usuarios', 'diagramas'].includes(req.params.sec) ? req.params.sec : 'consola';
  const d = { sec, out: null, sql: '', DIAGRAMAS, relaciones };
  if (sec === 'consola') {
    d.tablas = await tablas();
    d.sql = /^[a-z_]+$/.test(req.query.t || '') ? `SELECT * FROM ${req.query.t} LIMIT 50;` : '';
    d.hora = (await db.query('SELECT NOW() AS h')).rows[0].h;
    d.sistema = { node: process.version, activo: Math.round(process.uptime()) + ' s', entorno: process.env.NODE_ENV || 'development' };
  }
  if (sec === 'usuarios') { d.usuarios = await Usuario.listar(); d.roles = await Usuario.roles(); }
  res.render('dev', d);
};
// Ejecuta SQL. Si la sentencia modifica datos, exige marcar "Permitir cambios".
exports.sql = async (req, res) => {
  const sql = (req.body.sql || '').trim(), out = {};
  if (!/^(select|with|explain|show)\b/i.test(sql) && !req.body.permitir) out.error = 'Esa sentencia modifica datos. Marca "Permitir cambios" para ejecutarla.';
  else {
    try {
      const r0 = await db.query(sql), r = Array.isArray(r0) ? r0[r0.length - 1] : r0;
      out.campos = (r.fields || []).map((f) => f.name); out.rows = (r.rows || []).slice(0, 200); out.filas = r.rowCount;
    } catch (e) { out.error = e.message; }
  }
  res.render('dev', { sec: 'consola', out, sql, tablas: await tablas(), hora: (await db.query('SELECT NOW() AS h')).rows[0].h, sistema: { node: process.version, activo: Math.round(process.uptime()) + ' s', entorno: process.env.NODE_ENV || 'development' }, DIAGRAMAS, relaciones });
};
exports.rol = async (req, res) => { await Usuario.cambiarRol(req.body.id_usuario, req.body.id_rol); res.redirect('/dev/usuarios?m=' + encodeURIComponent('Rol actualizado')); };
// Los diagramas solo se sirven al desarrollador (no están en la carpeta pública)
exports.diagrama = (req, res) => {
  if (!/^[a-z_]+\.svg$/.test(req.params.nombre)) return res.status(404).end();
  res.sendFile(path.join(__dirname, '..', 'private', 'diagramas', req.params.nombre));
};
