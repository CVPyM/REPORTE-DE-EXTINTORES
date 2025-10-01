

import React, { useState, useEffect } from 'react';
import { Area, Extinguisher, AnswerStatus, ExtinguisherType, InspectionQuestion } from './types';
import MainView from './components/MainView';
import InspectionView from './components/InspectionView';
import LaunchScreen from './components/LaunchScreen';

// Clear saved data on application start
localStorage.removeItem('fire-extinguisher-app-areas');
localStorage.removeItem('fire-extinguisher-app-extinguishers');

const INITIAL_AREAS: Area[] = [
  { id: 'area-1', name: 'Planta Alta' },
  { id: 'area-2', name: 'Alto Valor' },
  { id: 'area-3', name: 'Empaque TV' },
  { id: 'area-4', name: 'Remate Tienda' },
  { id: 'area-5', name: 'Reacondicionado' },
  { id: 'area-6', name: 'Planta Baja' },
  { id: 'area-7', name: 'Distribución y Mensajería' },
  { id: 'area-8', name: 'Estacionamiento' },
  { id: 'area-9', name: 'Recibo' },
  { id: 'area-10', name: 'Oficinas' },
  { id: 'area-11', name: 'Bodega F' },
  { id: 'area-12', name: 'Mantenimiento' },
  { id: 'area-13', name: 'Site' },
];

const DEFAULT_INSPECTION_QUESTIONS: InspectionQuestion[] = [
    { id: 'q-std-1', question: '¿El extintor cuenta con presión?', answer: AnswerStatus.NA, comments: '' },
    { id: 'q-std-2', question: '¿El extintor cuenta con manguera, boquilla y cono?', answer: AnswerStatus.NA, comments: '' },
    { id: 'q-std-3', question: '¿El extintor cuenta con manómetro?', answer: AnswerStatus.NA, comments: '' },
    { id: 'q-std-4', question: '¿El extintor se encuentra en buen estado?', answer: AnswerStatus.NA, comments: '' },
    { id: 'q-std-5', question: '¿La señalización se encuentra visible?', answer: AnswerStatus.NA, comments: '' },
    { id: 'q-std-6', question: '¿El extintor cuenta con su sello y pasador de seguridad?', answer: AnswerStatus.NA, comments: '' },
    { id: 'q-std-7', question: '¿El extintor se encuentra libre de obstáculos?', answer: AnswerStatus.NA, comments: '' },
];

const createInitialExtinguishers = (): Extinguisher[] => {
    // Helper function to get a fresh, deep copy of the default questions.
    // This ensures each extinguisher starts uninspected and has its own question set.
    const getInitialQuestions = () => JSON.parse(JSON.stringify(DEFAULT_INSPECTION_QUESTIONS));

    return [
        {
            id: 'ext-1',
            areaId: 'area-1',
            location: 'Insumos',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '01',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-2',
            areaId: 'area-1',
            location: 'Comedor PA',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '02',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-3',
            areaId: 'area-1',
            location: 'Baños PA',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '03',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-4',
            areaId: 'area-1',
            location: 'Patines PA',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '04',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-5',
            areaId: 'area-1',
            location: 'Picking PA COM',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '05',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-6',
            areaId: 'area-1',
            location: 'Ascensor REC',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '06',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-7',
            areaId: 'area-1',
            location: 'Picking Sham',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '07',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-8',
            areaId: 'area-1',
            location: 'EPEL',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '08',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-9',
            areaId: 'area-1',
            location: 'Ascensor Dev',
            type: ExtinguisherType.CO2,
            capacity: '4.5 kg',
            lastInspection: '2023-10-15',
            serialNumber: '15',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-10',
            areaId: 'area-2',
            location: 'Alto Valor AF',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '16',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-11',
            areaId: 'area-2',
            location: 'Agua AV',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '17',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-12',
            areaId: 'area-2',
            location: 'Agua AV',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '17',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-13',
            areaId: 'area-2',
            location: 'Alto Valor',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '19',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-14',
            areaId: 'area-2',
            location: 'Alto Valor',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '20',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-15',
            areaId: 'area-2',
            location: 'Alto Valor',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '21',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-16',
            areaId: 'area-2',
            location: 'Alto Valor',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '22',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-17',
            areaId: 'area-2',
            location: 'Alto Valor',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '23',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-18',
            areaId: 'area-3',
            location: 'Empaque HUMO',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '09',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-19',
            areaId: 'area-3',
            location: 'Escaneo EMP',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '10',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-20',
            areaId: 'area-3',
            location: 'Cajas EMP',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '11',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-21',
            areaId: 'area-4',
            location: 'Devol 2',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '24',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-22',
            areaId: 'area-4',
            location: 'Devol 2',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '25',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-23',
            areaId: 'area-5',
            location: 'Puerta Roja',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '12',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-24',
            areaId: 'area-5',
            location: 'Botiquin R',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '13',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-25',
            areaId: 'area-5',
            location: 'Tablero AV',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '18',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-26',
            areaId: 'area-6',
            location: 'Subestación',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '01',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-27',
            areaId: 'area-6',
            location: 'Mantenimiento',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '02',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-28',
            areaId: 'area-6',
            location: 'Lockers',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '04',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-29',
            areaId: 'area-6',
            location: 'Escalera Lockers',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '05',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-30',
            areaId: 'area-6',
            location: 'Pasillo Dev',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '06',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-31',
            areaId: 'area-6',
            location: 'Devoluciones Escalera',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '07',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-32',
            areaId: 'area-7',
            location: 'Mensajería',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '08',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-33',
            areaId: 'area-7',
            location: 'Rack Men',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '09',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-34',
            areaId: 'area-7',
            location: 'Baños Men',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '10',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-35',
            areaId: 'area-7',
            location: 'Baños Men',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '11',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-36',
            areaId: 'area-8',
            location: 'Mens. Exterior',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '13',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-37',
            areaId: 'area-8',
            location: 'Estacionamiento',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '14',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-38',
            areaId: 'area-8',
            location: 'Estacionamiento',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '15',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-39',
            areaId: 'area-8',
            location: 'Estacionamiento',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '16',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-40',
            areaId: 'area-9',
            location: 'Recibo Ent',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '17',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-41',
            areaId: 'area-9',
            location: 'Recibo Agua',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '18',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-42',
            areaId: 'area-9',
            location: 'Tarimas Recibo',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '19',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-43',
            areaId: 'area-9',
            location: 'Pared Recibo',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '20',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-44',
            areaId: 'area-9',
            location: 'Monta Rec',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '21',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-45',
            areaId: 'area-9',
            location: 'Recibo Agua',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '22',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-46',
            areaId: 'area-9',
            location: 'Recibo Fondo',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '23',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-47',
            areaId: 'area-10',
            location: 'Frente Sala RH',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '10',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-48',
            areaId: 'area-10',
            location: 'RRHH',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '12',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-49',
            areaId: 'area-10',
            location: 'RRHH Entrada',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '13',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-50',
            areaId: 'area-10',
            location: 'RRHH',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '09',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-51',
            areaId: 'area-10',
            location: 'Finanzas Site',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '05',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-52',
            areaId: 'area-10',
            location: 'Comedor RRHH',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '04',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-53',
            areaId: 'area-10',
            location: 'Finanzas',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '03',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-54',
            areaId: 'area-10',
            location: 'Sala Finan 02',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '02',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-55',
            areaId: 'area-10',
            location: 'Finanzas',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '01',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-56',
            areaId: 'area-11',
            location: 'Entrada B.F.',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '01',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-57',
            areaId: 'area-11',
            location: 'Maquila',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '06',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-58',
            areaId: 'area-11',
            location: 'Pasillo F',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '03',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-59',
            areaId: 'area-11',
            location: 'Pasillo AB',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '04',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-60',
            areaId: 'area-11',
            location: 'Rack Maquila',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '05',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-61',
            areaId: 'area-11',
            location: 'Retaila',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '02',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-62',
            areaId: 'area-11',
            location: 'Lockers',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '08',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-63',
            areaId: 'area-12',
            location: 'Mantto F',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '09',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-64',
            areaId: 'area-12',
            location: 'Mantto F',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '12',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-65',
            areaId: 'area-12',
            location: 'Mantto F',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '11',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-66',
            areaId: 'area-12',
            location: 'Mantto F',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '10',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-67',
            areaId: 'area-13',
            location: 'Site 1',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '01',
            questions: getInitialQuestions(),
        },
        {
            id: 'ext-68',
            areaId: 'area-13',
            location: 'Site 2',
            type: ExtinguisherType.PQS,
            capacity: '6.0 kg',
            lastInspection: '2023-11-01',
            serialNumber: '02',
            questions: getInitialQuestions(),
        },
    ];
};

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return defaultValue;
};


const App: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>(() => getInitialState('fire-extinguisher-app-areas', INITIAL_AREAS));
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>(() => getInitialState('fire-extinguisher-app-extinguishers', createInitialExtinguishers()));
  
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(() => {
    const loadedAreas = getInitialState('fire-extinguisher-app-areas', INITIAL_AREAS);
    return loadedAreas[0]?.id || null;
  });
  const [selectedExtinguisherId, setSelectedExtinguisherId] = useState<string | null>(null);

  const [view, setView] = useState<'launch' | 'main'>('launch');
  const [userName, setUserName] = useState<string>('');
  const [inspectionFormat, setInspectionFormat] = useState<'individual' | 'area'>('area');

  useEffect(() => {
    try {
      localStorage.setItem('fire-extinguisher-app-areas', JSON.stringify(areas));
// FIX: Added missing curly braces for the catch block. This syntax error caused all subsequent errors.
    } catch (error) {
      console.error('Error saving areas to localStorage:', error);
    }
  }, [areas]);

  useEffect(() => {
    try {
      localStorage.setItem('fire-extinguisher-app-extinguishers', JSON.stringify(extinguishers));
    } catch (error) {
      console.error('Error saving extinguishers to localStorage:', error);
    }
  }, [extinguishers]);

  useEffect(() => {
    if (selectedAreaId && !areas.some(area => area.id === selectedAreaId)) {
        setSelectedAreaId(areas[0]?.id || null);
    }
  }, [areas, selectedAreaId]);

  const handleStart = (name: string, format: 'individual' | 'area') => {
    setUserName(name);
    setInspectionFormat(format);
    setView('main');
  };

  const handleResetInspections = () => {
    setExtinguishers(prev => prev.map(ext => ({
        ...ext,
        questions: JSON.parse(JSON.stringify(DEFAULT_INSPECTION_QUESTIONS))
    })));
  };

  const handleUpdateArea = (updatedArea: Area) => {
    setAreas(areas.map(area => area.id === updatedArea.id ? updatedArea : area));
  };

  const handleAddArea = (name: string) => {
    const newArea: Area = { id: `area-${Date.now()}`, name };
    setAreas([...areas, newArea]);
  };

  const handleDeleteArea = (areaId: string) => {
    setAreas(areas.filter(area => area.id !== areaId));
    setExtinguishers(extinguishers.filter(ext => ext.areaId !== areaId));
  };
  
  const handleAddExtinguisher = (areaId: string) => {
    const newExtinguisher: Extinguisher = {
        id: `ext-${Date.now()}`,
        areaId: areaId,
        location: 'Nueva Ubicación',
        type: ExtinguisherType.WATER,
        capacity: '2.5 kg',
        lastInspection: new Date().toISOString().split('T')[0],
        serialNumber: `SN-${Date.now().toString().slice(-6)}`,
        questions: JSON.parse(JSON.stringify(DEFAULT_INSPECTION_QUESTIONS))
    };
    setExtinguishers([...extinguishers, newExtinguisher]);
  };

  const handleDeleteExtinguisher = (extinguisherId: string) => {
      setExtinguishers(extinguishers.filter(ext => ext.id !== extinguisherId));
  };

  const handleUpdateExtinguisher = (updatedExtinguisher: Extinguisher) => {
    setExtinguishers(extinguishers.map(ext => ext.id === updatedExtinguisher.id ? updatedExtinguisher : ext));
  };

  const selectedExtinguisher = extinguishers.find(ext => ext.id === selectedExtinguisherId) || null;
  const filteredExtinguishers = extinguishers.filter(ext => ext.areaId === selectedAreaId);

  if (view === 'launch') {
    return <LaunchScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Registro de Extintores</h1>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Inspector</span>
            <p className="font-semibold text-gray-800">{userName}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedExtinguisher ? (
          <InspectionView
            extinguisher={selectedExtinguisher}
            onUpdate={handleUpdateExtinguisher}
            onBack={() => setSelectedExtinguisherId(null)}
          />
        ) : (
          <MainView
            areas={areas}
            selectedAreaId={selectedAreaId}
            onSelectArea={setSelectedAreaId}
            onUpdateArea={handleUpdateArea}
            onAddArea={handleAddArea}
            onDeleteArea={handleDeleteArea}
            extinguishers={filteredExtinguishers}
            allExtinguishers={extinguishers}
            onSelectExtinguisher={setSelectedExtinguisherId}
            onAddExtinguisher={handleAddExtinguisher}
            onDeleteExtinguisher={handleDeleteExtinguisher}
            onResetInspections={handleResetInspections}
            inspectionFormat={inspectionFormat}
          />
        )}
      </main>
    </div>
  );
};

export default App;
