import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const InicioSesion = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth(); 
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { correo, contraseña };

    try {
      const res = await fetch(`${API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        iniciarSesion(data.usuario); 
        alert('Inicio de sesión exitoso');
        navigate('/carrito');
      } else {
        const errorText = await res.text();
        alert(errorText || 'Error en el inicio de sesión');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor');
      console.error(error);
    }
  };

  return (
    <div className="inicio-container">
      <Header />
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        <p>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
      <Footer />
    </div>
  );
};

export default InicioSesion;
