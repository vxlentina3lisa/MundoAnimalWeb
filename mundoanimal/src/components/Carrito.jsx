import React from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Carrito = () => {
  const { carrito, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div>
      <Header />
      <div className="contenedor-principal">
        <h2>🛒 Carrito</h2>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <div>
            <ul>
              {carrito.map(producto => (
                <li key={producto.id}>
                  {producto.nombre} - ${producto.precio} x {producto.cantidad}
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> ${total}</p>
            <button onClick={vaciarCarrito}>Vaciar Carrito</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Carrito;
