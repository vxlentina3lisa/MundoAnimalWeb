// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
import MessageDisplay from './MessageDisplay'; // Importar el componente de mensajes

const Header = () => {
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    const { usuario, cerrarSesion } = useAuth(); // Obtener usuario y función de cerrar sesión del contexto
    const navigate = useNavigate();

    const toggleInfo = () => setMostrarInfo(!mostrarInfo);
    const handleBusquedaChange = (e) => setBusqueda(e.target.value);

    const handleBuscar = () => {
        // En una aplicación real, esto redirigiría a una página de resultados de búsqueda
        // o filtraría productos. Por ahora, solo muestra un mensaje.
        setMessage(`Buscando: ${busqueda}`);
        setMessageType('info');
        console.log(`Buscando: ${busqueda}`);
    };

    const handleLogout = () => {
        cerrarSesion(); // Llama a la función de cerrar sesión del contexto
        setMessage('Sesión cerrada correctamente.');
        setMessageType('success');
        navigate('/'); // Redirige a la página principal o de login
    };

    return (
        <header>
            {message && (
                <MessageDisplay
                    message={message}
                    type={messageType}
                    onClose={() => setMessage('')} // Limpiar el mensaje cuando se cierra
                />
            )}
            <div className="top-bar">
                <button onClick={toggleInfo} className="link-white btn-link" aria-expanded={mostrarInfo} aria-controls="cliente-info">
                    Atención al cliente
                </button>
                {usuario ? (
                    // Si hay un usuario logueado, mostrar "Hola, [nombre]" y botón de cerrar sesión
                    <>
                        <span className="link-white">Hola, {usuario.nombre}</span>
                        <button onClick={handleLogout} className="link-white btn-link">Cerrar sesión</button>
                    </>
                ) : (
                    // Si no hay usuario, mostrar "Iniciar sesión"
                    <Link to="/login" className="link-white">Iniciar sesión</Link>
                )}
            </div>
            {mostrarInfo && (
                <div id="cliente-info" className="cliente-info" role="region" aria-live="polite">
                    <p><strong>En MundoAnimal nos importa tu experiencia.</strong> Estamos aquí para ayudarte en todo lo que necesites, porque tu satisfacción es nuestra prioridad.</p>
                    <p>¿Tienes dudas sobre nuestros productos, métodos de pago o tiempos de envío? Nuestro equipo de atención al cliente está disponible para responder tus preguntas y ofrecerte soluciones rápidas y efectivas.</p>
                    <p><strong>¿Cómo contactarnos?</strong></p>
                    <ul>
                        <li>Escríbenos al correo: soporte@mundoanimal.com</li>
                        <li>Llámanos al: +56976739599 </li>
                    </ul>
                    <p>Además, si tienes alguna sugerencia o comentario, ¡nos encantaría escucharte! Queremos mejorar día a día para brindarte la mejor experiencia de compra.</p>
                    <p>Gracias por confiar en nosotros. ¡Estamos para ayudarte!</p>
                </div>
            )}
            <div className="middle-bar">
                <Link to="/">
                    <img src={logo} alt="MundoAnimal" className="logo" />
                </Link>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={handleBusquedaChange}
                        aria-label="Buscar productos"
                    />
                    <button className="btn-buscar" onClick={handleBuscar} aria-label="Buscar">
                        🔍
                    </button>
                </div>
                <div className="iconos">
                    <Link to="/carrito" className="link-black" aria-label="Ir al carrito de compras"> 🛒  Carrito</Link>
                </div>
            </div>
            <nav className="main-nav" aria-label="Navegación principal">
                <Link to="/productos">PRODUCTOS</Link> {/* Enlace general a todos los productos */}
                <Link to="/nuevos">NUEVOS</Link> {/* Enlace a productos nuevos */}
                {/* Puedes añadir más categorías aquí */}
                <Link to="/contacto">CONTACTO</Link>
            </nav>
        </header>
    );
};

export default Header;
