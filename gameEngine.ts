// ===================================
// GAME ENGINE
// Core game logic and state management
// ===================================

import type { GameState, StoryChoice, InteractableObject, Memento, LogbookEntry } from './types';
import { storyData } from './storyData';

const STORAGE_KEY = 'ruang-hampa-save';
const INTRO_TEXT = `Selamat datang di Ruang Hampa.

Ini adalah sebuah simulasi naratif yang mengeksplorasi pengalaman hidup dengan depresi dalam konteks keluarga Indonesia.

Game ini mengandung tema sensitif termasuk kesehatan mental, konflik keluarga, dan kesulitan emosional.

Pilihanmu akan membentuk cerita. Tidak ada jawaban benar atau salah—hanya pengalaman yang berbeda.

Mohon bermain dengan bijak.`;

/**
 * Game Engine Class
 * Manages all game state, progression, and save/load functionality
 */
export class GameEngine {
  private state: GameState;
  private introText: string = INTRO_TEXT;

  constructor() {
    console.log('[GameEngine] 🎮 Initializing game engine...');
    this.state = this.createDefaultState();
    console.log('[GameEngine] ✓ Game engine initialized');
  }

  /**
   * Creates the default initial game state
   */
  private createDefaultState(): GameState {
    console.log('[GameEngine] Creating default game state');
    return {
      currentNodeId: 'START',
      mentalEnergy: 50,
      relationships: {
        bapak: 50,
        ibu: 50,
        surya: 50,
      },
      mementos: [],
      logbookHistory: [],
      typingSpeed: 30,
      hasSeenIntro: false,
    };
  }

  /**
   * Gets the current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Gets the intro text
   */
  getIntroText(): string {
    return this.introText;
  }

  /**
   * Marks intro as seen
   */
  markIntroAsSeen(): void {
    console.log('[GameEngine] Marking intro as seen');
    this.state.hasSeenIntro = true;
  }

  /**
   * Gets the current story node
   */
  getCurrentNode() {
    const node = storyData[this.state.currentNodeId];
    if (!node) {
      console.error(`[GameEngine] ✗ Story node not found: ${this.state.currentNodeId}`);
      return storyData['START']; // Fallback to START if node not found
    }
    console.log(`[GameEngine] Current node: ${this.state.currentNodeId}`);
    return node;
  }

  /**
   * Processes a player's choice and updates game state
   */
  makeChoice(choice: StoryChoice): void {
    console.log(`[GameEngine] 🎯 Player chose: "${choice.text}"`);
    console.log(`[GameEngine] Moving to node: ${choice.nextNodeId}`);

    // Log the choice
    this.logChoice(choice);

    // Apply mental energy change
    if (choice.mentalEnergyChange) {
      this.changeMentalEnergy(choice.mentalEnergyChange);
    }

    // Apply relationship change
    if (choice.relationshipChange) {
      const { character, change } = choice.relationshipChange;
      this.changeRelationship(character, change);
    }

    // Move to next node
    this.state.currentNodeId = choice.nextNodeId;

    // Get the new node
    const newNode = storyData[choice.nextNodeId];
    if (!newNode) {
      console.error(`[GameEngine] ✗ Invalid next node: ${choice.nextNodeId}`);
      return;
    }

    // Apply node's mental energy if specified
    if (newNode.mentalEnergy !== undefined) {
      console.log(`[GameEngine] Setting mental energy to: ${newNode.mentalEnergy}`);
      this.state.mentalEnergy = newNode.mentalEnergy;
    }

    // Add memento if present
    if (newNode.newMemento) {
      this.addMemento(newNode.newMemento);
    }

    // Auto-save after each choice
    this.saveGame();
  }

  /**
   * Handles interactable object interaction
   */
  interactWithObject(object: InteractableObject): void {
    console.log(`[GameEngine] 🔍 Interacting with: "${object.name}"`);
    console.log(`[GameEngine] Description: "${object.description}"`);
  }

  /**
   * Changes mental energy with bounds checking
   */
  private changeMentalEnergy(change: number): void {
    const oldValue = this.state.mentalEnergy;
    this.state.mentalEnergy = Math.max(0, Math.min(100, this.state.mentalEnergy + change));
    console.log(`[GameEngine] Mental Energy: ${oldValue} → ${this.state.mentalEnergy} (${change >= 0 ? '+' : ''}${change})`);
  }

  /**
   * Changes relationship value with bounds checking
   */
  private changeRelationship(character: 'Bapak' | 'Ibu' | 'Surya', change: number): void {
    const key = character.toLowerCase() as keyof typeof this.state.relationships;
    const oldValue = this.state.relationships[key];
    this.state.relationships[key] = Math.max(0, Math.min(100, this.state.relationships[key] + change));
    console.log(`[GameEngine] Relationship [${character}]: ${oldValue} → ${this.state.relationships[key]} (${change >= 0 ? '+' : ''}${change})`);
  }

  /**
   * Adds a memento to the collection
   */
  private addMemento(memento: Memento): void {
    if (!this.state.mementos.some(m => m.name === memento.name)) {
      console.log(`[GameEngine] ✓ New memento discovered: "${memento.name}"`);
      this.state.mementos.push(memento);
    }
  }

  /**
   * Logs a choice to the logbook
   */
  private logChoice(choice: StoryChoice): void {
    const entry: LogbookEntry = {
      nodeId: this.state.currentNodeId,
      choice: choice.text,
      timestamp: new Date().toISOString(),
    };
    this.state.logbookHistory.push(entry);
    console.log(`[GameEngine] 📝 Logged choice: "${choice.text}"`);
  }

  /**
   * Updates typing speed setting
   */
  setTypingSpeed(speed: number): void {
    this.state.typingSpeed = Math.max(1, Math.min(100, speed));
    console.log(`[GameEngine] ⚙️ Typing speed set to: ${this.state.typingSpeed}`);
    this.saveGame();
  }

  /**
   * Saves the current game state to localStorage
   */
  saveGame(): void {
    try {
      const serialized = JSON.stringify(this.state);
      localStorage.setItem(STORAGE_KEY, serialized);
      console.log('[GameEngine] 💾 Game saved successfully');
    } catch (error) {
      console.error('[GameEngine] ✗ Failed to save game:', error);
    }
  }

  /**
   * Loads game state from localStorage
   */
  loadGame(): boolean {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        console.log('[GameEngine] No saved game found');
        return false;
      }

      const loaded = JSON.parse(serialized) as GameState;
      
      // Validate loaded data
      if (!loaded.currentNodeId || !storyData[loaded.currentNodeId]) {
        console.warn('[GameEngine] ⚠️ Invalid save data, starting new game');
        return false;
      }

      this.state = loaded;
      console.log('[GameEngine] ✓ Game loaded successfully');
      console.log(`[GameEngine] Loaded state: Node=${loaded.currentNodeId}, Energy=${loaded.mentalEnergy}`);
      return true;
    } catch (error) {
      console.error('[GameEngine] ✗ Failed to load game:', error);
      return false;
    }
  }

  /**
   * Checks if a saved game exists
   */
  hasSavedGame(): boolean {
    const exists = localStorage.getItem(STORAGE_KEY) !== null;
    console.log(`[GameEngine] Saved game exists: ${exists}`);
    return exists;
  }

  /**
   * Starts a new game (resets state)
   */
  startNewGame(): void {
    console.log('[GameEngine] 🔄 Starting new game');
    this.state = this.createDefaultState();
    this.saveGame();
    console.log('[GameEngine] ✓ New game started');
  }

  /**
   * Resets the game completely
   */
  resetGame(): void {
    console.log('[GameEngine] 🔄 Resetting game completely');
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.createDefaultState();
    console.log('[GameEngine] ✓ Game reset complete');
  }

  /**
   * Gets all mementos
   */
  getMementos(): Memento[] {
    return [...this.state.mementos];
  }

  /**
   * Gets logbook history
   */
  getLogbookHistory(): LogbookEntry[] {
    return [...this.state.logbookHistory];
  }

  /**
   * Gets relationships
   */
  getRelationships() {
    return { ...this.state.relationships };
  }

  /**
   * Debug: Print current state
   */
  debugPrintState(): void {
    console.group('[GameEngine] 🐛 Debug State');
    console.log('Current Node:', this.state.currentNodeId);
    console.log('Mental Energy:', this.state.mentalEnergy);
    console.log('Relationships:', this.state.relationships);
    console.log('Mementos:', this.state.mementos.length);
    console.log('Logbook Entries:', this.state.logbookHistory.length);
    console.log('Typing Speed:', this.state.typingSpeed);
    console.log('Has Seen Intro:', this.state.hasSeenIntro);
    console.groupEnd();
  }
}
