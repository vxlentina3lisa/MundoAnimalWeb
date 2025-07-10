// src/server/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
// Importar funciones del controlador de productos
const {
    obtenerProductos,
    obtenerProductoPorId
} = require('../controllers/productoController');

// Ruta para obtener todos los productos o productos nuevos
// Ejemplo: GET /api/productos o GET /api/productos?nuevos=true
router.get('/', obtenerProductos);

// Ruta para obtener un producto por su ID
// Ejemplo: GET /api/productos/123
router.get('/:id', obtenerProductoPorId);

module.exports = router;
