import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCarrito } from '../context/CarritoContext';

const API_URL = import.meta.env.VITE_API_URL || '';

const Unidad = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`);
        if (!res.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await res.json();
        setProducto(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleAgregar = () => {
    if (producto) {
      agregarAlCarrito({ ...producto, cantidad });
      alert('Producto agregado al carrito');
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="contenedor-principal">
        <div className="tarjeta-producto">
          <img src={producto.imagen} alt={producto.nombre} className="imagen-producto" />
          <div className="info-producto">
            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p className="precio">${producto.precio}</p>
            <div className="seccion-cantidad">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                id="cantidad"
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
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
