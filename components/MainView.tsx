import React, { useState, useEffect } from 'react';
import { Area, Extinguisher, AnswerStatus } from '../types';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, DownloadIcon } from './icons';
import Modal from './Modal';
import PasswordModal from './PasswordModal';


// Make TypeScript aware of the XLSX library loaded from CDN
declare global {
    interface Window {
        XLSX: any;
    }
}

// --- Helper Components & Functions ---

const Spinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
);

const sendReportToServer = async (base64Data: string, filename: string) => {
    const url = 'https://script.google.com/macros/s/AKfycbwa8FJi0wRnGAZqevfpJEe4E4OqMgt8U6yzLjhQa2nco8zlBB_Dip9FIIp5tlJkwfWD/exec';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // Using 'text/plain' to avoid CORS preflight issues with Google Apps Script.
                // The Apps Script backend will need to parse the stringified JSON from the request body.
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
                file: base64Data,
                filename: filename,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al enviar el reporte al servidor:", error);
        return { status: 'error', message: error instanceof Error ? error.message : 'Ocurrió un error de red desconocido.' };
    }
};


// --- Main Components ---

interface EditableItemProps {
    item: { id: string, name: string };
    onUpdate: (item: { id: string, name:string }) => void;
    onDelete: (id: string) => void;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const EditableListItem: React.FC<EditableItemProps> = ({ item, onUpdate, onDelete, isSelected, onSelect }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);

    const handleSave = () => {
        if (name.trim()) {
            onUpdate({ ...item, name: name.trim() });
        } else {
            setName(item.name);
        }
        setIsEditing(false);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(item.id);
    };

    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleSave();
    };

    return (
        <div
            className={`group flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 text-base ${
                isSelected ? 'bg-red-600 text-white shadow-md' : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => {
                if (!isEditing) {
                    onSelect(item.id)
                }
            }}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow bg-transparent border-b border-gray-400 focus:outline-none focus:border-red-500 w-full"
                    autoFocus
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') {
                            setName(item.name);
                            setIsEditing(false);
                        }
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span className="font-medium truncate" title={item.name}>{item.name}</span>
            )}
            <div className={`flex items-center flex-shrink-0 space-x-1 ml-2 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isEditing ? (
                    <button onClick={handleSaveClick} className="p-1 text-green-500 hover:text-green-700">
                        <CheckIcon className="w-4 h-4" />
                    </button>
                ) : (
                    <>
                        <button onClick={handleEditClick} className={`p-1 ${isSelected ? 'text-white hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}>
                            <EditIcon className="w-4 h-4" />
                        </button>
                        <button onClick={handleDeleteClick} className={`p-1 ${isSelected ? 'text-white hover:text-gray-200' : 'text-red-500 hover:text-red-700'}`}>
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};


interface ExtinguisherCardProps {
    extinguisher: Extinguisher;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

const ExtinguisherCard: React.FC<ExtinguisherCardProps> = ({ extinguisher, onSelect, onDelete }) => {
    const isFailed = extinguisher.questions.some(q => q.answer === AnswerStatus.FAIL);
    const isPending = extinguisher.questions.some(q => q.answer === AnswerStatus.NA);

    const getStatusColor = () => {
        if (isFailed) {
            return 'border-red-500 bg-red-50';
        }
        if (isPending) {
            return 'border-yellow-500 bg-yellow-50';
        }
        return 'border-green-500 bg-green-50';
    };

    return (
        <div className={`border-l-4 rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 ${getStatusColor()}`}>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500">SN: {extinguisher.serialNumber}</p>
                        <h3 className="font-bold text-lg text-gray-800">{extinguisher.location}</h3>
                        <p className="text-sm text-gray-600 bg-gray-200 inline-block px-2 py-0.5 rounded-full mt-1">{extinguisher.type}</p>
                    </div>
                    <button onClick={() => onDelete(extinguisher.id)} className="text-gray-400 hover:text-red-600 p-1"><TrashIcon /></button>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Última Inspección: {extinguisher.lastInspection}</p>
                    <button onClick={() => onSelect(extinguisher.id)} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                        Inspeccionar
                    </button>
                </div>
            </div>
        </div>
    );
}

interface MainViewProps {
    areas: Area[];
    selectedAreaId: string | null;
    onSelectArea: (id: string) => void;
    onUpdateArea: (area: Area) => void;
    onAddArea: (name: string) => void;
    onDeleteArea: (id: string) => void;
    extinguishers: Extinguisher[];
    allExtinguishers: Extinguisher[];
    onSelectExtinguisher: (id: string) => void;
    onAddExtinguisher: (areaId: string) => void;
    onDeleteExtinguisher: (id: string) => void;
    onResetInspections: () => void;
    inspectionFormat: 'individual' | 'area';
}

const MainView: React.FC<MainViewProps> = ({
    areas,
    selectedAreaId,
    onSelectArea,
    onUpdateArea,
    onAddArea,
    onDeleteArea,
    extinguishers,
    allExtinguishers,
    onSelectExtinguisher,
    onAddExtinguisher,
    onDeleteExtinguisher,
    onResetInspections,
    inspectionFormat,
}) => {
    const [newAreaName, setNewAreaName] = useState('');
    const [modalContent, setModalContent] = useState<{ type: 'loading' | 'success' | 'error', message: string, url?: string } | null>(null);
    const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);

    const isLoading = modalContent?.type === 'loading';

    const requestPasswordForAction = (action: () => void) => {
        setActionToConfirm(() => action);
    };

    const handleAddAreaWithAuth = () => {
        const name = newAreaName.trim();
        if (name) {
            requestPasswordForAction(() => {
                onAddArea(name);
                setNewAreaName('');
            });
        }
    };
    
    const handleGenerateProgressReport = async () => {
        const inspectedExtinguishers = allExtinguishers.filter(ext => 
            !ext.questions.some(q => q.answer === AnswerStatus.NA)
        );

        if (inspectedExtinguishers.length === 0) {
            alert(
                `No se puede generar el reporte.\n\n` +
                `Aún no se ha completado la inspección de ningún extintor.`
            );
            return;
        }

        const { utils } = window.XLSX;
        const wb = utils.book_new();

        areas.forEach(area => {
            const extinguishersInArea = inspectedExtinguishers.filter(ext => ext.areaId === area.id);
            if (extinguishersInArea.length === 0) return;

            const data: (string | null)[][] = [
                [`Reporte de Inspección: ${area.name}`],
                [`Fecha de Reporte: ${new Date().toLocaleDateString()}`],
                []
            ];

            extinguishersInArea.forEach((ext) => {
                data.push([`Extintor: ${ext.location} (SN: ${ext.serialNumber})`]);
                data.push([`Tipo: ${ext.type}`, `Capacidad: ${ext.capacity}`]);
                data.push([`Última Inspección Individual: ${ext.lastInspection}`]);
                data.push(["Pregunta", "Estado", "Comentarios"]);
                ext.questions.forEach(q => {
                    data.push([q.question, q.answer, q.comments]);
                });
                data.push([]);
            });
            
            const ws = utils.aoa_to_sheet(data);
            ws['!cols'] = [ { wch: 50 }, { wch: 20 }, { wch: 50 } ];

            const sheetName = area.name.replace(/[\\/*?:"<>|]/g, '').substring(0, 31);
            utils.book_append_sheet(wb, ws, sheetName);
        });

        if (wb.SheetNames.length > 0) {
            const reportDate = new Date().toISOString().split('T')[0];
            const filename = `Reporte Extintores ${reportDate}.xlsx`;
            const base64Data = window.XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

            setModalContent({ type: 'loading', message: 'Subiendo reporte de progreso...' });
            const result = await sendReportToServer(base64Data, filename);

            if (result.status === 'success') {
                setModalContent({ type: 'success', message: 'Reporte de progreso subido exitosamente.', url: result.url });
            } else {
                setModalContent({ type: 'error', message: result.message || 'Ocurrió un error al subir el reporte.' });
            }
        } else {
             alert(
                `No se puede generar el reporte.\n\n` +
                `No se encontraron inspecciones completadas para incluir.`
            );
        }
    };

    const handleGenerateReportForArea = async () => {
        if (!selectedAreaId) return;
    
        const area = areas.find(a => a.id === selectedAreaId);
        if (!area) return;
    
        const allInspectedInArea = extinguishers.every(ext => !ext.questions.some(q => q.answer === AnswerStatus.NA));
        if (!allInspectedInArea) {
            alert("Todos los extintores del área deben estar inspeccionados para generar el reporte.");
            return;
        }
    
        setModalContent({ type: 'loading', message: 'Subiendo reporte de área...' });
    
        const { utils } = window.XLSX;
        const wb = utils.book_new();
    
        const data: (string | null)[][] = [
            [`Reporte de Inspección: ${area.name}`],
            [`Fecha de Reporte: ${new Date().toLocaleDateString()}`],
            []
        ];
    
        extinguishers.forEach((ext) => {
            data.push([`Extintor: ${ext.location} (SN: ${ext.serialNumber})`]);
            data.push([`Tipo: ${ext.type}`, `Capacidad: ${ext.capacity}`]);
            data.push([`Última Inspección Individual: ${ext.lastInspection}`]);
            data.push(["Pregunta", "Estado", "Comentarios"]);
            ext.questions.forEach(q => {
                data.push([q.question, q.answer, q.comments]);
            });
            data.push([]);
        });
    
        const ws = utils.aoa_to_sheet(data);
        ws['!cols'] = [{ wch: 50 }, { wch: 20 }, { wch: 50 }];
    
        const sheetName = area.name.replace(/[\\/*?:"<>|]/g, '').substring(0, 31);
        utils.book_append_sheet(wb, ws, sheetName);
    
        const reportDate = new Date().toISOString().split('T')[0];
        const filename = `Reporte Área ${area.name} - ${reportDate}.xlsx`;
        const base64Data = window.XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    
        const result = await sendReportToServer(base64Data, filename);
    
        if (result.status === 'success') {
            setModalContent({ type: 'success', message: 'Reporte de área subido exitosamente.', url: result.url });
        } else {
            setModalContent({ type: 'error', message: result.message || 'Ocurrió un error al subir el reporte.' });
        }
    };
    
    const handleFinishAllInspections = async () => {
        const uninspected = allExtinguishers.filter(ext =>
            ext.questions.some(q => q.answer === AnswerStatus.NA)
        );

        if (uninspected.length > 0) {
            const groupedByArea = uninspected.reduce((acc, ext) => {
                (acc[ext.areaId] = acc[ext.areaId] || []).push(ext);
                return acc;
            }, {} as Record<string, Extinguisher[]>);

            let alertMessage = "No se puede finalizar la inspección.\n\n" +
                "Los siguientes extintores tienen inspecciones pendientes:\n";

            Object.keys(groupedByArea).forEach(areaId => {
                const area = areas.find(a => a.id === areaId);
                alertMessage += `\nÁrea: ${area ? area.name : 'Desconocida'}\n`;
                groupedByArea[areaId].forEach(ext => {
                    alertMessage += `- ${ext.location} (SN: ${ext.serialNumber})\n`;
                });
            });

            alert(alertMessage);
            return;
        }

        const { utils } = window.XLSX;
        const wb = utils.book_new();

        areas.forEach(area => {
            const extinguishersInArea = allExtinguishers.filter(ext => ext.areaId === area.id);
            if (extinguishersInArea.length === 0) return;

            const data: (string | null)[][] = [
                [`Reporte de Inspección: ${area.name}`],
                [`Fecha de Reporte: ${new Date().toLocaleDateString()}`],
                []
            ];

            extinguishersInArea.forEach((ext) => {
                data.push([`Extintor: ${ext.location} (SN: ${ext.serialNumber})`]);
                data.push([`Tipo: ${ext.type}`, `Capacidad: ${ext.capacity}`]);
                data.push([`Última Inspección Individual: ${ext.lastInspection}`]);
                data.push(["Pregunta", "Estado", "Comentarios"]);
                ext.questions.forEach(q => {
                    data.push([q.question, q.answer, q.comments]);
                });
                data.push([]);
            });
            
            const ws = utils.aoa_to_sheet(data);
            ws['!cols'] = [ { wch: 50 }, { wch: 20 }, { wch: 50 } ];

            const sheetName = area.name.replace(/[\\/*?:"<>|]/g, '').substring(0, 31);
            utils.book_append_sheet(wb, ws, sheetName);
        });

        const reportDate = new Date().toISOString().split('T')[0];
        const filename = `Reporte Extintores ${reportDate}.xlsx`;
        const base64Data = window.XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

        setModalContent({ type: 'loading', message: 'Subiendo reporte final...' });
        const result = await sendReportToServer(base64Data, filename);

        if (result.status === 'success') {
            setModalContent({ type: 'success', message: 'Reporte final subido exitosamente. Las inspecciones se han reiniciado.', url: result.url });
            onResetInspections();
        } else {
            setModalContent({ type: 'error', message: result.message || 'Ocurrió un error al subir el reporte final.' });
        }
    };

    const inspectedCount = allExtinguishers.filter(ext => !ext.questions.some(q => q.answer === AnswerStatus.NA)).length;
    const inspectedInAreaCount = extinguishers.filter(ext => !ext.questions.some(q => q.answer === AnswerStatus.NA)).length;
    
    const areAllExtinguishersInAreaInspected = 
        inspectionFormat === 'area' && 
        selectedAreaId && 
        extinguishers.length > 0 && 
        extinguishers.every(ext => !ext.questions.some(q => q.answer === AnswerStatus.NA));

    const isDownloadButtonDisabled = isLoading || (
        inspectionFormat === 'area' ? !areAllExtinguishersInAreaInspected : (inspectedCount === 0)
    );

    const downloadButtonTitle = inspectionFormat === 'area' 
    ? (
        !selectedAreaId 
            ? "Seleccione un área" 
            : extinguishers.length === 0 
                ? "No hay extintores en esta área"
                : !areAllExtinguishersInAreaInspected 
                    ? "Debe inspeccionar todos los extintores de esta área para descargar el reporte" 
                    : "Descargar reporte del área seleccionada"
      )
    : (
        inspectedCount === 0 
            ? "Inspeccione al menos un extintor para guardar el reporte" 
            : "Guardar reporte de progreso de todos los extintores inspeccionados"
      );


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Zona de Inspección</h2>
                <div className="grid grid-cols-1 gap-3 mb-4">
                    {areas.map(area => (
                       <EditableListItem 
                            key={area.id}
                            item={area}
                            onUpdate={(item) => requestPasswordForAction(() => onUpdateArea(item as Area))}
                            onDelete={(id) => requestPasswordForAction(() => onDeleteArea(id))}
                            isSelected={selectedAreaId === area.id}
                            onSelect={onSelectArea}
                       />
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newAreaName}
                        onChange={(e) => setNewAreaName(e.target.value)}
                        placeholder="Nombre de la nueva área..."
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-white text-gray-900"
                    />
                    <button onClick={handleAddAreaWithAuth} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 flex items-center justify-center">
                        <PlusIcon />
                    </button>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-xl font-bold text-gray-700">Extintores Registrados</h2>
                            {inspectionFormat === 'area' ? (
                                <span className="font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {selectedAreaId ? `${inspectedInAreaCount} / ${extinguishers.length} Inspeccionados` : `- / -`}
                                </span>
                            ) : (
                                <span className="font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {inspectedCount} / {allExtinguishers.length} Inspeccionados
                                </span>
                            )}
                        </div>
                        {inspectionFormat === 'individual' && (
                            <button
                                onClick={handleFinishAllInspections}
                                className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm disabled:bg-gray-400 disabled:cursor-wait"
                                aria-label="Finalizar y Subir Reporte"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enviando...' : 'Finalizar y Subir Reporte'}
                            </button>
                        )}
                        <button 
                            onClick={inspectionFormat === 'area' ? handleGenerateReportForArea : handleGenerateProgressReport}
                            className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-wait text-sm" 
                            disabled={isDownloadButtonDisabled}
                            aria-label={downloadButtonTitle}
                            title={downloadButtonTitle}
                        >
                            {isLoading ? (
                                <span>Enviando...</span>
                            ) : (
                                <>
                                    <DownloadIcon className="w-5 h-5" />
                                    <span>{inspectionFormat === 'area' ? 'Reporte por Área' : 'Guardar Reporte'}</span>
                                </>
                            )}
                        </button>
                    </div>
                    {selectedAreaId && (
                        <div className="flex items-center flex-wrap gap-2">
                            <button onClick={() => requestPasswordForAction(() => onAddExtinguisher(selectedAreaId))} className="flex items-center space-x-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200" aria-label="Registrar Nuevo Extintor">
                                <PlusIcon className="w-5 h-5" />
                                <span>Registrar Nuevo</span>
                            </button>
                        </div>
                    )}
                </div>
                {selectedAreaId ? (
                     extinguishers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {extinguishers.map(ext => (
                                <ExtinguisherCard key={ext.id} extinguisher={ext} onSelect={onSelectExtinguisher} onDelete={(id) => requestPasswordForAction(() => onDeleteExtinguisher(id))} />
                            ))}
                        </div>
                     ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                            <p className="text-gray-500">No hay extintores registrados en esta área.</p>
                            <p className="text-gray-400 text-sm mt-2">Haga clic en "Registrar Nuevo" para añadir uno.</p>
                        </div>
                     )
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <p className="text-gray-500">Por favor, seleccione un área para ver los extintores.</p>
                    </div>
                )}
            </div>
            {modalContent && (
                <Modal onClose={() => setModalContent(null)} size="lg">
                    {modalContent.type === 'loading' && (
                        <div>
                            <Spinner />
                            <p className="mt-4 text-lg font-semibold text-gray-700">{modalContent.message}</p>
                        </div>
                    )}
                    {modalContent.type === 'success' && (
                        <div>
                            <h3 className="text-2xl font-bold text-green-600">¡Éxito!</h3>
                            <p className="mt-2 text-gray-700">{modalContent.message}</p>
                            <button onClick={() => setModalContent(null)} className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">
                                Cerrar
                            </button>
                        </div>
                    )}
                    {modalContent.type === 'error' && (
                        <div>
                            <h3 className="text-2xl font-bold text-red-600">Error</h3>
                            <p className="mt-2 text-gray-700">Ocurrió un problema al generar el reporte:</p>
                            <p className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{modalContent.message}</p>
                             <button onClick={() => setModalContent(null)} className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">
                                Cerrar
                            </button>
                        </div>
                    )}
                </Modal>
            )}
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

export default MainView;