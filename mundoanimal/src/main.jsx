import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Registro from './components/Registro.jsx';
import InicioSesion from './components/Iniciodesesion.jsx';
import Unidad from './components/Unidad.jsx';
import Carrito from './components/Carrito.jsx';
import Productos from './components/Productos.jsx';
import Nuevos from './components/Nuevos.jsx';
import CategoriaProductos from './components/CategoriaProductos.jsx';
import Contacto from './components/Contacto.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/alimento" element={<CategoriaProductos />} />
            <Route path="/snacks" element={<CategoriaProductos />} />
            <Route path="/accesorios" element={<CategoriaProductos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/" element={<App />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<InicioSesion />} />
            <Route path="/nuevos" element={<Nuevos />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<Unidad />} />
            <Route path="/carrito" element={<Carrito />} />
          </Routes>

        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  </React.StrictMode>
);
