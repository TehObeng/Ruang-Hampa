// ===================================
// APP COMPONENT
// Main game application with all UI
// ===================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './gameEngine';
import { ImageAssets, validateImage } from './imageAssets';
import type { ModalType, NotificationData, InteractableObject, StoryChoice } from './types';

// Initialize game engine
const gameEngine = new GameEngine();

const App: React.FC = () => {
  console.log('[App] Component rendering');

  // State management
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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Refs
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIdRef = useRef(0);
  const gameContentRef = useRef<HTMLDivElement>(null);

  // Show notification
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++notificationIdRef.current;
    const notification: NotificationData = { id, message, type };
    console.log(`[Notification] ${type.toUpperCase()}: ${message}`);
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  // Load and display image
  const loadImage = useCallback(async (imageKey?: string) => {
    if (!imageKey) {
      setCurrentImage('');
      setImageLoaded(false);
      setImageError(false);
      return;
    }

    setImageLoaded(false);
    setImageError(false);
    
  const isValid = await validateImage(imageKey);
  if (isValid) {
    setCurrentImage(ImageAssets[imageKey]);
    setImageLoaded(true);
  } else {
    // Don't set imageError state, just show notification
    showNotification('Gambar gagal dimuat', 'error');
  }
  }, [showNotification]);

  // Typewriter effect
  const typeWriter = useCallback(async (text: string, speed: number) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      setCurrentStory('');
      setIsTyping(true);

      const type = () => {
        if (index < text.length) {
          setCurrentStory(prev => prev + text.charAt(index));
          index++;
          typingTimeoutRef.current = setTimeout(type, speed);
        } else {
          setIsTyping(false);
          resolve();
        }
      };

      type();
    });
  }, []);

  // Stop typing animation
  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsTyping(false);
  }, []);

  // Load current node
  const loadCurrentNode = useCallback(async () => {
    console.log('[App] Loading current story node...');
    stopTyping();
    
    const node = gameEngine.getCurrentNode();
    const state = gameEngine.getState();
    
    setMentalEnergy(state.mentalEnergy);
    await loadImage(node.image);
    await typeWriter(node.story, state.typingSpeed);
    
    // Scroll to bottom
    if (gameContentRef.current) {
      gameContentRef.current.scrollTop = gameContentRef.current.scrollHeight;
    }
  }, [stopTyping, loadImage, typeWriter]);

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
      const introText = gameEngine.getIntroText();
      await typeWriter(introText, 20);
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    const loaded = gameEngine.loadGame();
    if (loaded) {
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
    if (confirm('Apakah Anda yakin ingin memulai lagi? Semua progres akan hilang.')) {
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

  // Initial mount
  useEffect(() => {
    console.log('[App] Component mounted');
    gameEngine.debugPrintState();
    
    return () => {
      console.log('[App] Component unmounting');
      stopTyping();
    };
  }, [stopTyping]);

  // Render functions
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

  const renderMentalEnergyBar = () => {
    const blocks = Array.from({ length: 10 }, (_, i) => {
      const isActive = i < Math.round((mentalEnergy / 100) * 10);
      return (
        <div
          key={i}
          className={`bar-block ${isActive ? 'active' : ''}`}
        />
      );
    });

    return (
      <div id="stats-container">
        <div id="character-icon" />
        <div className="stats-bars">
          <div className="stat-bar">
            <span className="stat-label">Energi Mental</span>
            <div className="bar">{blocks}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderObjects = () => {
    const node = gameEngine.getCurrentNode();
    if (!node.interactableObjects || node.interactableObjects.length === 0) {
      return null;
    }

    return (
      <fieldset id="objects-wrapper">
        <legend>Lihat Sekitar</legend>
        <div id="objects-container">
          {node.interactableObjects.map((obj, idx) => (
            <button
              key={idx}
              className="object-button"
              onClick={() => handleObjectInteraction(obj)}
            >
              {obj.name}
            </button>
          ))}
        </div>
      </fieldset>
    );
  };

  const renderChoices = () => {
    const node = gameEngine.getCurrentNode();
    if (!node.actions || node.actions.length === 0) {
      return null;
    }

    return (
      <fieldset>
        <legend>Pilihan</legend>
        <div className="choices-container" style={{ counterReset: 'choice-counter' }}>
          {node.actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(action)}
              disabled={isTyping}
            >
              {action.text}
            </button>
          ))}
        </div>
      </fieldset>
    );
  };

  const renderSettingsModal = () => {
    const state = gameEngine.getState();
    
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Pengaturan</h2>
          <button className="modal-close-button" onClick={() => setModalType('none')}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="setting">
            <label className="setting-label">Kecepatan Teks</label>
            <input
              type="range"
              min="1"
              max="100"
              value={state.typingSpeed}
              onChange={(e) => gameEngine.setTypingSpeed(Number(e.target.value))}
            />
            <div className="speed-labels">
              <span>Cepat</span>
              <span>Lambat</span>
            </div>
          </div>
          <div className="setting">
            <button className="restart-button" onClick={restartGame}>
              Mulai Ulang
            </button>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#aaa' }}>
              Tindakan ini akan menghapus semua progres permainan.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderJournalModal = () => {
    const mementos = gameEngine.getMementos();
    const relationships = gameEngine.getRelationships();
    const logbook = gameEngine.getLogbookHistory();

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Jurnal</h2>
          <button className="modal-close-button" onClick={() => setModalType('none')}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="journal-section">
            <h3>Kenang-kenangan</h3>
            {mementos.length === 0 ? (
              <p className="no-mementos">Belum ada kenang-kenangan.</p>
            ) : (
              mementos.map((m, idx) => (
                <div key={idx} className="memento-card">
                  <p className="memento-name"><strong>{m.name}</strong></p>
                  <p className="memento-description">{m.description}</p>
                </div>
              ))
            )}
          </div>
          
          <div className="journal-section">
            <h3>Hubungan</h3>
            {Object.entries(relationships).map(([char, value]) => (
              <div key={char} className="relationship-bar-container">
                <span className="relationship-label">{char.charAt(0).toUpperCase() + char.slice(1)}</span>
                <div className="bar">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`bar-block ${i < Math.round((value / 100) * 10) ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="journal-section">
            <h3>Catatan Perjalanan</h3>
            {logbook.length === 0 ? (
              <p className="no-mementos">Belum ada catatan.</p>
            ) : (
              [...logbook].reverse().slice(0, 10).map((entry, idx) => (
                <div key={idx} className="logbook-entry">
                  <p className="logbook-choice">
                    <strong>Kamu memutuskan:</strong> {entry.choice}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGameContent = () => {
    const node = gameEngine.getCurrentNode();

    return (
      <div className="app-container">
        <div
          id="header-image"
          style={{
            backgroundImage: imageLoaded && currentImage ? `url(${currentImage})` : 'none',
            opacity: imageLoaded ? 1 : 0.5,
          }}
        />
        
        <div id="game-content" ref={gameContentRef}>
          <fieldset>
            <legend>
              <span>{node.location}</span>
              <div id="header-buttons">
                <button className="header-button" onClick={() => setModalType('journal')}>
                  Jurnal
                </button>
                <button className="header-button" onClick={() => setModalType('settings')}>
                  Pengaturan
                </button>
              </div>
            </legend>

            {renderMentalEnergyBar()}

            <div className="story-container">
              <p className={`story-paragraph ${isTyping ? 'typing' : ''}`}>
                {currentStory}
              </p>
            </div>
          </fieldset>

          {renderObjects()}

          {node.interactableObjects.length > 0 && (
            <hr className="divider" />
          )}

          {renderChoices()}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Notifications */}
      <div className="notification-container">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            {notif.message}
          </div>
        ))}
      </div>

      {/* Main Menu */}
      {showMainMenu && renderMainMenu()}

      {/* Intro */}
      {showIntro && renderIntro()}

      {/* Game Content */}
      {gameStarted && renderGameContent()}

      {/* Modals */}
      {modalType !== 'none' && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModalType('none')}
        >
          {modalType === 'settings' && renderSettingsModal()}
          {modalType === 'journal' && renderJournalModal()}
        </div>
      )}
    </>
  );
};

export default App;
