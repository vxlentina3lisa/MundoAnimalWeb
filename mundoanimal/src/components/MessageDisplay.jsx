// src/components/MessageDisplay.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes

/**
 * Componente para mostrar mensajes de notificación (éxito/error) en la UI.
 * Reemplaza el uso de `alert()`.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.message - El mensaje a mostrar.
 * @param {string} [props.type='info'] - Tipo de mensaje ('success', 'error', 'info').
 * @param {number} [props.duration=3000] - Duración en milisegundos antes de que el mensaje desaparezca.
 * @param {function} props.onClose - Función a llamar cuando el mensaje se cierra.
 */
const MessageDisplay = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    onClose();
                }
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!isVisible || !message) {
        return null;
    }

    const baseStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        margin: '10px auto',
        textAlign: 'center',
        fontWeight: 'bold',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'opacity 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0,
        color: '#fff' // Default text color
    };

    const typeStyles = {
        success: {
            backgroundColor: '#4CAF50', // Green
        },
        error: {
            backgroundColor: '#f44336', // Red
        },
        info: {
            backgroundColor: '#2196F3', // Blue
        },
    };

    return (
        <div style={{ ...baseStyle, ...typeStyles[type] }}>
            {message}
        </div>
    );
};

// Añadir la validación de PropTypes
MessageDisplay.propTypes = {
    message: PropTypes.string.isRequired, // 'message' es una cadena y es requerida
    type: PropTypes.oneOf(['success', 'error', 'info']), // 'type' debe ser uno de estos valores
    duration: PropTypes.number, // 'duration' es un número
    onClose: PropTypes.func, // 'onClose' es una función
};

export default MessageDisplay;
