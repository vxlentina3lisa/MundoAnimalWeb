const { pool } = require('../database/db');

const agregarProductoAlCarrito = async (req, res) => {
  const usuarioId = req.usuario.id; 
  const { productoId, cantidad } = req.body;

  if (!productoId || !cantidad || cantidad <= 0) {
    return res.status(400).json({ mensaje: 'Producto y cantidad válidos son obligatorios' });
  }

  try {
    const existeQuery = 'SELECT * FROM carrito WHERE usuario_id = $1 AND producto_id = $2';
    const existeResult = await pool.query(existeQuery, [usuarioId, productoId]);

    if (existeResult.rowCount > 0) {
      const nuevaCantidad = existeResult.rows[0].cantidad + cantidad;
      const updateQuery = 'UPDATE carrito SET cantidad = $1 WHERE usuario_id = $2 AND producto_id = $3';
      await pool.query(updateQuery, [nuevaCantidad, usuarioId, productoId]);
    } else {
      const insertQuery = 'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3)';
      await pool.query(insertQuery, [usuarioId, productoId, cantidad]);
    }

    res.status(200).json({ mensaje: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    console.error('Error en agregarProductoAlCarrito:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const obtenerCarrito = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const query = `
      SELECT p.id, p.nombre, p.precio, c.cantidad
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = $1
    `;
    const resultado = await pool.query(query, [usuarioId]);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error en obtenerCarrito:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const eliminarProductoDelCarrito = async (req, res) => {
  const usuarioId = req.usuario.id;
  const { productoId } = req.params;

  if (!productoId) {
    return res.status(400).json({ mensaje: 'Falta el id del producto' });
  }

  try {
    const query = 'DELETE FROM carrito WHERE usuario_id = $1 AND producto_id = $2 RETURNING *';
    const resultado = await pool.query(query, [usuarioId, productoId]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error en eliminarProductoDelCarrito:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  agregarProductoAlCarrito,
  obtenerCarrito,
  eliminarProductoDelCarrito,
};
