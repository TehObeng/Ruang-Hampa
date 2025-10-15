

// App.tsx
// Improved and safer version of the main React App component for the game.
// This version implements a book-like swipe/panel navigation instead of scrolling.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './gameEngine';
import { ImageAssets, validateImage } from './imageAssets';
import type { ModalType, NotificationData, InteractableObject, StoryChoice } from './types';

// Initialize game engine (singleton outside React)
const gameEngine = new GameEngine();

type Panel = {
  id: 'story' | 'objects' | 'choices';
  title: string;
};

const App: React.FC = () => {
  console.log('[App] Component rendering');

  // State
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStory, setCurrentStory] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [mentalEnergy, setMentalEnergy] = useState(50);
  const [modalType, setModalType] = useState<ModalType>('none');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // New state for panel navigation
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [availablePanels, setAvailablePanels] = useState<Panel[]>([]);
  const touchStartRef = useRef<number | null>(null);

  // Refs
  const notificationIdRef = useRef(0);
  const imageLoadIdRef = useRef(0);
  const typingRef = useRef<{ cancel?: boolean }>({});

  // Helper: show notification
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++notificationIdRef.current;
    const notification: NotificationData = { id, message, type };
    console.log(`[Notification] ${type.toUpperCase()}: ${message}`);
    setNotifications(prev => [...prev, notification]);

    window.setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  // Load and display image with race protection
  const loadImage = useCallback(async (imageKey?: string) => {
    const loadId = ++imageLoadIdRef.current;
    if (!imageKey) {
      if (loadId === imageLoadIdRef.current) {
        setCurrentImage('');
        setImageLoaded(false);
      }
      return;
    }
    setImageLoaded(false);
    try {
      const isValid = await validateImage(imageKey);
      if (loadId !== imageLoadIdRef.current) return;
      if (isValid) {
        setCurrentImage(ImageAssets[imageKey]);
        setImageLoaded(true);
      } else {
        showNotification('Gambar gagal dimuat', 'error');
      }
    } catch (err) {
      console.error('[loadImage] error', err);
      if (loadId === imageLoadIdRef.current) {
        showNotification('Gagal memuat gambar (error)', 'error');
      }
    }
  }, [showNotification]);

  // Typewriter effect
  const typeWriter = useCallback(async (text: string, speed: number) => {
    // Fix for: Property 'cancel' does not exist on type '{}'.
    // The original logic was flawed, resetting the ref and using a local 'current'
    // object that would never have the 'cancel' property.
    // This new logic uses the ref correctly for cancellation.
    typingRef.current.cancel = false; // Reset cancellation flag
    setCurrentStory('');
    setIsTyping(true);
    for (let i = 0; i < text.length; i++) {
      if (typingRef.current.cancel) {
        setIsTyping(false);
        return;
      }
      setCurrentStory((prev) => prev + text[i]);
      await new Promise((r) => setTimeout(r, speed));
    }
    setIsTyping(false);
  }, []);

  const stopTyping = useCallback(() => {
    if (typingRef.current) typingRef.current.cancel = true;
    setIsTyping(false);
  }, []);

  // Update available panels based on the current node
  const updateAvailablePanels = useCallback(() => {
    const node = gameEngine.getCurrentNode();
    const panels: Panel[] = [{ id: 'story', title: node.location }];
    if (node.interactableObjects && node.interactableObjects.length > 0) {
      panels.push({ id: 'objects', title: 'Lihat Sekitar' });
    }
    if (node.actions && node.actions.length > 0) {
      panels.push({ id: 'choices', title: 'Pilihan' });
    }
    setAvailablePanels(panels);
  }, []);

  // Load current node
  const loadCurrentNode = useCallback(async () => {
    console.log('[App] Loading current story node...');
    stopTyping();
    setCurrentPanelIndex(0); // Reset to first panel

    const node = gameEngine.getCurrentNode();
    const state = gameEngine.getState();
    
    updateAvailablePanels();
    setMentalEnergy(state.mentalEnergy ?? 50);
    await loadImage(node.image);
    await typeWriter(node.story ?? '', state.typingSpeed ?? 40);

  }, [stopTyping, loadImage, typeWriter, updateAvailablePanels]);

  // Handle choice selection
  const handleChoice = useCallback(async (choice: StoryChoice) => {
    console.log('[App] Choice selected:', choice.text);
    gameEngine.makeChoice(choice);
    await loadCurrentNode();
  }, [loadCurrentNode]);

  // Handle object interaction
  const handleObjectInteraction = useCallback((object: InteractableObject) => {
    gameEngine.interactWithObject(object);
    showNotification(object.description, 'success');
  }, [showNotification]);

  // Start new game
  const startNewGame = useCallback(async () => {
    console.log('[App] Starting new game');
    setShowMainMenu(false);
    const state = gameEngine.getState();
    if (!state.hasSeenIntro) {
      setShowIntro(true);
      await typeWriter(gameEngine.getIntroText(), 20);
      await new Promise(resolve => setTimeout(resolve, 600));
      setShowIntro(false);
      gameEngine.markIntroAsSeen();
      gameEngine.saveGame();
    }
    setGameStarted(true);
    await loadCurrentNode();
  }, [typeWriter, loadCurrentNode]);

  // Continue game
  const continueGame = useCallback(async () => {
    console.log('[App] Continuing saved game');
    if (gameEngine.loadGame()) {
      setShowMainMenu(false);
      setGameStarted(true);
      await loadCurrentNode();
      showNotification('Permainan berhasil dimuat', 'success');
    } else {
      showNotification('Gagal memuat permainan', 'error');
    }
  }, [loadCurrentNode, showNotification]);

  // Restart game
  const restartGame = useCallback(() => {
    if (window.confirm('Apakah Anda yakin ingin memulai lagi? Semua progres akan hilang.')) {
      console.log('[App] Restarting game');
      gameEngine.resetGame();
      setShowMainMenu(true);
      setGameStarted(false);
      setCurrentStory('');
      setCurrentImage('');
      setMentalEnergy(50);
      setModalType('none');
      showNotification('Game telah direset', 'success');
    }
  }, [showNotification]);
  
  // Panel Navigation Handlers
  const handleNextPanel = () => {
    setCurrentPanelIndex(prev => Math.min(prev + 1, availablePanels.length - 1));
  };

  const handlePrevPanel = () => {
    setCurrentPanelIndex(prev => Math.max(prev - 1, 0));
  };
  
  // Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    
    if (Math.abs(diff) > 50) { // Swipe threshold
      if (diff > 0) handleNextPanel(); // Swiped left
      else handlePrevPanel(); // Swiped right
    }
    touchStartRef.current = null;
  };

  // Initial mount
  useEffect(() => {
    console.log('[App] Component mounted');
    gameEngine.debugPrintState();
    return () => {
      console.log('[App] Component unmounting');
      stopTyping();
      imageLoadIdRef.current++;
    };
  }, [stopTyping]);

  // Render helpers
  const renderMainMenu = () => (
    <div className="main-menu-overlay">
      <div className="main-menu-content">
        <h1 className="main-menu-title">RUANG HAMPA</h1>
        <p className="main-menu-tagline">
          Sebuah simulasi naratif tentang depresi dan dinamika keluarga
        </p>
        <div className="main-menu-buttons">
          <button className="main-menu-button" onClick={startNewGame}>
            Mulai Permainan Baru
          </button>
          {gameEngine.hasSavedGame() && (
            <button className="main-menu-button" onClick={continueGame}>
              Lanjutkan Permainan
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="intro-overlay">
      <p className={`intro-text ${isTyping ? 'typing' : ''}`}>
        {currentStory}
      </p>
    </div>
  );

  const renderMentalEnergyBar = () => (
    <div id="stats-container">
      <div id="character-icon" />
      <div className="stats-bars">
        <div className="stat-bar">
          <span className="stat-label">Energi Mental</span>
          <div className="bar">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`bar-block ${i < Math.round((mentalEnergy / 100) * 10) ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderStoryPanel = () => (
    <div className="panel">
      <fieldset>
        <legend>{gameEngine.getCurrentNode().location}</legend>
        {renderMentalEnergyBar()}
        <div className="story-container">
          <p className={`story-paragraph ${isTyping ? 'typing' : ''}`}>
            {currentStory}
          </p>
        </div>
      </fieldset>
    </div>
  );

  const renderObjectsPanel = () => {
    const objects = gameEngine.getCurrentNode().interactableObjects ?? [];
    return (
      <div className="panel">
        <fieldset>
          <legend>Lihat Sekitar</legend>
          <div id="objects-container">
            {objects.map((obj, idx) => (
              <button
                key={(obj as any).id ?? idx}
                className="object-button"
                onClick={() => handleObjectInteraction(obj)}
              >
                {obj.name}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    );
  };
  
  const renderChoicesPanel = () => {
    const actions = gameEngine.getCurrentNode().actions ?? [];
    return (
      <div className="panel">
        <fieldset>
          <legend>Pilihan</legend>
          <div className="choices-container">
            {actions.map((action, idx) => (
              <button
                key={(action as any).id ?? idx}
                onClick={() => handleChoice(action)}
                disabled={isTyping}
              >
                {action.text}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    );
  };
  
  const renderPanelContent = (panel: Panel) => {
    switch(panel.id) {
      case 'story': return renderStoryPanel();
      case 'objects': return renderObjectsPanel();
      case 'choices': return renderChoicesPanel();
      default: return null;
    }
  };

  const renderSettingsModal = () => (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">Pengaturan</h2>
        <button className="modal-close-button" onClick={() => setModalType('none')}>✕</button>
      </div>
      <div className="modal-body">
        <div className="setting">
          <label className="setting-label">Kecepatan Teks</label>
          <input
            type="range"
            min={1}
            max={100}
            value={gameEngine.getState().typingSpeed}
            onChange={(e) => gameEngine.setTypingSpeed(Number(e.target.value))}
          />
          <div className="speed-labels">
            <span>Cepat</span>
            <span>Lambat</span>
          </div>
        </div>
        <div className="setting">
          <button className="restart-button" onClick={restartGame}>Mulai Ulang</button>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#aaa' }}>
            Tindakan ini akan menghapus semua progres permainan.
          </p>
        </div>
      </div>
    </div>
  );

  const renderJournalModal = () => (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">Jurnal</h2>
        <button className="modal-close-button" onClick={() => setModalType('none')}>✕</button>
      </div>
      <div className="modal-body">
        <div className="journal-section">
          <h3>Kenang-kenangan</h3>
          {gameEngine.getMementos().length === 0 ? (
            <p className="no-mementos">Belum ada kenang-kenangan.</p>
          ) : (
            gameEngine.getMementos().map((m, idx) => (
              <div key={m.name ?? idx} className="memento-card">
                <p className="memento-name"><strong>{m.name}</strong></p>
                <p className="memento-description">{m.description}</p>
              </div>
            ))
          )}
        </div>
        <div className="journal-section">
          <h3>Hubungan</h3>
          {Object.entries(gameEngine.getRelationships()).map(([char, value]) => (
            <div key={char} className="relationship-bar-container">
              <span className="relationship-label">{char.charAt(0).toUpperCase() + char.slice(1)}</span>
              <div className="bar">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    // Fix for: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
                    // Data from localStorage might be a string, so we ensure it's a number before doing math.
                    className={`bar-block ${i < Math.round((Number(value) / 100) * 10) ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="journal-section">
          <h3>Catatan Perjalanan</h3>
          {gameEngine.getLogbookHistory().length === 0 ? (
            <p className="no-mementos">Belum ada catatan.</p>
          ) : (
            [...gameEngine.getLogbookHistory()].reverse().slice(0, 10).map((entry, idx) => (
              <div key={entry.timestamp ?? idx} className="logbook-entry">
                <p className="logbook-choice"><strong>Kamu memutuskan:</strong> {entry.choice}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderGameContent = () => (
    <div className="app-container">
      <div
        id="header-image"
        style={{
          backgroundImage: imageLoaded && currentImage ? `url(${currentImage})` : 'none',
          opacity: imageLoaded ? 1 : 0.5,
        }}
      />
      <div id="game-header">
          <div id="header-location">
            {availablePanels[currentPanelIndex]?.title || ''}
          </div>
          <div id="header-buttons">
            <button className="header-button" onClick={() => setModalType('journal')}>Jurnal</button>
            <button className="header-button" onClick={() => setModalType('settings')}>Pengaturan</button>
          </div>
      </div>
      <div
        id="game-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="panel-slider" style={{ transform: `translateX(-${currentPanelIndex * 100}%)` }}>
          {availablePanels.map(panel => renderPanelContent(panel))}
        </div>
      </div>
      
      {availablePanels.length > 1 && (
        <div className="panel-navigation">
          <button onClick={handlePrevPanel} disabled={currentPanelIndex === 0} className="nav-arrow prev">‹</button>
          <div className="pagination-dots">
            {availablePanels.map((_, index) => (
              <span key={index} className={`dot ${index === currentPanelIndex ? 'active' : ''}`}></span>
            ))}
          </div>
          <button onClick={handleNextPanel} disabled={currentPanelIndex === availablePanels.length - 1} className="nav-arrow next">›</button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="notification-container">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>{notif.message}</div>
        ))}
      </div>
      {showMainMenu && renderMainMenu()}
      {showIntro && renderIntro()}
      {gameStarted && renderGameContent()}
      {modalType !== 'none' && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalType('none')}>
          {modalType === 'settings' && renderSettingsModal()}
          {modalType === 'journal' && renderJournalModal()}
        </div>
      )}
    </>
  );
};

export default App;