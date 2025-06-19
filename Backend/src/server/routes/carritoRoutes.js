const express = require('express');
const router = express.Router();

const { agregarProductoAlCarrito, obtenerCarrito, eliminarProductoDelCarrito } = require('../controllers/carritoController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/agregar', autenticarToken, agregarProductoAlCarrito);
router.get('/', autenticarToken, obtenerCarrito);
router.delete('/eliminar/:productoId', autenticarToken, eliminarProductoDelCarrito);

module.exports = router;
