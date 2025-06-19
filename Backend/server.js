const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const usuarioRoutes = require('./src/server/routes/usuarioRoutes');
const productoRoutes = require('./src/server/routes/productoRoutes');
const carritoRoutes = require('./src/server/routes/carritoRoutes');
const protectedRoutes = require('./src/server/routes/protectedRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://mundoanimalweb-frontend.onrender.com'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/assets/imagenes', express.static(path.join(__dirname, 'public/assets/imagenes')));
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/protected', protectedRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
