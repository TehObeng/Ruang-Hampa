# App-sidewise.tsx

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { GameEngine } from '../gameEngine';
import { imageAssets } from './imageAssets';
import './App-sidewise.css';

interface TypingEffectProps {
  text: string;
  speed: number;
  onComplete?: () => void;
  className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed, onComplete, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(true);
      onComplete?.();
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, 101 - speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={className}>
      {displayedText}
      {!isComplete && <span className="typing-cursor">|</span>}
    </div>
  );
};

export default function App() {
  const [gameEngine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState(gameEngine.getState());
  const [visitedNodes, setVisitedNodes] = useState([gameEngine.getCurrentNode()]);
  const [currentNode, setCurrentNode] = useState(gameEngine.getCurrentNode());
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showModal, setShowModal] = useState<'settings' | 'journal' | 'confirm-restart' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const pagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameEngine.hasSavedGame()) {
      gameEngine.loadGame();
      const state = gameEngine.getState();
      const node = gameEngine.getCurrentNode();
      setGameState(state);
      setCurrentNode(node);
      setVisitedNodes([node]);
      if (state.hasSeenIntro) {
        setShowMainMenu(false);
        setShowIntro(false);
      }
    }
  }, []);

  const refreshGameState = () => {
    const newState = gameEngine.getState();
    const newNode = gameEngine.getCurrentNode();
    setGameState(newState);
    setCurrentNode(newNode);
  };

  const handleChoice = async (choice: any) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const nextIndex = pageIndex + 1;
    setPageIndex(nextIndex);
    if (pagesContainerRef.current) {
      pagesContainerRef.current.style.transform = `translateX(-${nextIndex * 100}%)`;
    }

    await new Promise((r) => setTimeout(r, 300));
    gameEngine.makeChoice(choice);
    refreshGameState();
    setVisitedNodes((prev) => [...prev, gameEngine.getCurrentNode()]);
    setIsTypingComplete(false);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  };

  const handleBackNavigation = () => {
    if (pageIndex <= 0) return;
    const prevIndex = pageIndex - 1;
    setPageIndex(prevIndex);
    if (pagesContainerRef.current) {
      pagesContainerRef.current.style.transform = `translateX(-${prevIndex * 100}%)`;
    }
  };

  const handleIntroComplete = () => {
    gameEngine.markIntroAsSeen();
    setShowIntro(false);
    setIsTypingComplete(false);
  };

  const handleStartNewGame = () => {
    gameEngine.startNewGame();
    refreshGameState();
    setVisitedNodes([gameEngine.getCurrentNode()]);
    setShowMainMenu(false);
    setShowIntro(true);
  };

  const handleContinueGame = () => {
    gameEngine.loadGame();
    refreshGameState();
    setVisitedNodes([gameEngine.getCurrentNode()]);
    setShowMainMenu(false);
    setShowIntro(false);
  };

  const handleCloseModal = () => setShowModal(null);
  const handleOpenModal = (type: typeof showModal) => setShowModal(type);
  const handleConfirmRestart = () => {
    gameEngine.resetGame();
    refreshGameState();
    setVisitedNodes([gameEngine.getCurrentNode()]);
    setShowModal(null);
    setShowMainMenu(true);
    setShowIntro(false);
  };

  const handleTypingSpeedChange = (speed: number) => {
    gameEngine.setTypingSpeed(speed);
    refreshGameState();
  };

  const currentStory = (
    <TypingEffect
      text={currentNode.text}
      speed={gameState.typingSpeed}
      onComplete={() => setIsTypingComplete(true)}
      className="story-text"
    />
  );

  if (showMainMenu) {
    return (
      <div className="app-container">
        <div className="main-menu">
          <h1>Ruang Hampa</h1>
          <button onClick={handleStartNewGame}>Permainan Baru</button>
          {gameEngine.hasSavedGame() && <button onClick={handleContinueGame}>Lanjutkan</button>}
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="app-container">
        <TypingEffect
          text={gameEngine.getIntroText()}
          speed={gameState.typingSpeed}
          onComplete={() => setIsTypingComplete(true)}
          className="intro-text"
        />
        {isTypingComplete && <button onClick={handleIntroComplete}>Lanjutkan →</button>}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <button onClick={handleBackNavigation} disabled={pageIndex === 0}>← Back</button>
        <h1>Ruang Hampa</h1>
        <div>
          <button onClick={() => handleOpenModal('settings')}>⚙️</button>
          <button onClick={() => handleOpenModal('journal')}>📖</button>
        </div>
      </header>

      <div className="pages-container" ref={pagesContainerRef}>
        {visitedNodes.map((node, idx) => (
          <div className="page" key={idx}>
            <div className="image-pane">
              {node.backgroundImage && (
                <img src={imageAssets[node.backgroundImage]} alt="Scene background" />
              )}
            </div>
            <div className="content-pane">
              <div className="stats-sidebar">
                <div>
                  <label>Energi Mental</label>
                  <div className="stat-bar">
                    <div
                      className="stat-bar-fill"
                      style={{ width: `${node.state.mentalEnergy}%` }}
                    />
                  </div>
                  <span>{node.state.mentalEnergy}</span>
                </div>

                {Object.entries(node.state.relationships).map(([key, value]) => (
                  <div key={key}>
                    <label>{key}</label>
                    <div className="stat-bar">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              <div className="story-text-container">{currentStory}</div>

              {isTypingComplete && node.choices ? (
                <div className="choices-container">
                  {node.choices.map((choice, i) => (
                    <button key={i} onClick={() => handleChoice(choice)}>
                      {choice.text}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Modals omitted for brevity */}
    </div>
  );
}
```

---

# App-sidewise.css

```css
:root {
  --space-16: 16px;
}

.app-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-16);
}

.pages-container {
  flex: 1;
  display: flex;
  width: 100%;
  transition: transform 0.3s ease-in-out;
}

.page {
  flex: 0 0 100%;
  display: flex;
  height: 100%;
}

.image-pane {
  width: 50%;
  background-color: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-pane img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.content-pane {
  width: 50%;
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
}

.stats-sidebar {
  margin-bottom: var(--space-16);
}

.stat-bar {
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  margin: 4px 0;
}

.stat-bar-fill {
  height: 8px;
  background: #4caf50;
}

.story-text-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: var(--space-16);
}

.choices-container button {
  display: block;
  width: 100%;
  margin-top: var(--space-16);
}
```
