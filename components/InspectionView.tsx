import React, { useState } from 'react';
import { Extinguisher, InspectionQuestion, AnswerStatus, ExtinguisherType } from '../types';
import { ArrowLeftIcon, EditIcon, CheckIcon } from './icons';
import PasswordModal from './PasswordModal';

// Make TypeScript aware of the XLSX library loaded from CDN
declare global {
    interface Window {
        XLSX: any;
    }
}

interface EditableFieldProps {
    label: string;
    value: string;
    onSave: (newValue: string) => void;
    isProtected?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        onSave(currentValue);
        setIsEditing(false);
    };

    return (
        <div>
            <label className="text-sm font-medium text-gray-500">{label}</label>
            <div className="flex items-center group">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            className="text-lg font-semibold text-gray-800 bg-transparent border-b-2 border-red-300 focus:outline-none focus:border-red-500 w-full"
                            autoFocus
                        />
                        <button onClick={handleSave} className="ml-2 text-green-500 hover:text-green-700 p-1">
                            <CheckIcon />
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-lg font-semibold text-gray-800">{value}</p>
                        <button onClick={() => setIsEditing(true)} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            <EditIcon />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

interface QuestionRowProps {
    question: InspectionQuestion;
    onUpdate: (updatedQuestion: InspectionQuestion) => void;
}

const QuestionRow: React.FC<QuestionRowProps> = ({ question, onUpdate }) => {
    
    const AnswerButton = ({ status }: { status: AnswerStatus }) => {
        const isSelected = question.answer === status;
        const baseClasses = 'px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200';
        const colorClasses = {
            [AnswerStatus.PASS]: isSelected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200',
            [AnswerStatus.FAIL]: isSelected ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200',
            [AnswerStatus.NA]: isSelected ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        };
        return (
            <button
                onClick={() => onUpdate({ ...question, answer: status })}
                className={`${baseClasses} ${colorClasses[status]}`}
            >
                {status}
            </button>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 last:border-b-0">
            <div className="md:col-span-5 flex items-center group">
                <p className="flex-grow text-gray-700">{question.question}</p>
            </div>
            <div className="md:col-span-3 flex items-center space-x-2">
                <AnswerButton status={AnswerStatus.PASS} />
                <AnswerButton status={AnswerStatus.FAIL} />
                <AnswerButton status={AnswerStatus.NA} />
            </div>
            <div className="md:col-span-4 flex items-center">
                 <input
                    type="text"
                    placeholder="Comentarios..."
                    value={question.comments}
                    onChange={(e) => onUpdate({ ...question, comments: e.target.value })}
                    className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
            </div>
        </div>
    );
};


interface InspectionViewProps {
    extinguisher: Extinguisher;
    onUpdate: (updatedExtinguisher: Extinguisher) => void;
    onBack: () => void;
}

const InspectionView: React.FC<InspectionViewProps> = ({ extinguisher, onUpdate, onBack }) => {
    const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);

    const requestPasswordForAction = (action: () => void) => {
        setActionToConfirm(() => action);
    };

    const handleUpdateField = (field: keyof Extinguisher, value: any) => {
        onUpdate({ ...extinguisher, [field]: value });
    };

    const handleQuestionUpdate = (updatedQuestion: InspectionQuestion) => {
        const updatedQuestions = extinguisher.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
        onUpdate({ ...extinguisher, questions: updatedQuestions });
    };

    const handleInspectionComplete = () => {
        onUpdate({ ...extinguisher, lastInspection: new Date().toISOString().split('T')[0]});
        onBack();
    }

    const capacityOptions = ["2.5 kg", "4.5 kg", "6.0 kg", "50 kg"];

    return (
        <div className="space-y-8">
            <div>
                <button onClick={onBack} className="flex items-center space-x-2 text-red-600 font-semibold hover:text-red-800 transition-colors duration-200 mb-4">
                    <ArrowLeftIcon />
                    <span>Volver a la Lista</span>
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Detalles del Extintor</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <EditableField label="Ubicación" value={extinguisher.location} onSave={(val) => requestPasswordForAction(() => handleUpdateField('location', val))} />
                    <EditableField label="Número de Serie" value={extinguisher.serialNumber} onSave={(val) => requestPasswordForAction(() => handleUpdateField('serialNumber', val))} />
                     <div>
                        <label className="text-sm font-medium text-gray-500">Tipo</label>
                         <select
                            value={extinguisher.type}
                            onChange={(e) => handleUpdateField('type', e.target.value as ExtinguisherType)}
                            className="w-full text-lg font-semibold text-gray-800 bg-white border-b-2 p-1 focus:outline-none focus:border-red-500 transition"
                        >
                            {Object.values(ExtinguisherType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-500">Capacidad</label>
                         <select
                            value={extinguisher.capacity}
                            onChange={(e) => handleUpdateField('capacity', e.target.value)}
                            className="w-full text-lg font-semibold text-gray-800 bg-white border-b-2 p-1 focus:outline-none focus:border-red-500 transition"
                        >
                            {capacityOptions.map(cap => (
                                <option key={cap} value={cap}>{cap}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Verificación de Inspección</h2>
                </div>
                <div>
                    {extinguisher.questions.map(q => (
                        <QuestionRow key={q.id} question={q} onUpdate={handleQuestionUpdate} />
                    ))}
                </div>
            </div>

            <div className="flex justify-end items-center space-x-4">
                <button onClick={handleInspectionComplete} className="bg-red-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200">
                    Completar Inspección
                </button>
            </div>
            {actionToConfirm && (
                <PasswordModal
                    onSuccess={() => {
                        actionToConfirm();
                        setActionToConfirm(null);
                    }}
                    onClose={() => setActionToConfirm(null)}
                />
            )}
        </div>
    );
};

export default InspectionView;