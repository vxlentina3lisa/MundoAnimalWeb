// src/components/Iniciodesesion.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
import MessageDisplay from './MessageDisplay'; // Importar el componente de mensajes
import '../App.css'; // Asegúrate de que los estilos estén importados

const API_URL = import.meta.env.VITE_API_URL; // Obtener la URL de la API desde las variables de entorno

const InicioSesion = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    const navigate = useNavigate();
    const { iniciarSesion } = useAuth(); // Obtener la función iniciarSesion del contexto

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
                // Llamar a iniciarSesion del contexto, pasando los datos del usuario y el token
                iniciarSesion(data.usuario, data.token);
                setMessage('Inicio de sesión exitoso.');
                setMessageType('success');
                // Redirigir al usuario a la página de inicio o al carrito
                navigate('/');
            } else {
                const errorData = await res.json(); // Asumimos que el backend siempre devuelve JSON para errores
                setMessage(errorData.mensaje || 'Error en el inicio de sesión.');
                setMessageType('error');
                console.error('Error en el inicio de sesión:', errorData);
            }
        } catch (error) {
            setMessage('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
            setMessageType('error');
            console.error('Error de red al iniciar sesión:', error);
        }
    };

    return (
        <div className="inicio-container">
            <Header />
            <main className="form-content"> {/* Usar main para el contenido principal */}
                {message && (
                    <MessageDisplay
                        message={message}
                        type={messageType}
                        onClose={() => setMessage('')}
                    />
                )}
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="email"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        aria-label="Correo electrónico"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                        aria-label="Contraseña"
                    />
                    <button type="submit">Ingresar</button>
                    <p>
                        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                    </p>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default InicioSesion;
