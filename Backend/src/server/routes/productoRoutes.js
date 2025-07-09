const express = require('express');
const router = express.Router();
const { pool } = require('../database/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    const productos = result.rows.map(p => ({
      ...p,
      imagen_url: `/imagenes/${p.imagen_url}`
    }));
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 🔥 NUEVA RUTA: obtener por categoría
router.get('/categoria/:nombre', async (req, res) => {
  const { nombre } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.* FROM productos p JOIN categorias c ON p.categoria_id = c.id WHERE c.nombre = $1`,
      [nombre]
    );
    const productos = result.rows.map(p => ({
      ...p,
      imagen_url: `/imagenes/${p.imagen_url}`
    }));
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Producto no encontrado');
    const producto = result.rows[0];
    producto.imagen_url = `/imagenes/${producto.imagen_url}`;
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error al obtener producto por ID' });
  }
});

module.exports = router;
