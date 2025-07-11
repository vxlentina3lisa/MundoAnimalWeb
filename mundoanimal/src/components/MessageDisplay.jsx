import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const MessageDisplay = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false); 
    console.log('MessageDisplay rendering:', { message, type, isVisible });

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            console.log('MessageDisplay: Estableciendo temporizador para el mensaje:', message);
            const timer = setTimeout(() => {
                setIsVisible(false);
                console.log('MessageDisplay: Ocultando mensaje:', message);
                if (onClose) {
                    onClose();
                }
            }, duration);

            return () => {
                clearTimeout(timer);
                console.log('MessageDisplay: Limpiando temporizador.');
            };
        } else {
            setIsVisible(false); 
            console.log('MessageDisplay: El mensaje está vacío, ocultando.');
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
        color: '#fff',
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100
    };

    const typeStyles = {
        success: {
            backgroundColor: '#4CAF50',
        },
        error: {
            backgroundColor: '#f44336', 
        },
        info: {
            backgroundColor: '#2196F3', 
        },
    };

    return (
        <div style={{ ...baseStyle, ...typeStyles[type] }}>
            {message}
        </div>
    );
};

MessageDisplay.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']), 
    duration: PropTypes.number,
    onClose: PropTypes.func, 
};

export default MessageDisplay;
