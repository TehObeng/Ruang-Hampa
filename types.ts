// ===================================
// TYPE DEFINITIONS
// All TypeScript interfaces and types
// ===================================

export interface Memento {
  name: string;
  description: string;
}

export interface InteractableObject {
  name: string;
  description: string;
}

export interface RelationshipChange {
  character: 'Bapak' | 'Ibu' | 'Surya';
  change: number;
}

export interface StoryChoice {
  text: string;
  nextNodeId: string;
  mentalEnergyChange?: number;
  relationshipChange?: RelationshipChange;
}

export interface StoryNode {
  story: string;
  location: string;
  image?: string;
  mentalEnergy?: number;
  interactableObjects: InteractableObject[];
  actions: StoryChoice[];
  newMemento?: Memento;
}

export type StoryData = {
  [key: string]: StoryNode;
};

export interface Relationships {
  bapak: number;
  ibu: number;
  surya: number;
}

export interface GameState {
  currentNodeId: string;
  mentalEnergy: number;
  relationships: Relationships;
  mementos: Memento[];
  logbookHistory: LogbookEntry[];
  typingSpeed: number;
  hasSeenIntro: boolean;
}

export interface LogbookEntry {
  nodeId: string;
  choice: string;
  timestamp: string;
}

export type ModalType = 'settings' | 'journal' | 'none';

export interface NotificationData {
  id: number;
  message: string;
  type: 'success' | 'error';
}
