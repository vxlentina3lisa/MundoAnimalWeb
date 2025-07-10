// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno desde .env

// Importar rutas
const usuarioRoutes = require('./src/server/routes/usuarioRoutes');
const productoRoutes = require('./src/server/routes/productoRoutes');
const carritoRoutes = require('./src/server/routes/carritoRoutes');
const protectedRoutes = require('./src/server/routes/protectedRoutes'); // Si tienes rutas protegidas adicionales

const app = express();
const PORT = process.env.PORT || 3001; // Puerto del servidor, por defecto 3001

// Configuración de CORS
// Permite solicitudes desde el frontend desplegado en Render y desde localhost para desarrollo
app.use(cors({
    origin: [
        'https://mundoanimalweb-frontend.onrender.com', // Asegúrate que esta sea la URL REAL de tu frontend en Render
        'http://localhost:5173' // Para desarrollo local
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Servir archivos estáticos (imágenes de productos)
// Esto hace que las imágenes en `public/assets/imagenes` sean accesibles a través de `/assets/imagenes`
app.use('/assets/imagenes', express.static(path.join(__dirname, 'public/assets/imagenes')));

// Rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/protected', protectedRoutes); // Ejemplo de ruta protegida

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
