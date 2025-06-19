const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const usuarioRoutes = require('./src/server/routes/usuarioRoutes');
const productoRoutes = require('./src/server/routes/productoRoutes');
const carritoRoutes = require('./src/server/routes/carritoRoutes');
const protectedRoutes = require('./src/server/routes/protectedRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/assets/imagenes', express.static(path.join(__dirname, 'public/assets/imagenes')));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/protected', protectedRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
