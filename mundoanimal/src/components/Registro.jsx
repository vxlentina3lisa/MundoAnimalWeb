import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMensaje('');
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMensaje('Registro exitoso. Ya puedes iniciar sesión.');
        setError(false);
        setFormData({ nombre: '', correo: '', contraseña: '' });
      } else {
        const errorText = await res.text();
        setMensaje(`Error: ${errorText}`);
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la conexión con el servidor.');
      setError(true);
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main className="form-content">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            name="contraseña"
            type="password"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
          <button type="submit">Registrarse</button>
        </form>

        {mensaje && (
          <p style={{ color: error ? 'red' : 'green', marginTop: '1rem' }}>
            {mensaje}
          </p>
        )}

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Registro;
