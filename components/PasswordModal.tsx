import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';

const CORRECT_PASSWORD = 'CVD_PMC_2104_a';

interface PasswordModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onSuccess, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = () => {
        if (password === CORRECT_PASSWORD) {
            onSuccess();
        } else {
            setError('Contraseña incorrecta. Inténtelo de nuevo.');
            setPassword('');
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Modal onClose={onClose} size="sm">
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Acceso Requerido</h3>
                <p className="text-gray-600">Por favor, ingrese la contraseña para continuar.</p>
                <div>
                    <input
                        ref={inputRef}
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Contraseña"
                        className={`w-full px-4 py-3 text-lg bg-white text-gray-900 border rounded-lg focus:ring-2 focus:outline-none ${
                            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        }`}
                    />
                    {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                    Confirmar
                </button>
            </div>
        </Modal>
    );
};

export default PasswordModal;
