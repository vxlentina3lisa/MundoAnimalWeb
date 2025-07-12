import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css';
import { useAuth } from '../context/AuthContext';
import MessageDisplay from './MessageDisplay';

const Header = () => {
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const toggleInfo = () => setMostrarInfo(!mostrarInfo);
    const handleBusquedaChange = (e) => setBusqueda(e.target.value);

    const handleBuscar = () => {
        setMessage(`Buscando: ${busqueda}`);
        setMessageType('info');
        console.log(`Buscando: ${busqueda}`);
    };

    const handleLogout = () => {
        cerrarSesion();
        setMessage('Sesión cerrada correctamente.');
        setMessageType('success');
        navigate('/');
    };

    return (
        <header>
            {message && (
                <MessageDisplay
                    message={message}
                    type={messageType}
                    onClose={() => setMessage('')}
                />
            )}
            <div className="top-bar">
                <button onClick={toggleInfo} className="link-white btn-link" aria-expanded={mostrarInfo} aria-controls="cliente-info">
                    Atención al cliente
                </button>
                {usuario ? (
                    <>
                        <span className="link-white">Hola, {usuario.nombre}</span>
                        <button onClick={handleLogout} className="link-white btn-link">Cerrar sesión</button>
                    </>
                ) : (
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
                <Link to="/categorias/alimento">ALIMENTO</Link>
                <Link to="/categorias/snacks">SNACKS</Link>
                <Link to="/categorias/accesorios">ACCESORIOS</Link>
                <Link to="/contacto">CONTACTO</Link>
            </nav>
        </header>
    );
};

export default Header;
