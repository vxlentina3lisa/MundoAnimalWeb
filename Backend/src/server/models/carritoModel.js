// src/server/models/carritoModels.js
const { pool } = require('../database/db');

/**
 * Agrega un nuevo item al carrito.
 * @param {number} usuarioId - ID del usuario.
 * @param {number} productoId - ID del producto.
 * @param {number} cantidad - Cantidad del producto.
 * @returns {Promise<object>} El item del carrito agregado.
 */
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
        console.error('Error al agregar al carrito (modelo):', error.message);
        throw error;
    }
};

/**
 * Obtiene todos los items del carrito para un usuario específico.
 * @param {number} usuarioId - ID del usuario.
 * @returns {Promise<Array<object>>} Lista de items en el carrito.
 */
const obtenerCarritoPorUsuario = async (usuarioId) => {
    try {
        const resultado = await pool.query(
            `SELECT c.*, p.nombre, p.precio, p.imagen_url, p.descripcion
             FROM carrito c
             JOIN productos p ON c.producto_id = p.id
             WHERE c.usuario_id = $1`,
            [usuarioId]
        );
        return resultado.rows;
    } catch (error) {
        console.error('Error al obtener el carrito (modelo):', error.message);
        throw error;
    }
};

/**
 * Elimina un item específico del carrito.
 * @param {number} usuarioId - ID del usuario.
 * @param {number} productoId - ID del producto a eliminar.
 * @returns {Promise<object>} El item del carrito eliminado.
 */
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
        console.error('Error al eliminar del carrito (modelo):', error.message);
        throw error;
    }
};

/**
 * Actualiza la cantidad de un producto en el carrito.
 * @param {number} usuarioId - ID del usuario.
 * @param {number} productoId - ID del producto.
 * @param {number} cantidad - Nueva cantidad.
 * @returns {Promise<object>} El item del carrito actualizado.
 */
const actualizarCantidadEnCarrito = async (usuarioId, productoId, cantidad) => {
    try {
        const resultado = await pool.query(
            `UPDATE carrito 
             SET cantidad = $1 
             WHERE usuario_id = $2 AND producto_id = $3 
             RETURNING *`,
            [cantidad, usuarioId, productoId]
        );
        return resultado.rows[0];
    } catch (error) {
        console.error('Error al actualizar cantidad en el carrito (modelo):', error.message);
        throw error;
    }
};


module.exports = {
    agregarAlCarrito,
    obtenerCarritoPorUsuario,
    eliminarDelCarrito,
    actualizarCantidadEnCarrito
};
