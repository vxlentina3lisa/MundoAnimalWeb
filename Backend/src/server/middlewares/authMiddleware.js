// src/server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

/**
 * Middleware de autenticación para verificar el token JWT.
 * Adjunta los datos del usuario decodificados a `req.usuario`.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
const authMiddleware = (req, res, next) => {
    // Obtener el encabezado de autorización
    const authHeader = req.headers.authorization;

    // Verificar si el encabezado existe y tiene el formato 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado o formato inválido.' });
    }

    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];

    try {
        // Verificar y decodificar el token usando la clave secreta del entorno
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Adjuntar los datos decodificados del usuario al objeto de solicitud
        req.usuario = decoded;
        // Continuar con la siguiente función de middleware o ruta
        next();
    } catch (error) {
        // Manejar errores de token (inválido, expirado, etc.)
        return res.status(401).json({ mensaje: 'Acceso denegado. Token inválido o expirado.', error: error.message });
    }
};

module.exports = authMiddleware;
