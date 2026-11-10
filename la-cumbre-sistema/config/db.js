// Conexión a PostgreSQL (Supabase). La dirección está en el archivo .env
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
module.exports = pool;
