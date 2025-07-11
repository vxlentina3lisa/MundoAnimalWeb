// src/server/controllers/productoController.js
const { pool } = require('../database/db');

/**
 * Obtiene todos los productos o solo los marcados como "nuevos" usando la columna 'nuevo'.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const obtenerProductos = async (req, res) => {
    // Determinar si se deben obtener solo productos "nuevos" a partir del query param
    const soloNuevos = req.query.nuevos === 'true';

    // Línea 10: console.log para depuración
    console.log('Backend: obtenerProductos - req.query.nuevos:', req.query.nuevos);
    // Línea 11: console.log para depuración (asegurarse de que no haya caracteres extra aquí)
    console.log('Backend: obtenerProductos - soloNuevos (booleano):', soloNuevos);

    try {
        let resultado;
        if (soloNuevos) {
            // Consulta adaptada para la columna 'nuevo' donde '1' es nuevo y es tipo CHAR/VARCHAR
            resultado = await pool.query(`
                SELECT * FROM productos
                WHERE nuevo = '1'
            `);
            console.log('Backend: Consulta para productos nuevos (columna nuevo = \'1\') ejecutada. Filas encontradas:', resultado.rowCount);
        } else {
            // Consulta para obtener todos los productos
            resultado = await pool.query('SELECT * FROM productos');
            console.log('Backend: Consulta para TODOS los productos ejecutada. Filas encontradas:', resultado.rowCount);
        }

        const productosFormateados = resultado.rows.map(producto => ({
            ...producto,
            imagen_url: producto.imagen_url
        }));

        res.status(200).json(productosFormateados);
    } catch (error) {
        console.error('Backend: Error obteniendo productos:', error.message);
        console.error('Backend: Detalles del error:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener productos.', error: error.message });
    }
};

/**
 * Obtiene un producto específico por su ID.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }

        const producto = resultado.rows[0];
        producto.imagen_url = producto.imagen_url;

        res.status(200).json(producto);
    } catch (error) {
        console.error('Backend: Error obteniendo producto por ID:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener producto por ID.', error: error.message });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId
};
