import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testDB() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa, tiempo en DB:', res.rows[0]);
  } catch (error) {
    console.error('❌ Error en conexión o consulta:', error);
  } finally {
    await pool.end();
  }
}

testDB();
