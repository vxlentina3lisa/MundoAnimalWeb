// src/server/controllers/carritoControllers.js
const { pool } = require('../database/db');

/**
 * Agrega un producto al carrito del usuario o actualiza su cantidad si ya existe.
 * Requiere autenticación (req.usuario.id debe estar disponible).
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const agregarProductoAlCarrito = async (req, res) => {
    const usuarioId = req.usuario.id; // ID del usuario obtenido del token JWT
    const { productoId, cantidad } = req.body;

    // Validar datos de entrada
    if (!productoId || !cantidad || cantidad <= 0) {
        return res.status(400).json({ mensaje: 'Producto ID y una cantidad válida (mayor que 0) son obligatorios.' });
    }

    try {
        // Verificar si el producto ya existe en el carrito del usuario
        const existeQuery = 'SELECT * FROM carrito WHERE usuario_id = $1 AND producto_id = $2';
        const existeResult = await pool.query(existeQuery, [usuarioId, productoId]);

        if (existeResult.rowCount > 0) {
            // Si el producto ya existe, actualizar la cantidad
            const nuevaCantidad = existeResult.rows[0].cantidad + cantidad;
            const updateQuery = 'UPDATE carrito SET cantidad = $1 WHERE usuario_id = $2 AND producto_id = $3 RETURNING *';
            const updatedItem = await pool.query(updateQuery, [nuevaCantidad, usuarioId, productoId]);
            res.status(200).json({ mensaje: 'Cantidad de producto actualizada en el carrito.', item: updatedItem.rows[0] });
        } else {
            // Si el producto no existe, insertarlo en el carrito
            const insertQuery = 'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3) RETURNING *';
            const newItem = await pool.query(insertQuery, [usuarioId, productoId, cantidad]);
            res.status(201).json({ mensaje: 'Producto agregado al carrito correctamente.', item: newItem.rows[0] });
        }
    } catch (error) {
        console.error('Error en agregarProductoAlCarrito:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al agregar producto al carrito.', error: error.message });
    }
};

/**
 * Obtiene todos los productos en el carrito de un usuario.
 * Requiere autenticación (req.usuario.id debe estar disponible).
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const obtenerCarrito = async (req, res) => {
    const usuarioId = req.usuario.id; // ID del usuario obtenido del token JWT

    try {
        // Consulta para obtener los productos del carrito con detalles del producto
        const query = `
            SELECT
                c.id as carrito_item_id,
                c.producto_id,
                c.cantidad,
                p.nombre,
                p.precio,
                p.imagen_url,
                p.descripcion
            FROM carrito c
            JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = $1
        `;
        const resultado = await pool.query(query, [usuarioId]);

        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error en obtenerCarrito:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener el carrito.', error: error.message });
    }
};

/**
 * Elimina un producto específico del carrito de un usuario.
 * Requiere autenticación (req.usuario.id debe estar disponible).
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const eliminarProductoDelCarrito = async (req, res) => {
    const usuarioId = req.usuario.id; // ID del usuario obtenido del token JWT
    const { productoId } = req.params; // ID del producto a eliminar

    // Validar que el productoId esté presente
    if (!productoId) {
        return res.status(400).json({ mensaje: 'Falta el ID del producto a eliminar.' });
    }

    try {
        // Eliminar el producto del carrito
        const query = 'DELETE FROM carrito WHERE usuario_id = $1 AND producto_id = $2 RETURNING *';
        const resultado = await pool.query(query, [usuarioId, productoId]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito del usuario.' });
        }

        res.status(200).json({ mensaje: 'Producto eliminado del carrito correctamente.' });
    } catch (error) {
        console.error('Error en eliminarProductoDelCarrito:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al eliminar producto del carrito.', error: error.message });
    }
};

/**
 * Actualiza la cantidad de un producto específico en el carrito de un usuario.
 * Requiere autenticación (req.usuario.id debe estar disponible).
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const actualizarCantidadProductoEnCarrito = async (req, res) => {
    const usuarioId = req.usuario.id;
    const { productoId } = req.params;
    const { cantidad } = req.body;

    if (!productoId || !cantidad || cantidad <= 0) {
        return res.status(400).json({ mensaje: 'Producto ID y una cantidad válida (mayor que 0) son obligatorios.' });
    }

    try {
        const updateQuery = 'UPDATE carrito SET cantidad = $1 WHERE usuario_id = $2 AND producto_id = $3 RETURNING *';
        const resultado = await pool.query(updateQuery, [cantidad, usuarioId, productoId]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito para este usuario.' });
        }

        res.status(200).json({ mensaje: 'Cantidad de producto actualizada correctamente.', item: resultado.rows[0] });
    } catch (error) {
        console.error('Error en actualizarCantidadProductoEnCarrito:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar cantidad del producto en el carrito.', error: error.message });
    }
};

module.exports = {
    agregarProductoAlCarrito,
    obtenerCarrito,
    eliminarProductoDelCarrito,
    actualizarCantidadProductoEnCarrito,
};
