const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { registrarUsuario, iniciarSesion } = require('../controllers/usuariosController');

const validacionesRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').isEmail().withMessage('Debe ser un correo válido'),
  body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const validacionesLogin = [
  body('correo').isEmail().withMessage('Debe ser un correo válido'),
  body('contraseña').notEmpty().withMessage('La contraseña es obligatoria'),
];

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

router.post('/registro', validacionesRegistro, validarErrores, registrarUsuario);
router.post('/login', validacionesLogin, validarErrores, iniciarSesion);

module.exports = router;
