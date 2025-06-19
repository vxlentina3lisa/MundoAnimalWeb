const { pool } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secreto'; 
const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const existeUsuario = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (existeUsuario.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const hashContraseña = await bcrypt.hash(contraseña, 10);
    await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3)',
      [nombre, correo, hashContraseña]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registrarUsuario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const iniciarSesion = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuarioResultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (usuarioResultado.rows.length === 0) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
    const usuario = usuarioResultado.rows[0];

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error en iniciarSesion:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion
};
