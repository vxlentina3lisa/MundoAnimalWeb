const { pool } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3)';
    await pool.query(query, [nombre, correo, hashedPassword]);

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
} catch (error) {
  console.error('Error en registrarUsuario:', error);
  res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
}
};

const iniciarSesion = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
  }

  try {
    const query = 'SELECT * FROM usuarios WHERE correo = $1';
    const resultado = await pool.query(query, [correo]);

    if (resultado.rowCount === 0) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const usuario = resultado.rows[0];

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });
} catch (error) {
  console.error('Error en iniciarSesion:', error);
  res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
}
};

module.exports = {
  registrarUsuario,
  iniciarSesion
};
