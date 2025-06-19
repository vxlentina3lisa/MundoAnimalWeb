const { pool } = require('../database/db');

const obtenerProductos = async (soloNuevos = false) => {
  try {
    let query = 'SELECT * FROM productos';
    if (soloNuevos) {
      query += ' WHERE es_nuevo = TRUE';
    }
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (error) {
    console.error('Error en obtenerProductos (modelo):', error.message);
    throw error;
  }
};

module.exports = { obtenerProductos };
