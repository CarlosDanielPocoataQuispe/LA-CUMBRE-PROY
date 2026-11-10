// MODELO Metal (inventario de materia prima)
const db = require('../config/db');
exports.listar = async () => (await db.query('SELECT * FROM metales ORDER BY id_metal')).rows;
