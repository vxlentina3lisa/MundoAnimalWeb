import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; 

export const CarritoContext = createContext();

const API_URL = import.meta.env.VITE_API_URL; 

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    const { usuario, token } = useAuth(); 

    useEffect(() => {
        const fetchCarrito = async () => {
            if (usuario && token) {
                try {
                    const res = await fetch(`${API_URL}/api/carrito`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setCarrito(data);
                    } else {
                        console.error('Error al cargar el carrito del backend:', await res.text());
                        setCarrito([]); 
                    }
                } catch (error) {
                    console.error('Error de red al cargar el carrito:', error);
                    setCarrito([]);
                }
            } else {
                setCarrito([]); 
            }
        };

        fetchCarrito();
    }, [usuario, token]); 


    const agregarAlCarrito = async (producto, cantidad) => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede agregar al carrito.');
            alert('Debes iniciar sesión para agregar productos al carrito.'); 
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/carrito`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productoId: producto.id, cantidad })
            });

            if (res.ok) {
                const updatedCarritoRes = await fetch(`${API_URL}/api/carrito`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (updatedCarritoRes.ok) {
                    const updatedCarritoData = await updatedCarritoRes.json();
                    setCarrito(updatedCarritoData);
                    alert('Producto agregado/actualizado en el carrito.'); 
                } else {
                    console.error('Error al recargar el carrito:', await updatedCarritoRes.text());
                }
            } else {
                const errorData = await res.json();
                console.error('Error al agregar al carrito:', errorData.mensaje || res.statusText);
                alert(`Error al agregar al carrito: ${errorData.mensaje || 'Error desconocido'}`); 
            }
        } catch (error) {
            console.error('Error de red al agregar al carrito:', error);
            alert('Error de conexión al agregar al carrito.'); 
        }
    };

    const eliminarDelCarrito = async (productoId) => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede eliminar del carrito.');
            alert('Debes iniciar sesión para modificar el carrito.'); 
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/carrito/${productoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setCarrito(prevCarrito => prevCarrito.filter(item => item.producto_id !== productoId));
                alert('Producto eliminado del carrito.'); 
            } else {
                const errorData = await res.json();
                console.error('Error al eliminar del carrito:', errorData.mensaje || res.statusText);
                alert(`Error al eliminar del carrito: ${errorData.mensaje || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error de red al eliminar del carrito:', error);
            alert('Error de conexión al eliminar del carrito.'); 
        }
    };

    const actualizarCantidadProducto = async (productoId, nuevaCantidad) => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede actualizar el carrito.');
            alert('Debes iniciar sesión para modificar el carrito.'); 
            return;
        }
        if (nuevaCantidad <= 0) {
            await eliminarDelCarrito(productoId);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/carrito/${productoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cantidad: nuevaCantidad })
            });

            if (res.ok) {
                setCarrito(prevCarrito =>
                    prevCarrito.map(item =>
                        item.producto_id === productoId ? { ...item, cantidad: nuevaCantidad } : item
                    )
                );
                alert('Cantidad del producto actualizada.'); 
            } else {
                const errorData = await res.json();
                console.error('Error al actualizar cantidad:', errorData.mensaje || res.statusText);
                alert(`Error al actualizar cantidad: ${errorData.mensaje || 'Error desconocido'}`); 
            }
        } catch (error) {
            console.error('Error de red al actualizar cantidad:', error);
            alert('Error de conexión al actualizar cantidad.');
        }
    };

  
    const vaciarCarrito = async () => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede vaciar el carrito.');
            alert('Debes iniciar sesión para vaciar el carrito.'); 
            return;
        }

        try {
            for (const item of carrito) {
                await eliminarDelCarrito(item.producto_id);
            }
            setCarrito([]); 
            alert('Carrito vaciado correctamente.');
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            alert('Error al vaciar el carrito.'); 
        }
    };

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                actualizarCantidadProducto,
                vaciarCarrito
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
};

export const useCarrito = () => useContext(CarritoContext);
