import React, { useState, useEffect, useCallback } from 'react';

const BOARD_SIZE = 20;
const INITIAL_SNAKE_POSITION = [{ x: 10, y: 10 }];
const INITIAL_FOOD_POSITION = { x: 5, y: 5 };
const GAME_SPEED = 200;
const SNAKE_COLORS = ['#8D8DAA', '#E74C3C', '#2C3E50', '#F1C40F', '#9B59B6'];

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState(INITIAL_FOOD_POSITION);
  const [powerUp, setPowerUp] = useState<{ x: number; y: number } | null>(null);
  const [snakeColor, setSnakeColor] = useState(SNAKE_COLORS[0]);
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving up
  const [speed, setSpeed] = useState(GAME_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generatePosition = () => {
    while (true) {
      const newPosition = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
      if (!snake.some(segment => segment.x === newPosition.x && segment.y === newPosition.y)) {
        return newPosition;
      }
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        // Wall collision
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameOver(true);
            return prevSnake;
          }
        }

        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 1;
            if (newScore % 5 === 0) {
              setPowerUp(generatePosition());
              setTimeout(() => setPowerUp(null), 5000);
            }
            return newScore;
          });
          setFood(generatePosition());
          setSpeed(s => Math.max(50, s - 10));
        } else {
          newSnake.pop();
        }

        // Power-up collision
        if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
          setPowerUp(null);
          setSnakeColor(SNAKE_COLORS[Math.floor(Math.random() * SNAKE_COLORS.length)]);
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, speed, powerUp]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE_POSITION);
    setFood(INITIAL_FOOD_POSITION);
    setPowerUp(null);
    setSnakeColor(SNAKE_COLORS[0]);
    setDirection({ x: 0, y: -1 });
    setSpeed(GAME_SPEED);
    setGameOver(false);
    setScore(0);
  };

  const renderBoard = () => {
    const cells = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isEven = (row + col) % 2 === 0;
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`w-full h-full ${isEven ? 'bg-[#E6E2DD]' : 'bg-[#C7BCA1]'}`}
            style={{ gridColumn: col + 1, gridRow: row + 1 }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F1E5] text-[#2C3E50]">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="text-2xl mb-4">Score: {score}</div>
      <div
        className="grid border-4 border-[#8D8DAA]"
        style={{
          width: `${BOARD_SIZE * 20}px`,
          height: `${BOARD_SIZE * 20}px`,
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          position: 'relative',
        }}
      >
        {renderBoard()}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={index}
              className={`${!isHead ? 'rounded-sm' : ''}`}
              style={{
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1,
                backgroundColor: snakeColor,
              }}
            >
              {isHead && (
                <div className="relative w-full h-full flex justify-center items-center gap-1">
                  <div className="w-1/4 h-1/4 bg-white rounded-full" />
                  <div className="w-1/4 h-1/4 bg-white rounded-full" />
                </div>
              )}
            </div>
          );
        })}
        <div
          className="bg-[#E74C3C] rounded-full"
          style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }}
        />
        {powerUp && (
          <div
            style={{
              gridColumn: powerUp.x + 1,
              gridRow: powerUp.y + 1,
              backgroundColor: '#F1C40F',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        )}
      </div>
      {gameOver && (
        <div className="fade-in absolute flex flex-col items-center justify-center bg-black bg-opacity-50 w-full h-full top-0 left-0">
          <div className="text-5xl font-bold text-white">Game Over</div>
          <div className="text-3xl text-white mt-4">Your Score: {score}</div>
          <button
            onClick={restartGame}
            className="mt-4 px-4 py-2 bg-[#8D8DAA] text-white rounded hover:bg-opacity-80"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
