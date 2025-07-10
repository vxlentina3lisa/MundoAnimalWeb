// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Importar el contexto de autenticación

/**
 * Componente de ruta protegida.
 * Si el usuario no está autenticado, redirige a la página de login.
 * De lo contrario, renderiza los componentes hijos (Outlet).
 */
const ProtectedRoute = () => {
    const { usuario } = useAuth(); // Obtener el estado del usuario del contexto

    if (!usuario) {
        // Si no hay usuario, redirigir a la página de login
        return <Navigate to="/login" replace />;
    }

    // Si hay usuario, renderizar los componentes hijos de la ruta protegida
    return <Outlet />;
};

export default ProtectedRoute;
