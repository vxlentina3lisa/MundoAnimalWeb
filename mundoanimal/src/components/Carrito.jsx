import React, { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MessageDisplay from './MessageDisplay'
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL;

const Carrito = () => {
    const { carrito, vaciarCarrito, eliminarDelCarrito, actualizarCantidadProducto } = useCarrito();
    const { usuario } = useAuth();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }
    const total = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) || 0) * item.cantidad, 0);

    const handleActualizarCantidad = async (productoId, nuevaCantidad) => {
        await actualizarCantidadProducto(productoId, nuevaCantidad);
        setMessage('Cantidad actualizada.');
        setMessageType('success');
    };

    const handleEliminarProducto = async (productoId) => {
        await eliminarDelCarrito(productoId);
        setMessage('Producto eliminado del carrito.');
        setMessageType('success');
    };

    const handleVaciarCarrito = async () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
            await vaciarCarrito();
            setMessage('Carrito vaciado.');
            setMessageType('success');
        }
    };

    return (
        <div>
            <Header />
            {message && (
                <MessageDisplay
                    message={message}
                    type={messageType}
                    onClose={() => setMessage('')}
                />
            )}
            <div className="contenedor-principal">
                <h2> 🛒 Carrito de Compras</h2>
                {carrito.length === 0 ? (
                    <p>Tu carrito está vacío.</p>
                ) : (
                    <div>
                        <ul className="carrito-lista">
                            {carrito.map(producto => (
                                <li key={producto.producto_id} className="carrito-item">
                                    <img
                                        src={`${API_URL}/assets/imagenes/${producto.imagen_url}`}
                                        alt={producto.nombre}
                                        className="carrito-item-imagen"
                                    />
                                    <div className="carrito-item-info">
                                        <h3>{producto.nombre}</h3>
                                        <p>${(parseFloat(producto.precio) || 0).toFixed(2)}</p>
                                        <div className="carrito-item-cantidad">
                                            <label htmlFor={`cantidad-${producto.producto_id}`}>Cantidad:</label>
                                            <input
                                                id={`cantidad-${producto.producto_id}`}
                                                type="number"
                                                min="1"
                                                value={producto.cantidad}
                                                onChange={(e) => handleActualizarCantidad(producto.producto_id, Number(e.target.value))}
                                                aria-label={`Cantidad de ${producto.nombre}`}
                                            />
                                            <button
                                                onClick={() => handleEliminarProducto(producto.producto_id)}
                                                className="btn-eliminar-carrito"
                                                aria-label={`Eliminar ${producto.nombre} del carrito`}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="carrito-resumen">
                            <p><strong>Total:</strong> ${total.toFixed(2)}</p>
                            <button onClick={handleVaciarCarrito} className="btn-vaciar-carrito">Vaciar Carrito</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Carrito;
