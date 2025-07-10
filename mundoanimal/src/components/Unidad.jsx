// src/components/Unidad.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCarrito } from '../context/CarritoContext'; // Importar el contexto del carrito
import MessageDisplay from './MessageDisplay'; // Importar el componente de mensajes
import '../App.css'; // Asegúrate de que los estilos estén importados

const API_URL = import.meta.env.VITE_API_URL; // Obtener la URL de la API

const Unidad = () => {
    const { id } = useParams(); // Obtener el ID del producto de la URL
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    const { agregarAlCarrito } = useCarrito(); // Obtener la función agregarAlCarrito del contexto

    // Efecto para cargar los detalles del producto
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await fetch(`${API_URL}/api/productos/${id}`);
                if (!res.ok) {
                    throw new Error('Producto no encontrado.');
                }
                const data = await res.json();
                console.log('Datos del producto recibidos del backend:', data); // LOG para depurar el objeto producto
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
    }, [id]); // Dependencia: el ID del producto

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

    // --- Lógica para limpiar la URL de la imagen ---
    let cleanedImageUrl = producto.imagen_url;
    if (cleanedImageUrl) {
        // Eliminar cualquier prefijo como '/assets/imagenes/' o '/imagenes/'
        cleanedImageUrl = cleanedImageUrl.replace(/^\/?(assets\/)?imagenes\//, '');
        // Asegurarse de que no haya barras iniciales o finales innecesarias
        cleanedImageUrl = cleanedImageUrl.split('/').pop(); // Obtener solo el nombre del archivo
    } else {
        cleanedImageUrl = 'placeholder.jpg'; // Imagen de fallback si no hay URL
    }

    const fullImageUrl = `${API_URL}/assets/imagenes/${cleanedImageUrl}`;
    console.log('URL de la imagen final construida:', fullImageUrl); // LOG para depurar la URL completa

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
                        src={fullImageUrl} // Usar la URL limpia y completa
                        alt={producto.nombre}
                        className="imagen-producto"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/cccccc/000000?text=Imagen+no+disponible"; }} // Fallback si la imagen no carga
                    />
                    <div className="info-producto">
                        <h2>{producto.nombre}</h2>
                        <p>{producto.descripcion}</p>
                        <p className="precio">${(parseFloat(producto.precio) || 0).toFixed(2)}</p>
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
