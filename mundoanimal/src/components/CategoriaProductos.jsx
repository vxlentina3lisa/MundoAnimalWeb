import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CategoriaProductos = () => {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/productos/categoria/${nombre}`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos por categoría:', err));
  }, [nombre]);

  return (
    <section className="seccion">
      <h2>{nombre.toUpperCase()}</h2>
      <div className="productos-grid">
        {productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          productos.map(producto => (
            <Link to={`/producto/${producto.id}`} key={producto.id} className="card-producto-link">
              <div className="card-producto">
                <img src={`${API_URL}${producto.imagen_url}`} alt={producto.nombre} />
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

export default CategoriaProductos;