import type { StoryChoice, InteractableObject } from './config';
import { images } from './images';

const storyContainer = document.getElementById("story-container") as HTMLDivElement;
const innerThoughtContainer = document.getElementById("inner-thought-container") as HTMLDivElement;
const choicesContainer = document.getElementById("choices-container") as HTMLDivElement;
const objectsWrapper = document.getElementById("objects-wrapper") as HTMLDivElement;
const objectsContainer = document.getElementById("objects-container") as HTMLDivElement;
const choicesDivider = document.getElementById("choices-divider") as HTMLHRElement;
const loader = document.getElementById("loader") as HTMLDivElement;
const mentalEnergyBar = document.getElementById("mental-energy-bar") as HTMLDivElement;
const gameContent = document.getElementById("game-content") as HTMLDivElement;
const headerImage = document.getElementById("header-image") as HTMLDivElement;

const notificationContainer = document.getElementById("notification-container") as HTMLDivElement;

// Modal elements
const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement;
const modalBody = document.getElementById("modal-body") as HTMLDivElement;
const modalCloseButton = document.getElementById("modal-close-button") as HTMLButtonElement;
let lastFocusedElement: HTMLElement | null = null;

// Typewriter state
let typeWriterTimeout: number | undefined;
let onTypewriterFinish: (() => void) | null = null;

// Auto-scrolling state
let isAutoScrollingEnabled = true;
let scrollRestorationTimeout: number | undefined;

/**
 * Manages the auto-scrolling behavior.
 */
function handleUserScroll() {
    const scrollThreshold = 50; 
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - scrollThreshold;

    clearTimeout(scrollRestorationTimeout);

    if (isAtBottom) {
        isAutoScrollingEnabled = true;
    } else {
        isAutoScrollingEnabled = false;
        scrollRestorationTimeout = window.setTimeout(() => {
            isAutoScrollingEnabled = true;
        }, 3000);
    }
}
window.addEventListener('scroll', handleUserScroll, { passive: true });


/**
 * Helper function for the interruptible typewriter effect. Handles HTML tags.
 * @param element The HTML element to display the text in.
 * @param text The text to type out, can include HTML.
 * @param speed The typing speed in milliseconds per character.
 */
export function typeWriter(element: HTMLElement, text: string, speed: number): Promise<void> {
    return new Promise(resolve => {
        let i = 0;
        element.innerHTML = "";
        element.classList.add('typing');

        const complete = () => {
            clearTimeout(typeWriterTimeout);
            element.innerHTML = text; // Use original text with HTML
            element.classList.remove('typing');
            storyContainer.removeEventListener('click', complete);
            onTypewriterFinish = null;
            if (isAutoScrollingEnabled && element.closest('#story-container')) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
            resolve();
        };

        onTypewriterFinish = complete;
        // Only allow skipping for text inside the main story container
        if (element.closest('#story-container')) {
            storyContainer.addEventListener('click', complete, { once: true });
        }

        function type() {
            if (i < text.length) {
                let char = text.charAt(i);
                // Check for an HTML tag and output it all at once
                if (char === '<') {
                    const tagEndIndex = text.indexOf('>', i);
                    if (tagEndIndex !== -1) {
                        const tag = text.substring(i, tagEndIndex + 1);
                        element.innerHTML += tag;
                        i = tagEndIndex + 1; // Move index past the tag
                    } else {
                        // Malformed tag, treat as literal '<'
                        element.innerHTML += char;
                        i++;
                    }
                } else {
                    element.innerHTML += char;
                    i++;
                }
                
                if (isAutoScrollingEnabled && element.closest('#story-container')) {
                    window.scrollTo(0, document.body.scrollHeight);
                }
                typeWriterTimeout = window.setTimeout(type, speed);
            } else {
                complete();
            }
        }
        type();
    });
}


/**
 * Clears the story container.
 */
export function clearStory() {
    storyContainer.innerHTML = "";
}

/**
 * Displays an inner thought.
 * @param text The thought to display.
 */
export function updateInnerThought(text: string) {
    if (!text) return;
    innerThoughtContainer.innerHTML = `<p><em>Pikiran Banyu: ${text}</em></p>`;
    innerThoughtContainer.classList.remove('panel-hidden');
}

/**
 * Clears the inner thought container.
 */
export function clearInnerThought() {
    innerThoughtContainer.innerHTML = '';
    innerThoughtContainer.classList.add('panel-hidden');
}

/**
 * Appends a new story segment to the UI with a typewriter effect.
 * @param text The story paragraph to display.
 * @param speed The typing speed in milliseconds.
 */
export async function updateStory(
    text: string,
    speed: number = 50
) {
    if (!text) return;
    if (onTypewriterFinish) {
        onTypewriterFinish();
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
        const paragraph = document.createElement('p');
        paragraph.className = 'story-paragraph';
        storyContainer.appendChild(paragraph);
        await typeWriter(paragraph, line.trim(), speed);
    }
}


/**
 * Updates the visual representation of mental energy.
 * @param value The energy level from 0 to 100.
 */
export function updateMentalEnergy(value: number) {
  const createBlocks = (container: HTMLElement, statValue: number) => {
    container.innerHTML = '';
    const activeBlocks = Math.round((statValue / 100) * 10);
    for (let i = 0; i < 10; i++) {
      const block = document.createElement('div');
      block.className = 'bar-block';
      if (i < activeBlocks) {
        block.classList.add('active');
      }
      container.appendChild(block);
    }
  };

  createBlocks(mentalEnergyBar, value);
}

/**
 * Renders the interactable object buttons.
 * @param objects An array of object data.
 * @param onChoice A callback function to execute when an object is chosen.
 */
export function updateInteractableObjects(objects: InteractableObject[], onChoice: (choice: InteractableObject) => void) {
    objectsContainer.innerHTML = '';
    const hasObjects = objects && objects.length > 0;

    objectsWrapper.classList.toggle('panel-hidden', !hasObjects);
    choicesDivider.classList.toggle('panel-hidden', !hasObjects);

    if (hasObjects) {
        objects.forEach(object => {
            const button = document.createElement('button');
            button.className = 'object-button';
            button.textContent = object.name;
            button.onclick = () => {
                onChoice(object);
            };
            objectsContainer.appendChild(button);
        });
    }
}


/**
 * Renders the action buttons.
 * @param actions An array of action choice objects.
 * @param onChoice A callback function to execute when a choice is made.
 */
export function updateChoices(
  actions: StoryChoice[],
  onChoice: (choice: StoryChoice) => void
) {
  choicesContainer.innerHTML = "";

  if (!actions || actions.length === 0) {
    return;
  }

  actions.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.onclick = () => {
        onChoice(choice);
    };
    choicesContainer.appendChild(button);
  });
}

/**
 * Toggles the loading state.
 * @param isLoading True to show the loader, false to hide it.
 */
export function setLoading(isLoading: boolean) {
  loader.style.display = isLoading ? "block" : "none";
  choicesContainer.style.display = isLoading ? "none" : "flex";
  objectsContainer.style.display = isLoading ? "none" : "flex";
  if (isLoading) {
    clearInnerThought();
  }
}

/**
 * Opens the modal with specified title and content.
 * @param title The title for the modal header.
 * @param content The HTML content for the modal body.
 */
export function openModal(title: string, content: string | HTMLElement) {
    lastFocusedElement = document.activeElement as HTMLElement;
    modalTitle.textContent = title;
    
    if (typeof content === 'string') {
        modalBody.innerHTML = content;
    } else {
        modalBody.innerHTML = '';
        modalBody.appendChild(content);
    }
    
    modalOverlay.classList.remove('hidden');
    document.addEventListener('keydown', handleModalKeydown);
    modalCloseButton.focus();
}

/**
 * Closes the currently open modal.
 */
export function closeModal() {
    modalOverlay.classList.add('hidden');
    document.removeEventListener('keydown', handleModalKeydown);
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

/**
 * Handles keyboard events for the modal (e.g., Escape key, Tab for focus trap).
 * @param e The keyboard event.
 */
function handleModalKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        closeModal();
    }
    if (e.key === 'Tab') {
        const focusableElements = Array.from(modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { 
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
}

// Wire up modal close events
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});
modalCloseButton.addEventListener('click', closeModal);

/**
 * Restores the UI from a saved game state.
 * @param state The saved game state object.
 */
export function restoreUI(state: { 
    story: string[], 
    mentalEnergy: number,
}) {
    clearStory();

    const lastStory = state.story[state.story.length - 1];
    if (lastStory) {
        const p = document.createElement('p');
        p.className = 'story-paragraph';
        p.textContent = lastStory;
        storyContainer.appendChild(p);
    }

    updateMentalEnergy(state.mentalEnergy);
    
    gameContent.scrollTop = gameContent.scrollHeight;
}

/**
 * Shows a temporary notification at the top of the screen.
 * @param message The message to display.
 * @param type The type of notification ('success' or 'error').
 */
export function showNotification(message: string, type: 'success' | 'error' = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    if (type === 'error') {
        notification.classList.add('error');
    }
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}

/**
 * Updates the header image for the current scene.
 * @param imageKey The key for the image in the `images` object.
 */
export function updateHeaderImage(imageKey?: string) {
  const headerImage = document.getElementById('header-image') as HTMLDivElement;

  if (!imageKey) {
    headerImage.style.backgroundImage = 'none';
    headerImage.style.opacity = '0.5';
    return;
  }
  
  const url = images[imageKey];

  if (url) {
    // Try to load the image and report loading error
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      headerImage.style.backgroundImage = `url('${url}')`;
      headerImage.style.opacity = '1';
    };
    img.onerror = () => {
      console.error(`Failed to load image at path: ${url}`);
      headerImage.style.backgroundImage = 'none';
      headerImage.style.opacity = '0.8';
      showNotification('Gambar gagal dimuat.', 'error');
    };
  } else {
    console.warn(`Image key "${imageKey}" not found in images.ts. Image will not be displayed.`);
    headerImage.style.backgroundImage = 'none';
    headerImage.style.opacity = '0.5';
  }
}


/**
 * Creates and appends header buttons for settings and journal.
 */
export function initializeHeaderButtons(callbacks: { onSettingsClick: () => void, onJournalClick: () => void }) {
    const container = document.getElementById('header-buttons');
    if (!container) return;

    const journalButton = document.createElement('button');
    journalButton.className = 'header-button';
    journalButton.textContent = 'Jurnal';
    journalButton.onclick = callbacks.onJournalClick;
    container.appendChild(journalButton);

    const settingsButton = document.createElement('button');
    settingsButton.className = 'header-button';
    settingsButton.textContent = 'Pengaturan';
    settingsButton.onclick = callbacks.onSettingsClick;
    container.appendChild(settingsButton);
}