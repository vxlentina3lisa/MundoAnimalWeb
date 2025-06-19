const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa a la base de datos. Hora:', res.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    process.exit(1);
  }
}

testConnection();
