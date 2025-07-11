const express = require('express');
const router = express.Router();
const {
    agregarProductoAlCarrito,
    obtenerCarrito,
    eliminarProductoDelCarrito,
    actualizarCantidadProductoEnCarrito
} = require('../controllers/carritoControllers');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, agregarProductoAlCarrito)
router.get('/', authMiddleware, obtenerCarrito);
router.delete('/:productoId', authMiddleware, eliminarProductoDelCarrito);
router.put('/:productoId', authMiddleware, actualizarCantidadProductoEnCarrito);

module.exports = router;
