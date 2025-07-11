import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const API_URL = import.meta.env.VITE_API_URL;
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
                console.log('Productos recibidos para Productos.jsx:', data);
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
                        let cleanedImageUrl = producto.imagen_url;
                        if (cleanedImageUrl) {
                            cleanedImageUrl = cleanedImageUrl.replace(/^\/?(assets\/)?imagenes\//, '');
                            cleanedImageUrl = cleanedImageUrl.split('/').pop();
                        } else {
                            cleanedImageUrl = 'placeholder.jpg'; 
                        }
                        const fullImageUrl = `${API_URL}/assets/imagenes/${cleanedImageUrl}`;
                        console.log(`Producto ${producto.id}: URL de imagen construida:`, fullImageUrl);

                        return (
                            <Link
                                to={`/producto/${producto.id}`}
                                key={producto.id}
                                className="card-producto-link"
                            >
                                <div className="card-producto">
                                    <img
                                        src={fullImageUrl}
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
