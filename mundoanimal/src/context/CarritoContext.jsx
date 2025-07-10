// src/context/CarritoContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Para obtener el token de autenticación

export const CarritoContext = createContext();

const API_URL = import.meta.env.VITE_API_URL; // Obtener la URL de la API desde las variables de entorno

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    const { usuario, token } = useAuth(); // Obtener el usuario y el token del AuthContext

    // Efecto para cargar el carrito del backend cuando el usuario esté autenticado
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
                        setCarrito([]); // Vaciar carrito si hay error al cargar
                    }
                } catch (error) {
                    console.error('Error de red al cargar el carrito:', error);
                    setCarrito([]);
                }
            } else {
                setCarrito([]); // Vaciar carrito si no hay usuario autenticado
            }
        };

        fetchCarrito();
    }, [usuario, token]); // Dependencias: usuario y token cambian al iniciar/cerrar sesión

    /**
     * Agrega un producto al carrito (o actualiza su cantidad si ya existe) en el backend.
     * @param {object} producto - Objeto del producto a agregar.
     * @param {number} cantidad - Cantidad a agregar.
     */
    const agregarAlCarrito = async (producto, cantidad) => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede agregar al carrito.');
            alert('Debes iniciar sesión para agregar productos al carrito.'); // Usar un componente de mensaje real
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
                // Si la operación fue exitosa, recargar el carrito desde el backend
                const updatedCarritoRes = await fetch(`${API_URL}/api/carrito`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (updatedCarritoRes.ok) {
                    const updatedCarritoData = await updatedCarritoRes.json();
                    setCarrito(updatedCarritoData);
                    alert('Producto agregado/actualizado en el carrito.'); // Usar un componente de mensaje real
                } else {
                    console.error('Error al recargar el carrito:', await updatedCarritoRes.text());
                }
            } else {
                const errorData = await res.json();
                console.error('Error al agregar al carrito:', errorData.mensaje || res.statusText);
                alert(`Error al agregar al carrito: ${errorData.mensaje || 'Error desconocido'}`); // Usar un componente de mensaje real
            }
        } catch (error) {
            console.error('Error de red al agregar al carrito:', error);
            alert('Error de conexión al agregar al carrito.'); // Usar un componente de mensaje real
        }
    };

    /**
     * Elimina un producto del carrito en el backend.
     * @param {number} productoId - ID del producto a eliminar.
     */
    const eliminarDelCarrito = async (productoId) => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede eliminar del carrito.');
            alert('Debes iniciar sesión para modificar el carrito.'); // Usar un componente de mensaje real
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
                // Actualizar el estado del carrito localmente
                setCarrito(prevCarrito => prevCarrito.filter(item => item.producto_id !== productoId));
                alert('Producto eliminado del carrito.'); // Usar un componente de mensaje real
            } else {
                const errorData = await res.json();
                console.error('Error al eliminar del carrito:', errorData.mensaje || res.statusText);
                alert(`Error al eliminar del carrito: ${errorData.mensaje || 'Error desconocido'}`); // Usar un componente de mensaje real
            }
        } catch (error) {
            console.error('Error de red al eliminar del carrito:', error);
            alert('Error de conexión al eliminar del carrito.'); // Usar un componente de mensaje real
        }
    };

    /**
     * Actualiza la cantidad de un producto específico en el carrito en el backend.
     * @param {number} productoId - ID del producto a actualizar.
     * @param {number} nuevaCantidad - Nueva cantidad para el producto.
     */
    const actualizarCantidadProducto = async (productoId, nuevaCantidad) => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede actualizar el carrito.');
            alert('Debes iniciar sesión para modificar el carrito.'); // Usar un componente de mensaje real
            return;
        }
        if (nuevaCantidad <= 0) {
            // Si la nueva cantidad es 0 o menos, eliminar el producto
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
                // Actualizar el estado del carrito localmente
                setCarrito(prevCarrito =>
                    prevCarrito.map(item =>
                        item.producto_id === productoId ? { ...item, cantidad: nuevaCantidad } : item
                    )
                );
                alert('Cantidad del producto actualizada.'); // Usar un componente de mensaje real
            } else {
                const errorData = await res.json();
                console.error('Error al actualizar cantidad:', errorData.mensaje || res.statusText);
                alert(`Error al actualizar cantidad: ${errorData.mensaje || 'Error desconocido'}`); // Usar un componente de mensaje real
            }
        } catch (error) {
            console.error('Error de red al actualizar cantidad:', error);
            alert('Error de conexión al actualizar cantidad.'); // Usar un componente de mensaje real
        }
    };

    /**
     * Vacía todo el carrito del usuario en el backend.
     * Esto requeriría una nueva ruta en el backend para vaciar el carrito completamente.
     * Por ahora, se eliminarán los productos uno por uno.
     */
    const vaciarCarrito = async () => {
        if (!usuario || !token) {
            console.error('Usuario no autenticado. No se puede vaciar el carrito.');
            alert('Debes iniciar sesión para vaciar el carrito.'); // Usar un componente de mensaje real
            return;
        }

        // Implementación simple: eliminar todos los productos uno por uno
        // Una mejor implementación sería una ruta de API en el backend para vaciar todo el carrito
        try {
            for (const item of carrito) {
                await eliminarDelCarrito(item.producto_id);
            }
            setCarrito([]); // Vaciar el estado local después de eliminar todo
            alert('Carrito vaciado correctamente.'); // Usar un componente de mensaje real
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            alert('Error al vaciar el carrito.'); // Usar un componente de mensaje real
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
