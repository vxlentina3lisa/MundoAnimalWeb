import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL; 

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoria } = useParams();

    useEffect(() => {
        const fetchProductos = async () => {
            let url = `${API_URL}/api/productos`;
            let pageTitle = 'Todos los productos'; 

            if (categoria) {
                let categoriaId;
                switch (categoria) {
                    case 'alimento':
                        categoriaId = 1;
                        pageTitle = 'Productos de Alimento';
                        break;
                    case 'snacks':
                        categoriaId = 2;
                        pageTitle = 'Productos de Snacks';
                        break;
                    case 'accesorios':
                        categoriaId = 3;
                        pageTitle = 'Productos de Accesorios';
                        break;
                    default:
                        console.warn('Categoría no reconocida en la URL:', categoria);
                        categoriaId = null;
                }

                if (categoriaId) {
                    url += `?categoria_id=${categoriaId}`;
                }
            }
            document.title = `MundoAnimal - ${pageTitle}`;

            console.log('Frontend: URL de productos a solicitar:', url); 

            try {
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error('Error al cargar productos.');
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
        fetchProductos();
    }, [categoria]); 

    if (loading) return <p className="loading-message">Cargando productos...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;

    return (
        <section className="seccion">
            <h2>{categoria ? `Productos de ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}` : 'Todos los productos'}</h2>
            <div className="productos-grid">
                {productos.length === 0 ? (
                    <p>No hay productos disponibles en esta categoría en este momento.</p>
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
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/cccccc/000000?text=Imagen+no+disponible"; }} 
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
