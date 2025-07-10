// src/server/controllers/productoController.js
const { pool } = require('../database/db');

/**
 * Obtiene todos los productos o solo los marcados como "nuevos".
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const obtenerProductos = async (req, res) => {
    // Determinar si se deben obtener solo productos "nuevos" a partir del query param
    const soloNuevos = req.query.nuevos === 'true';

    try {
        let resultado;
        if (soloNuevos) {
            // Consulta para obtener solo productos nuevos
            resultado = await pool.query('SELECT * FROM productos WHERE es_nuevo = true');
        } else {
            // Consulta para obtener todos los productos
            resultado = await pool.query('SELECT * FROM productos');
        }

        // Mapear los productos para asegurar que la URL de la imagen sea solo el nombre del archivo
        // El frontend se encargará de construir la URL completa
        const productosFormateados = resultado.rows.map(producto => ({
            ...producto,
            // Asumimos que imagen_url en la DB ya es solo el nombre del archivo (ej. 'perro-juguete.jpg')
            // y el frontend construirá la ruta completa como `/assets/imagenes/perro-juguete.jpg`
            imagen_url: producto.imagen_url // No modificar aquí, el frontend lo hará
        }));

        res.status(200).json(productosFormateados);
    } catch (error) {
        console.error('Error obteniendo productos:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener productos.', error: error.message });
    }
};

/**
 * Obtiene un producto específico por su ID.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params; // ID del producto a buscar

    try {
        // Consulta para obtener un producto por su ID
        const resultado = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }

        const producto = resultado.rows[0];
        // Similar a obtenerProductos, la imagen_url se envía como está desde la DB
        producto.imagen_url = producto.imagen_url; // No modificar aquí

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error obteniendo producto por ID:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener producto por ID.', error: error.message });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId
};
