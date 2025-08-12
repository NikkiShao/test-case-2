import React, { useState, useEffect, useCallback } from 'react';

const BOARD_SIZE = 20;
const INITIAL_SNAKE_POSITION = [{ x: 10, y: 10 }];
const INITIAL_FOOD_POSITION = { x: 5, y: 5 };
const GAME_SPEED = 200;

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState(INITIAL_FOOD_POSITION);
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving up
  const [speed, setSpeed] = useState(GAME_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = () => {
    while (true) {
      const newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        return newFood;
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
          setScore(s => s + 1);
          setFood(generateFood());
          setSpeed(s => Math.max(50, s - 10));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, speed]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE_POSITION);
    setFood(INITIAL_FOOD_POSITION);
    setDirection({ x: 0, y: -1 });
    setSpeed(GAME_SPEED);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="text-2xl mb-4">Score: {score}</div>
      <div
        className="grid grid-cols-20 grid-rows-20 border-4 border-gray-600"
        style={{
          width: `${BOARD_SIZE * 20}px`,
          height: `${BOARD_SIZE * 20}px`,
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="bg-green-500"
            style={{ gridColumn: segment.x + 1, gridRow: segment.y + 1 }}
          />
        ))}
        <div
          className="bg-red-500"
          style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }}
        />
      </div>
      {gameOver && (
        <div className="absolute flex flex-col items-center justify-center bg-black bg-opacity-50 w-full h-full">
          <div className="text-5xl font-bold text-red-500">Game Over</div>
          <button
            onClick={restartGame}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
