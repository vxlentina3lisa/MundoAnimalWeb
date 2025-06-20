const { pool } = require('../database/db');

const obtenerProductos = async (req, res) => {
  const soloNuevos = req.query.nuevos === 'true';

  try {
    let resultado;
    if (soloNuevos) {
      resultado = await pool.query('SELECT * FROM productos WHERE es_nuevo = true');
    } else {
      resultado = await pool.query('SELECT * FROM productos');
    }

    const productosConRutaImagen = resultado.rows.map(producto => ({
      ...producto,
      imagen: `/assets/imagenes/${producto.imagen}` 
    }));

    res.json(productosConRutaImagen);
  } catch (error) {
    console.error('Error obteniendo productos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const producto = resultado.rows[0];
    producto.imagen = `/assets/imagenes/${producto.imagen_url}`;

    res.json(producto);
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = {
  obtenerProductos,
  obtenerProductoPorId
};
