// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Nuevo estado para controlar la carga inicial

    useEffect(() => {
        // Al cargar la aplicación, intentar recuperar el usuario y el token de localStorage
        const usuarioGuardado = localStorage.getItem('usuario');
        const tokenGuardado = localStorage.getItem('token');

        if (usuarioGuardado && tokenGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
            setToken(tokenGuardado);
        }
        setLoading(false); // La carga inicial ha terminado
    }, []);

    /**
     * Inicia la sesión del usuario, guardando los datos del usuario y el token.
     * @param {object} usuarioData - Datos del usuario (id, nombre, correo).
     * @param {string} jwtToken - El token JWT recibido del backend.
     */
    const iniciarSesion = (usuarioData, jwtToken) => {
        setUsuario(usuarioData);
        setToken(jwtToken);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        localStorage.setItem('token', jwtToken);
    };

    /**
     * Cierra la sesión del usuario, eliminando los datos y el token.
     */
    const cerrarSesion = () => {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
    };

    // Proveer el contexto solo cuando la carga inicial haya terminado
    if (loading) {
        return <div>Cargando autenticación...</div>; // O un spinner de carga
    }

    return (
        <AuthContext.Provider value={{ usuario, token, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
