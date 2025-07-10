// src/server/controllers/usuariosController.js
const { pool } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

/**
 * Registra un nuevo usuario en la base de datos.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const registrarUsuario = async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    // Validar campos requeridos
    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ mensaje: 'Faltan campos requeridos: nombre, correo y contraseña.' });
    }

    try {
        // Verificar si el correo ya está registrado
        const existe = await pool.query('SELECT 1 FROM usuarios WHERE correo = $1', [correo]);
        if (existe.rowCount > 0) {
            return res.status(409).json({ mensaje: 'El correo ya está registrado.' }); // 409 Conflict
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3)';
        await pool.query(query, [nombre, correo, hashedPassword]);

        res.status(201).json({ mensaje: 'Usuario registrado correctamente.' }); // 201 Created
    } catch (error) {
        console.error('Error en registrarUsuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al registrar usuario.', error: error.message });
    }
};

/**
 * Inicia sesión de un usuario y genera un token JWT.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
const iniciarSesion = async (req, res) => {
    const { correo, contraseña } = req.body;

    // Validar campos requeridos
    if (!correo || !contraseña) {
        return res.status(400).json({ mensaje: 'Faltan campos requeridos: correo y contraseña.' });
    }

    try {
        // Buscar el usuario por correo
        const resultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (resultado.rowCount === 0) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' }); // 401 Unauthorized
        }

        const usuario = resultado.rows[0];

        // Comparar la contraseña proporcionada con la hasheada
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' }); // 401 Unauthorized
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
            process.env.JWT_SECRET, // Usar la clave secreta desde las variables de entorno
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso.',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
            },
        });
    } catch (error) {
        console.error('Error en iniciarSesion:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión.', error: error.message });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion,
};
