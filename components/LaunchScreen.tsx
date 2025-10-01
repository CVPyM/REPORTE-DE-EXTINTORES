
import React, { useState } from 'react';
import { FireExtinguisherIcon } from './icons';

interface LaunchScreenProps {
  onStart: (userName: string, inspectionFormat: 'individual' | 'area') => void;
}

const LaunchScreen: React.FC<LaunchScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [inspectionFormat, setInspectionFormat] = useState<'individual' | 'area'>('area');

  const handleNext = () => {
    if (name.trim()) {
      onStart(name.trim(), inspectionFormat);
    } else {
        alert('Por favor, ingresa tu nombre.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg text-center">
        <div className="inline-block">
            <FireExtinguisherIcon className="w-16 h-16 mx-auto text-red-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-800">
                Registro de Extintores CV Directo
            </h1>
        </div>
        <div className="space-y-6">
            <div>
                <label htmlFor="name" className="sr-only">Ingresa tu nombre</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ingresa tu nombre"
                    className="w-full px-4 py-3 text-lg bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    autoFocus
                />
            </div>

            <div className="text-left">
              <label className="text-sm font-medium text-gray-700 px-1">Formato de inspección</label>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg p-1 bg-gray-200">
                <button
                  onClick={() => setInspectionFormat('individual')}
                  className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    inspectionFormat === 'individual' ? 'bg-white text-red-600 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-300'
                  }`}
                  aria-pressed={inspectionFormat === 'individual'}
                >
                  Individual
                </button>
                <button
                  onClick={() => setInspectionFormat('area')}
                  className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    inspectionFormat === 'area' ? 'bg-white text-red-600 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-300'
                  }`}
                  aria-pressed={inspectionFormat === 'area'}
                >
                  Por Área
                </button>
              </div>
            </div>

            <button
                onClick={handleNext}
                className="w-full px-4 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
                Siguiente
            </button>
        </div>
      </div>
    </div>
  );
};

export default LaunchScreen;