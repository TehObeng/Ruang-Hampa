
import "./index.css";
import * as UI from "./src/ui";
import { story } from "./src/story";
import type { Memento, StoryChoice, InteractableObject, Relationships } from "./src/config";

// Interfaces for state management
interface Settings {
    typingSpeed: number;
}

interface LogEntry {
    choice: string;
    thought: string;
}

interface SavedState {
    storyHistory: string[];
    logbookHistory: LogEntry[];
    mementos: Memento[];
    relationships: Relationships;
    currentNodeId: string;
    currentMentalEnergy: number;
    currentMusic: string;
}


// Game state variables
let isGenerating = false; // Now used to prevent clicks while text is typing
let storyHistory: string[] = [];
let logbookHistory: LogEntry[] = [];
let mementos: Memento[] = [];
let currentMusic: string = 'None';
let currentMentalEnergy: number = 0;
let currentLocation: string = '';
let currentNodeId: string = 'START';
let relationships: Relationships = { bapak: 50, ibu: 50, surya: 50 };
let settings: Settings = {
    typingSpeed: 50, // Default speed: Medium
};

const SAVE_KEY = 'ruangHampaSaveData_Static';
const SETTINGS_KEY = 'ruangHampaSettings';

// --- LocalStorage Helper Functions ---
function saveData<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function removeData(key: string) {
    localStorage.removeItem(key);
}

/**
 * Renders the UI based on a specific node from the static story data.
 * @param nodeId The ID of the story node to render.
 */
async function renderState(nodeId: string) {
    const node = story[nodeId];
    if (!node) {
        console.error(`Story node with ID "${nodeId}" not found.`);
        return;
    }
    
    isGenerating = true;
    UI.setLoading(true);
    UI.updateInteractableObjects([], () => {});
    UI.updateChoices([], () => {});

    currentNodeId = nodeId;
    currentLocation = node.location;
    storyHistory.push(node.story);
    UI.updateHeaderImage(node.image);

    if (node.mentalEnergy !== undefined) {
        UI.updateMentalEnergy(node.mentalEnergy);
        currentMentalEnergy = node.mentalEnergy;
    }

    if (node.newMemento) {
        const mementoExists = mementos.some(m => m.name === node.newMemento!.name);
        if (!mementoExists) {
            mementos.push(node.newMemento);
            UI.showNotification(`Kenang-kenangan ditemukan: ${node.newMemento.name}`);
        }
    }
    
    await UI.updateStory(node.story, settings.typingSpeed);
    
    UI.updateInteractableObjects(node.interactableObjects, handleObjectInteraction);
    UI.updateChoices(node.actions, handleChoice);
    
    UI.setLoading(false);
    isGenerating = false;
    saveGame();
}

/**
 * Handles the player's choice by advancing to the next story node.
 * @param choice The choice object containing the next node ID.
 */
async function handleChoice(choice: StoryChoice) {
    if (isGenerating) return;

    if (choice.nextNodeId === 'START') {
        startGame();
        return;
    }
    
    if (choice.mentalEnergyChange) {
        currentMentalEnergy = Math.max(0, Math.min(100, currentMentalEnergy + choice.mentalEnergyChange));
        UI.updateMentalEnergy(currentMentalEnergy);
    }
    
    if (choice.relationshipChange) {
        const { character, change } = choice.relationshipChange;
        const key = character.toLowerCase() as keyof Relationships;
        relationships[key] = Math.max(0, Math.min(100, relationships[key] + change));
    }

    const logEntry = { choice: choice.text, thought: "" }; // Inner thought removed
    logbookHistory.push(logEntry);

    await renderState(choice.nextNodeId);
}

/**
 * Handles interactions with environmental objects.
 * @param object The object interacted with.
 */
function handleObjectInteraction(object: InteractableObject) {
    UI.showNotification(object.description, 'success');
}

/**
 * Starts a new game by clearing old data and rendering the first scene.
 */
async function startGame() {
  const mainMenu = document.getElementById('main-menu');
  const root = document.getElementById('root');
  if (mainMenu) mainMenu.classList.add('hidden');
  if (root) root.classList.remove('hidden');

  resetGame();
  UI.clearStory();
  
  await renderState('START');
}

/**
 * Restores a saved game from LocalStorage.
 */
async function continueGame() {
    const state = loadData<SavedState>(SAVE_KEY);
    if (!state) {
        startGame();
        return;
    }
    
    UI.showNotification("Progres berhasil dimuat.", 'success');
    
    storyHistory = state.storyHistory;
    logbookHistory = state.logbookHistory;
    mementos = state.mementos;
    relationships = state.relationships || { bapak: 50, ibu: 50, surya: 50 };
    currentMusic = state.currentMusic || 'None';
    currentMentalEnergy = state.currentMentalEnergy;
    currentNodeId = state.currentNodeId;

    UI.restoreUI({
        story: state.storyHistory,
        mentalEnergy: state.currentMentalEnergy,
    });
    
    const mainMenu = document.getElementById('main-menu');
    const root = document.getElementById('root');
    if (mainMenu) mainMenu.classList.add('hidden');
    if (root) root.classList.remove('hidden');

    await renderState(currentNodeId);
}

/**
 * Saves the current game state to LocalStorage.
 */
function saveGame() {
    const currentState: SavedState = {
        storyHistory,
        logbookHistory,
        mementos,
        relationships,
        currentNodeId,
        currentMentalEnergy,
        currentMusic,
    };
    saveData(SAVE_KEY, currentState);
    UI.showNotification("Progres disimpan.", 'success');
}

/**
 * Clears saved game data from LocalStorage and resets state variables.
 */
function resetGame() {
    removeData(SAVE_KEY);
    storyHistory = [];
    logbookHistory = [];
    mementos = [];
    relationships = { bapak: 50, ibu: 50, surya: 50 };
    currentMusic = 'None';
    currentLocation = '';
    currentMentalEnergy = 50;
    currentNodeId = 'START';
}

/**
 * Loads settings from LocalStorage.
 */
function loadSettings() {
    const savedSettings = loadData<Settings>(SETTINGS_KEY);
    if (savedSettings) {
        settings = savedSettings;
    }
}

/**
 * Saves the current settings to LocalStorage.
 */
function saveSettings() {
    saveData(SETTINGS_KEY, settings);
}

/**
 * Initializes the main menu and handles the transition to the game.
 */
function initializeMainMenu() {
    loadSettings();
    const mainMenu = document.getElementById('main-menu');
    const startButton = document.getElementById('start-button');
    const menuButtonsContainer = document.getElementById('main-menu-buttons');
    
    if (!mainMenu || !startButton || !menuButtonsContainer) {
        console.error('Main menu elements not found!');
        startGame();
        return;
    }

    const savedGame = loadData(SAVE_KEY);
    if (savedGame) {
        const continueButton = document.createElement('button');
        continueButton.id = 'continue-button';
        continueButton.className = 'main-menu-button';
        continueButton.textContent = 'Lanjutkan';
        continueButton.addEventListener('click', () => continueGame());
        menuButtonsContainer.appendChild(continueButton);
    }

    startButton.addEventListener('click', () => startGame());
}

function getSettingsContent(): HTMLElement {
    const container = document.createElement('div');
    
    // Typing Speed Setting
    const speedContainer = document.createElement('div');
    speedContainer.className = 'setting';
    speedContainer.innerHTML = `
        <label for="typing-speed-slider" class="setting-label">Kecepatan Teks</label>
        <input type="range" id="typing-speed-slider" min="10" max="90" value="${100 - settings.typingSpeed}">
        <div class="speed-labels">
            <span>Cepat</span>
            <span>Lambat</span>
        </div>
    `;
    const slider = speedContainer.querySelector('#typing-speed-slider') as HTMLInputElement;
    slider.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        // Invert the value because lower ms = faster speed
        settings.typingSpeed = 100 - parseInt(target.value, 10);
        saveSettings();
    });
    container.appendChild(speedContainer);
    
    // Restart Game Setting
    const restartContainer = document.createElement('div');
    restartContainer.className = 'setting restart-setting';
    restartContainer.innerHTML = `
        <p class="restart-description">Tindakan ini akan menghapus semua progres permainan yang tersimpan dan memulai dari awal.</p>
        <button id="restart-game-button" class="restart-button">Mulai Lagi</button>
    `;
    restartContainer.querySelector('#restart-game-button')?.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin memulai lagi? Semua progres yang tersimpan akan dihapus secara permanen.')) {
            UI.closeModal();
            setTimeout(startGame, 300);
        }
    });
    container.appendChild(restartContainer);

    return container;
}

function getJournalContent(): HTMLElement {
    const container = document.createElement('div');

    // Mementos Section
    const mementosSection = document.createElement('div');
    mementosSection.className = 'journal-section';
    mementosSection.innerHTML = '<h3>Kenang-kenangan</h3>';
    if (mementos.length === 0) {
        mementosSection.innerHTML += `<p class="no-mementos">Kamu belum menemukan kenang-kenangan apapun.</p>`;
    } else {
        mementos.forEach(memento => {
            const card = document.createElement('div');
            card.className = 'memento-card';
            card.innerHTML = `
                <h4 class="memento-name">${memento.name}</h4>
                <p class="memento-description">${memento.description}</p>
            `;
            mementosSection.appendChild(card);
        });
    }
    container.appendChild(mementosSection);

    // Relationships Section
    const relationshipsSection = document.createElement('div');
    relationshipsSection.className = 'journal-section';
    relationshipsSection.innerHTML = `<h3>Hubungan</h3>`;

    const createRelationshipBar = (name: string, value: number) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'relationship-bar-container';

        const label = document.createElement('span');
        label.className = 'relationship-label';
        label.textContent = name;
        barContainer.appendChild(label);

        const bar = document.createElement('div');
        bar.className = 'bar'; // Reuse the bar class from stats
        const activeBlocks = Math.round((value / 100) * 10);
        for (let i = 0; i < 10; i++) {
            const block = document.createElement('div');
            block.className = 'bar-block';
            if (i < activeBlocks) {
                block.classList.add('active');
            }
            bar.appendChild(block);
        }
        barContainer.appendChild(bar);
        
        return barContainer;
    };

    relationshipsSection.appendChild(createRelationshipBar('Ibu', relationships.ibu));
    relationshipsSection.appendChild(createRelationshipBar('Bapak', relationships.bapak));
    relationshipsSection.appendChild(createRelationshipBar('Surya', relationships.surya));
    container.appendChild(relationshipsSection);

    return container;
}


function initializeEventListeners() {
    document.addEventListener('keydown', (e) => {
        const isModalVisible = !document.getElementById('modal-overlay')?.classList.contains('hidden');

        if (isGenerating || isModalVisible) {
            return;
        }

        const keyNum = parseInt(e.key);
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
            const choiceButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('#choices-container button'));
            const allActionButtons = [...choiceButtons];

            if (keyNum <= allActionButtons.length) {
                e.preventDefault();
                allActionButtons[keyNum - 1]?.click();
            }
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMainMenu();
    initializeEventListeners();
    UI.initializeHeaderButtons({
        onSettingsClick: () => UI.openModal('Pengaturan', getSettingsContent()),
        onJournalClick: () => UI.openModal('Jurnal', getJournalContent())
    });
});
