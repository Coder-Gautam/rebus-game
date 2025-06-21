import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [points, setPoints] = useState(0)
  const [time, setTime] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(true)

  // Sample puzzles data
  const puzzles = [
    {
      id: 1,
      visual: '👁️❤️U',
      answer: 'i love you',
      hint: 'A common expression of affection',
      difficulty: 1
    },
    {
      id: 2,
      visual: 'H + 🐝',
      answer: 'honeybee',
      hint: 'A flying insect that makes something sweet',
      difficulty: 1
    },
    {
      id: 3,
      visual: '🧠💭',
      answer: 'brainstorm',
      hint: 'When you think of many ideas',
      difficulty: 2
    },
    {
      id: 4,
      visual: '🌊🌊🌊\n🚶',
      answer: 'overseas travel',
      hint: 'Going to another country across water',
      difficulty: 2
    },
    {
      id: 5,
      visual: '🏠\n🏠🏠\n🏠🏠🏠',
      answer: 'growing economy',
      hint: 'When business and money increase in a country',
      difficulty: 3
    },
    {
      id: 6,
      visual: 'LIFE\n40',
      answer: 'life begins at 40',
      hint: 'A saying about getting older but still having fun',
      difficulty: 2
    },
    {
      id: 7,
      visual: 'STAND\nI',
      answer: 'i understand',
      hint: 'When you comprehend something',
      difficulty: 2
    },
    {
      id: 8,
      visual: 'HEAD\nCOVER COVER\nCOVER COVER',
      answer: 'head for cover',
      hint: 'What you do when seeking protection',
      difficulty: 3
    }
  ]

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !isCorrect) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isCorrect]);

  // Load effect
  useEffect(() => {
    // Simulate loading puzzle
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Start game function
  const startGame = () => {
    setGameStarted(true);
    setLoading(false);
    setTime(0);
    setAttempts(0);
    setUserAnswer('');
    setShowHint(false);
    setIsCorrect(false);
  };

  // Check answer function
  const checkAnswer = () => {
    const currentAnswer = puzzles[currentPuzzle].answer.toLowerCase().trim();
    const userInput = userAnswer.toLowerCase().trim();
    
    setAttempts(prevAttempts => prevAttempts + 1);
    
    if (userInput === currentAnswer) {
      // Correct answer
      const pointsEarned = calculatePoints();
      setPoints(prevPoints => prevPoints + pointsEarned);
      setIsCorrect(true);
      
      // Show success message and prepare for next puzzle
      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prevPuzzle => prevPuzzle + 1);
          setUserAnswer('');
          setTime(0);
          setAttempts(0);
          setShowHint(false);
          setIsCorrect(false);
        } else {
          // Game completed
          alert(`Congratulations! You've completed all puzzles with ${points} points!`);
          // Reset game if desired
          setCurrentPuzzle(0);
          setGameStarted(false);
        }
      }, 2000);
    }
  };

  // Calculate points based on time, attempts, and hint usage
  const calculatePoints = () => {
    const difficulty = puzzles[currentPuzzle].difficulty;
    let basePoints = difficulty * 100;
    
    // Deduct points for time (10 points per 10 seconds)
    const timeDeduction = Math.floor(time / 10) * 10;
    
    // Deduct points for attempts (20 points per attempt after the first)
    const attemptDeduction = attempts > 1 ? (attempts - 1) * 20 : 0;
    
    // Deduct points for hint usage
    const hintDeduction = showHint ? 50 : 0;
    
    const totalPoints = Math.max(basePoints - timeDeduction - attemptDeduction - hintDeduction, 10);
    return totalPoints;
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Show hint function
  const handleShowHint = () => {
    setShowHint(true);
  };

  // Handle touch events for better mobile experience
  const handleTouchStart = (e) => {
    // Add touch feedback for interactive elements
    if (e.target.tagName === 'BUTTON') {
      e.target.classList.add('touch-active');
    }
  };

  const handleTouchEnd = (e) => {
    // Remove touch feedback
    if (e.target.tagName === 'BUTTON') {
      e.target.classList.remove('touch-active');
    }
  };

  return (
    <div 
      className="rebus-game"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <header>
        <h1>Rebus Game</h1>
        <p>Challenge yourself with visual word puzzles!</p>
      </header>

      {loading ? (
        <div className="loading">
          <p>Loading puzzle...</p>
        </div>
      ) : !gameStarted ? (
        <div className="start-screen">
          <h2>Welcome to Rebus Game!</h2>
          <p>Solve visual word puzzles by figuring out what the combination of pictures, symbols, and letters represent.</p>
          <p>Earn points based on your speed, attempts, and whether you use hints.</p>
          <div className="game-rules">
            <h3>How to Play:</h3>
            <ul>
              <li>Look at the visual puzzle carefully</li>
              <li>Type your answer in the input field</li>
              <li>Use hints if you're stuck (costs 50 points)</li>
              <li>Earn more points by solving quickly with fewer attempts</li>
            </ul>
          </div>
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div className="game-container">
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Points:</span>
              <span className="stat-value">{points}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time:</span>
              <span className="stat-value">{formatTime(time)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Attempts:</span>
              <span className="stat-value">{attempts}</span>
            </div>
          </div>

          <div className="puzzle-container">
            <div className="puzzle-visual">
              {puzzles[currentPuzzle].visual.split('\n').map((line, index) => (
                <div key={index} className="visual-line">{line}</div>
              ))}
            </div>

            <div className="answer-container">
              <label htmlFor="answer-input" className="sr-only">Your answer</label>
              <input
                id="answer-input"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here"
                disabled={isCorrect}
                className={isCorrect ? 'correct-answer' : ''}
                aria-describedby="answer-instructions"
                autoComplete="off"
                onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() !== '' && !isCorrect && checkAnswer()}
              />
              <span id="answer-instructions" className="sr-only">Type your solution to the rebus puzzle</span>
              <button 
                onClick={checkAnswer} 
                disabled={isCorrect || userAnswer.trim() === ''}
                aria-label="Submit your answer"
              >
                Submit
              </button>
            </div>

            <div className="hint-container">
              {!showHint ? (
                <button onClick={handleShowHint} className="hint-button">
                  Use Hint (-50 points)
                </button>
              ) : (
                <div className="hint-text">
                  <p><strong>Hint:</strong> {puzzles[currentPuzzle].hint}</p>
                </div>
              )}
            </div>

            {isCorrect && (
              <div className="correct-message">
                <p>Correct! +{calculatePoints()} points</p>
              </div>
            )}
          </div>

          <div className="progress">
            <p>Puzzle {currentPuzzle + 1} of {puzzles.length}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentPuzzle + 1) / puzzles.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
