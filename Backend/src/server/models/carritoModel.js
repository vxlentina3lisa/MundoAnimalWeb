const { pool } = require('../database/db');

const agregarAlCarrito = async (usuarioId, productoId, cantidad) => {
  try {
    const resultado = await pool.query(
      `INSERT INTO carrito (usuario_id, producto_id, cantidad)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [usuarioId, productoId, cantidad]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error('Error al agregar al carrito:', error.message);
    throw error;
  }
};

const obtenerCarritoPorUsuario = async (usuarioId) => {
  try {
    const resultado = await pool.query(
      `SELECT c.*, p.nombre, p.precio
       FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = $1`,
      [usuarioId]
    );
    return resultado.rows;
  } catch (error) {
    console.error('Error al obtener el carrito:', error.message);
    throw error;
  }
};
const eliminarDelCarrito = async (usuarioId, productoId) => {
  try {
    const resultado = await pool.query(
      `DELETE FROM carrito 
       WHERE usuario_id = $1 AND producto_id = $2 
       RETURNING *`,
      [usuarioId, productoId]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error('Error al eliminar del carrito:', error.message);
    throw error;
  }
};

module.exports = {
  agregarAlCarrito,
  obtenerCarritoPorUsuario,
  eliminarDelCarrito,
};
