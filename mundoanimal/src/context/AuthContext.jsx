import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        const tokenGuardado = localStorage.getItem('token');

        if (usuarioGuardado && tokenGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
            setToken(tokenGuardado);
        }
        setLoading(false); 
    }, []);

    const iniciarSesion = (usuarioData, jwtToken) => {
        setUsuario(usuarioData);
        setToken(jwtToken);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        localStorage.setItem('token', jwtToken);
    };

    const cerrarSesion = () => {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
    };

    if (loading) {
        return <div>Cargando autenticación...</div>; 
    }

    return (
        <AuthContext.Provider value={{ usuario, token, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
