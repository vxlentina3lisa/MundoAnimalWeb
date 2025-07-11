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
import ProtectedRoute from './ProtectedRoute.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';

import './index.css';
import './App.css';

console.log('main.jsx: Iniciando la aplicación React...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<InicioSesion />} />
            <Route path="/nuevos" element={<Nuevos />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<Unidad />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/carrito" element={<Carrito />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  </React.StrictMode>,
);
