import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCarrito } from '../context/CarritoContext'; 
import MessageDisplay from './MessageDisplay'; 
import '../App.css'; 
const API_URL = import.meta.env.VITE_API_URL; 

const Unidad = () => {
    const { id } = useParams(); 
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    const { agregarAlCarrito } = useCarrito(); 
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await fetch(`${API_URL}/api/productos/${id}`);
                if (!res.ok) {
                    throw new Error('Producto no encontrado.');
                }
                const data = await res.json();
                setProducto(data);
            } catch (err) {
                setError(err.message);
                setMessage(`Error: ${err.message}`);
                setMessageType('error');
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]);

    const handleAgregar = async () => {
        if (producto) {
            await agregarAlCarrito(producto, cantidad);
            setMessage('Producto agregado al carrito.');
            setMessageType('success');
        }
    };

    if (loading) return <p className="loading-message">Cargando producto...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!producto) return <p className="not-found-message">Producto no disponible.</p>;
    let cleanedImageUrl = producto.imagen_url;
    if (cleanedImageUrl) {
        cleanedImageUrl = cleanedImageUrl.replace(/^\/?(assets\/)?imagenes\//, '');
        cleanedImageUrl = cleanedImageUrl.split('/').pop();
    } else {
        cleanedImageUrl = 'placeholder.jpg';
    }
    const fullImageUrl = `${API_URL}/assets/imagenes/${cleanedImageUrl}`;

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
                <div className="tarjeta-producto">
                    <img
                        src={fullImageUrl} 
                        alt={producto.nombre}
                        className="imagen-producto"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/cccccc/000000?text=Imagen+no+disponible"; }}
                    />
                    <div className="info-producto">
                        <h2>{producto.nombre}</h2>
                        <p>{producto.descripcion}</p>
                        <p className="precio">${Math.floor(parseFloat(producto.precio) || 0)}</p>
                        <div className="seccion-cantidad">
                            <label htmlFor="cantidad">Cantidad:</label>
                            <input
                                id="cantidad"
                                type="number"
                                min="1"
                                value={cantidad}
                                onChange={(e) => setCantidad(Number(e.target.value))}
                                aria-label="Cantidad del producto"
                            />
                        </div>
                        <button className="btn-comprar" onClick={handleAgregar}>Agregar al carrito</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Unidad;
