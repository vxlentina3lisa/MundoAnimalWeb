const express = require('express');
const router = express.Router();
const { pool } = require('../database/db'); 

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error al obtener producto por ID' });
  }
});

module.exports = router;
