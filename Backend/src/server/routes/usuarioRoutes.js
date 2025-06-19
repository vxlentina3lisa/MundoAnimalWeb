const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { registrarUsuario, iniciarSesion } = require('../controllers/usuariosController');

const validacionesRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').isEmail().withMessage('Debe ser un correo válido'),
  body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validacionesLogin = [
  body('correo').isEmail().withMessage('Debe ser un correo válido'),
  body('contraseña').notEmpty().withMessage('La contraseña es obligatoria')
];

router.post('/registro', validacionesRegistro, registrarUsuario);
router.post('/login', validacionesLogin, iniciarSesion);

module.exports = router;
