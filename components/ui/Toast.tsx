
import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const baseClasses = 'fixed bottom-5 right-5 max-w-sm w-full p-4 rounded-lg shadow-lg text-white text-sm flex items-center justify-between';
    const typeClasses = {
        success: 'bg-green-600',
        error: 'bg-red-600',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">&times;</button>
        </div>
    );
};
