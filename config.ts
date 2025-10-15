
export interface Memento {
    name: string;
    description: string;
}

export interface InteractableObject {
    name: string;
    description: string;
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

export interface RelationshipChange {
    character: 'Bapak' | 'Ibu' | 'Surya';
    change: number;
}