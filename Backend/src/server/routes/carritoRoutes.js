// src/server/routes/carritoRoutes.js
const express = require('express');
const router = express.Router();
// Importar funciones del controlador de carrito
// ¡MUY IMPORTANTE: El nombre del archivo en tu servidor debe ser EXACTAMENTE 'carritoControllers.js'!
const {
    agregarProductoAlCarrito,
    obtenerCarrito,
    eliminarProductoDelCarrito,
    actualizarCantidadProductoEnCarrito
} = require('../controllers/carritoControllers'); // <-- Esta línea busca 'carritoControllers.js'
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación

// Ruta para agregar un producto al carrito (requiere autenticación)
router.post('/', authMiddleware, agregarProductoAlCarrito);

// Ruta para obtener el carrito del usuario (requiere autenticación)
router.get('/', authMiddleware, obtenerCarrito);

// Ruta para eliminar un producto del carrito por su ID (requiere autenticación)
router.delete('/:productoId', authMiddleware, eliminarProductoDelCarrito);

// Ruta para actualizar la cantidad de un producto en el carrito (requiere autenticación)
router.put('/:productoId', authMiddleware, actualizarCantidadProductoEnCarrito);

module.exports = router;
