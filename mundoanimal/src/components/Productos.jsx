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
                    productos.map((producto) => (
                        <Link
                            to={`/producto/${producto.id}`}
                            key={producto.id}
                            className="card-producto-link"
                        >
                            <div className="card-producto">
                                <img
                                    src={`${API_URL}/assets/imagenes/${producto.imagen_url}`} // Construir la URL completa
                                    alt={producto.nombre}
                                    className="producto-imagen" // Clase CSS para la imagen
                                />
                                <h3 className="producto-nombre">{producto.nombre}</h3>
                                {/* Asegurarse de que producto.precio sea un número antes de toFixed */}
                                <p className="producto-precio">${(parseFloat(producto.precio) || 0).toFixed(2)}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
};

export default Productos;
