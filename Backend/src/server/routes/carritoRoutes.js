const express = require('express');
const router = express.Router();

const { agregarProductoAlCarrito, obtenerCarrito, eliminarProductoDelCarrito } = require('../controllers/carritoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/agregar', authMiddleware, agregarProductoAlCarrito);
router.get('/', authMiddleware, obtenerCarrito);
router.delete('/eliminar/:productoId', authMiddleware, eliminarProductoDelCarrito);

module.exports = router;
