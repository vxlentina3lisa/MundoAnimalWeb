const { pool } = require('../database/db');

const crearUsuario = async (nombre, correo, contraseñaHasheada) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, contraseñaHasheada]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    throw error;
  }
};

const buscarUsuarioPorCorreo = async (correo) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error('Error al buscar usuario por correo:', error.message);
    throw error;
  }
};

module.exports = {
  crearUsuario,
  buscarUsuarioPorCorreo,
};
