// MODELO Metal (inventario de materia prima)
const db = require('../config/db');
exports.listar = async () => (await db.query('SELECT * FROM metales ORDER BY id_metal')).rows;
exports.actualizar = (id, stock, costo) => db.query('UPDATE metales SET stock_kg=$1, costo_kg=$2 WHERE id_metal=$3', [stock, costo, id]);
