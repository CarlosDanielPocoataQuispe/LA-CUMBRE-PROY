// MODELO Configuración: textos y colores del sitio que edita el administrador
const db = require('../config/db');
let cache = null, hasta = 0;
exports.todas = async () => {
  if (cache && Date.now() < hasta) return cache;
  const r = await db.query('SELECT clave, valor FROM configuracion');
  cache = {}; r.rows.forEach((x) => (cache[x.clave] = x.valor));
  hasta = Date.now() + 20000;
  return cache;
};
exports.guardar = async (obj) => {
  for (const [k, v] of Object.entries(obj))
    await db.query('INSERT INTO configuracion (clave, valor) VALUES ($1,$2) ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor', [k, v]);
  cache = null;
};
