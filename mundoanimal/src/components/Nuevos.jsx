import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Nuevos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductosNuevos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos?nuevos=true`);
        if (!res.ok) throw new Error('Error al cargar productos nuevos');
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos nuevos:', error);
      }
    };
    fetchProductosNuevos();
  }, []);

  return (
    <section className="seccion">
      <h2>Nuevos Productos</h2>
      <div className="productos-grid">
        {productos.length === 0 ? (
          <p>No hay productos nuevos disponibles.</p>
        ) : (
          productos.map((producto) => (
            <Link
              to={`/producto/${producto.id}`}
              key={producto.id}
              className="card-producto-link"
            >
              <div className="card-producto">
                <span className="etiqueta-nuevo">Nuevo</span>
                <img
                  src={`${API_URL}${producto.imagen}`}
                  alt={producto.nombre}
                  style={{ width: '200px' }}
                />

                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-precio">${producto.precio}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default Nuevos;
