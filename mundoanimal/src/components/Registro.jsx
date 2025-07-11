import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MessageDisplay from './MessageDisplay'; 
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL || ''; 

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contraseña: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info'); 
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(''); 
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
                setMessage('Registro exitoso. Ya puedes iniciar sesión.');
                setMessageType('success');
                setFormData({ nombre: '', correo: '', contraseña: '' }); 
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const errorData = await res.json(); 
                setMessage(errorData.mensaje || 'Error en el registro.');
                setMessageType('error');
                console.error('Error en el registro:', errorData);
            }
        } catch (error) {
            setMessage('Error en la conexión con el servidor. Inténtalo de nuevo más tarde.');
            setMessageType('error');
            console.error('Error de red al registrar:', error);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <main className="form-content">
                {message && (
                    <MessageDisplay
                        message={message}
                        type={messageType}
                        onClose={() => setMessage('')}
                    />
                )}
                <h2>Registro</h2>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        aria-label="Nombre de usuario"
                    />
                    <input
                        name="correo"
                        type="email"
                        placeholder="Correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        aria-label="Correo electrónico"
                    />
                    <input
                        name="contraseña"
                        type="password"
                        placeholder="Contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        required
                        aria-label="Contraseña"
                    />
                    <button type="submit">Registrarse</button>
                </form>
                <p>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </main>
            <Footer />
        </div>
    );
};

export default Registro;
