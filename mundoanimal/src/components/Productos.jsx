import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Productos = () => {
  const [productos, setProductos] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  return (
    <section className="seccion">
      <h2>Todos los productos</h2>
      <div className="productos-grid">
        {productos.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((producto) => (
            <Link
              to={`/producto/${producto.id}`}
              key={producto.id}
              className="card-producto-link"
            >
              <div className="card-producto">
                <img
                  src={producto.imagen}
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

export default Productos;
