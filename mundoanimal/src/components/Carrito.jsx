import React, { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MessageDisplay from './MessageDisplay'; 
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

    const total = Math.floor(carrito.reduce((sum, item) => sum + (parseFloat(item.precio) || 0) * item.cantidad, 0));

    const handleActualizarCantidad = async (productoId, nuevaCantidad) => {
        const cantidadValida = Math.max(1, Number(nuevaCantidad)); 
        await actualizarCantidadProducto(productoId, cantidadValida);
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
                <h2 className="carrito-titulo"> 🛒 Carrito de Compras</h2>
                {carrito.length === 0 ? (
                    <p className="carrito-vacio-mensaje">Tu carrito está vacío. ¡Añade algunos productos!</p>
                ) : (
                    <div className="carrito-contenido">
                        <ul className="carrito-lista">
                            {carrito.map(item => ( 
                                <li key={item.producto_id} className="carrito-item">
                                    <img
                                        src={`${API_URL}/assets/imagenes/${item.imagen_url}`}
                                        alt={item.nombre}
                                        className="carrito-item-imagen"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/cccccc/000000?text=No+Img"; }}
                                    />
                                    <div className="carrito-item-info">
                                        <h3 className="carrito-item-nombre">{item.nombre}</h3>
                                        <p className="carrito-item-precio">${Math.floor(parseFloat(item.precio) || 0)}</p>
                                        <div className="carrito-item-cantidad">
                                            <label htmlFor={`cantidad-${item.producto_id}`}>Cantidad:</label>
                                            <input
                                                id={`cantidad-${item.producto_id}`}
                                                type="number"
                                                min="1"
                                                value={item.cantidad}
                                                onChange={(e) => handleActualizarCantidad(item.producto_id, e.target.value)}
                                                aria-label={`Cantidad de ${item.nombre}`}
                                                className="input-cantidad"
                                            />
                                            <button
                                                onClick={() => handleEliminarProducto(item.producto_id)}
                                                className="btn-eliminar-carrito"
                                                aria-label={`Eliminar ${item.nombre} del carrito`}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="carrito-resumen">
                            <p className="carrito-total"><strong>Total:</strong> ${total}</p>
                            <button onClick={handleVaciarCarrito} className="btn-vaciar-carrito">Vaciar Carrito</button>
                            <button className="btn-finalizar-compra">Finalizar Compra</button> 
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Carrito;
