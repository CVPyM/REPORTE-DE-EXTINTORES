export enum AnswerStatus {
  PASS = 'Si',
  FAIL = 'No',
  NA = 'N/A',
}

export interface InspectionQuestion {
  id: string;
  question: string;
  answer: AnswerStatus;
  comments: string;
}

export enum ExtinguisherType {
  WATER = 'Agua',
  CO2 = 'CO2',
  PQS = 'PQS',
  HFC236FA = 'HFC-236-FA',
}

export interface Extinguisher {
  id: string;
  areaId: string;
  location: string;
  type: ExtinguisherType;
  capacity: string; // Nuevo campo
  lastInspection: string;
  serialNumber: string;
  questions: InspectionQuestion[];
}

export interface Area {
  id: string;
  name: string;
}