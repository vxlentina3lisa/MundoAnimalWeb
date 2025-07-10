// src/components/Productos.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Asegúrate de que los estilos estén importados

const API_URL = import.meta.env.VITE_API_URL; // Obtener la URL de la API

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllProductos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/productos`);
                if (!res.ok) {
                    throw new Error('Error al cargar todos los productos.');
                }
                const data = await res.json();
                console.log('Productos recibidos para Productos.jsx:', data); // Log para depuración
                setProductos(data);
            } catch (err) {
                console.error('Error al cargar productos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProductos();
    }, []);

    if (loading) return <p className="loading-message">Cargando productos...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;

    return (
        <section className="seccion">
            <h2>Todos los productos</h2>
            <div className="productos-grid">
                {productos.length === 0 ? (
                    <p>No hay productos disponibles en este momento.</p>
                ) : (
                    productos.map((producto) => {
                        // --- Lógica para limpiar la URL de la imagen (replicada de Unidad.jsx) ---
                        let cleanedImageUrl = producto.imagen_url;
                        if (cleanedImageUrl) {
                            // Eliminar cualquier prefijo como '/assets/imagenes/' o '/imagenes/'
                            cleanedImageUrl = cleanedImageUrl.replace(/^\/?(assets\/)?imagenes\//, '');
                            // Obtener solo el nombre del archivo
                            cleanedImageUrl = cleanedImageUrl.split('/').pop();
                        } else {
                            cleanedImageUrl = 'placeholder.jpg'; // Imagen de fallback si no hay URL
                        }
                        const fullImageUrl = `${API_URL}/assets/imagenes/${cleanedImageUrl}`;
                        console.log(`Producto ${producto.id}: URL de imagen construida:`, fullImageUrl); // Log para depuración

                        return (
                            <Link
                                to={`/producto/${producto.id}`}
                                key={producto.id}
                                className="card-producto-link"
                            >
                                <div className="card-producto">
                                    <img
                                        src={fullImageUrl} // Usar la URL limpia y completa
                                        alt={producto.nombre}
                                        className="producto-imagen"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/cccccc/000000?text=Imagen+no+disponible"; }} // Fallback
                                    />
                                    <h3 className="producto-nombre">{producto.nombre}</h3>
                                    <p className="producto-precio">${(parseFloat(producto.precio) || 0).toFixed(2)}</p>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default Productos;
