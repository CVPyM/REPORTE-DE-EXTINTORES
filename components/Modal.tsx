import React, { useEffect } from 'react';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ children, onClose, size = 'md' }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);
    
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className={`bg-white p-8 rounded-lg shadow-xl relative w-full ${sizeClasses[size]}`}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 text-3xl font-light w-8 h-8 flex items-center justify-center"
                    aria-label="Cerrar"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
