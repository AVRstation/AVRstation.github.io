import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
  onAIScoreChange?: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, onAIScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>([]);
  const aiSnakeRef = useRef<Point[]>([]);
  const aiAngleRef = useRef<number>(0);
  const appleRef = useRef<Point | null>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const aiScoreRef = useRef(0);
  const segmentDist = 15; // Distance between segments

  // Initialize game
  const resetGame = () => {
    snakeRef.current = [
      { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      { x: window.innerWidth / 2, y: window.innerHeight / 2 + segmentDist },
      { x: window.innerWidth / 2, y: window.innerHeight / 2 + segmentDist * 2 }
    ];
    scoreRef.current = 0;
    if (onScoreChange) onScoreChange(0);
    setGameOver(false);
  };

  const spawnAISnake = () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    aiSnakeRef.current = [
      { x, y },
      { x, y: y + segmentDist },
      { x, y: y + segmentDist * 2 }
    ];
    aiAngleRef.current = Math.random() * Math.PI * 2;
    aiScoreRef.current = 0;
    if (onAIScoreChange) onAIScoreChange(0);
  };

  const spawnApple = () => {
    const isLeft = Math.random() > 0.5;
    const margin = 100; // Distance from the edges
    const sideWidth = 300; // Focus on the sides where blocks are
    
    let x;
    if (isLeft) {
      x = Math.random() * sideWidth + margin;
    } else {
      x = window.innerWidth - (Math.random() * sideWidth + margin);
    }

    appleRef.current = {
      x: Math.max(margin, Math.min(window.innerWidth - margin, x)),
      y: Math.random() * (window.innerHeight - 100) + 50
    };
  };

  useEffect(() => {
    resetGame();
    spawnAISnake();
    spawnApple();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const updateSnake = (snake: Point[], target: Point, speed: number) => {
        if (snake.length === 0) return snake;
        const head = snake[0];
        const dx = target.x - head.x;
        const dy = target.y - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) {
          const vx = (dx / distance) * speed;
          const vy = (dy / distance) * speed;
          const newHead = { x: head.x + vx, y: head.y + vy };
          
          const newSnake = [newHead];
          let lastPos = newHead;

          for (let i = 1; i < snake.length; i++) {
            const current = snake[i];
            const segmentDx = lastPos.x - current.x;
            const segmentDy = lastPos.y - current.y;
            const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);

            if (segmentDistance > segmentDist) {
              const angle = Math.atan2(segmentDy, segmentDx);
              const moveX = Math.cos(angle) * (segmentDistance - segmentDist);
              const moveY = Math.sin(angle) * (segmentDistance - segmentDist);
              const nextSegment = { x: current.x + moveX, y: current.y + moveY };
              newSnake.push(nextSegment);
              lastPos = nextSegment;
            } else {
              newSnake.push(current);
              lastPos = current;
            }
          }
          return newSnake;
        }
        return snake;
      };

      const updateAISnake = (snake: Point[], target: Point, speed: number) => {
        if (snake.length === 0) return snake;
        const head = snake[0];
        
        // Target angle
        const targetAngle = Math.atan2(target.y - head.y, target.x - head.x);
        
        // Find shortest angular distance
        let diff = targetAngle - aiAngleRef.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        
        // Limit turning speed (arc effect)
        const turnSpeed = 0.05;
        if (Math.abs(diff) < turnSpeed) {
          aiAngleRef.current = targetAngle;
        } else {
          aiAngleRef.current += Math.sign(diff) * turnSpeed;
        }

        const vx = Math.cos(aiAngleRef.current) * speed;
        const vy = Math.sin(aiAngleRef.current) * speed;
        const newHead = { x: head.x + vx, y: head.y + vy };
        
        const newSnake = [newHead];
        let lastPos = newHead;

        for (let i = 1; i < snake.length; i++) {
          const current = snake[i];
          const segmentDx = lastPos.x - current.x;
          const segmentDy = lastPos.y - current.y;
          const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);

          if (segmentDistance > segmentDist) {
            const angle = Math.atan2(segmentDy, segmentDx);
            const moveX = Math.cos(angle) * (segmentDistance - segmentDist);
            const moveY = Math.sin(angle) * (segmentDistance - segmentDist);
            const nextSegment = { x: current.x + moveX, y: current.y + moveY };
            newSnake.push(nextSegment);
            lastPos = nextSegment;
          } else {
            newSnake.push(current);
            lastPos = current;
          }
        }
        return newSnake;
      };

      // 1. Update Player position
      snakeRef.current = updateSnake(snakeRef.current, mouseRef.current, 3);
      
      // 2. Update AI position (Move towards apple with turn limit)
      if (appleRef.current) {
        aiSnakeRef.current = updateAISnake(aiSnakeRef.current, appleRef.current, 2.5);
      }

      // Check Player collisions
      const head = snakeRef.current[0];
      if (head) {
        // Self
        for (let i = 2; i < snakeRef.current.length; i++) {
          const seg = snakeRef.current[i];
          if (Math.sqrt((head.x - seg.x)**2 + (head.y - seg.y)**2) < 8) {
            resetGame();
            break;
          }
        }
        // With AI
        for (let i = 0; i < aiSnakeRef.current.length; i++) {
          const seg = aiSnakeRef.current[i];
          if (Math.sqrt((head.x - seg.x)**2 + (head.y - seg.y)**2) < 10) {
            resetGame();
            break;
          }
        }
      }

      // Check AI collisions
      const aiHead = aiSnakeRef.current[0];
      if (aiHead) {
        // Self
        for (let i = 2; i < aiSnakeRef.current.length; i++) {
          const seg = aiSnakeRef.current[i];
          if (Math.sqrt((aiHead.x - seg.x)**2 + (aiHead.y - seg.y)**2) < 8) {
            spawnAISnake();
            break;
          }
        }
        // With Player
        for (let i = 0; i < snakeRef.current.length; i++) {
          const seg = snakeRef.current[i];
          if (Math.sqrt((aiHead.x - seg.x)**2 + (aiHead.y - seg.y)**2) < 10) {
            spawnAISnake();
            break;
          }
        }
      }

      // Check for Apple collection
      if (appleRef.current) {
        // Player eat
        if (head && Math.sqrt((head.x - appleRef.current.x)**2 + (head.y - appleRef.current.y)**2) < 20) {
          scoreRef.current += 1;
          if (onScoreChange) onScoreChange(scoreRef.current);
          for(let k=0; k<4; k++) snakeRef.current.push({ ...snakeRef.current[snakeRef.current.length-1] });
          spawnApple();
        }
        // AI eat
        else if (aiHead && Math.sqrt((aiHead.x - appleRef.current.x)**2 + (aiHead.y - appleRef.current.y)**2) < 20) {
          aiScoreRef.current += 1;
          if (onAIScoreChange) onAIScoreChange(aiScoreRef.current);
          for(let k=0; k<4; k++) aiSnakeRef.current.push({ ...aiSnakeRef.current[aiSnakeRef.current.length-1] });
          spawnApple();
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Apple
      if (appleRef.current) {
        ctx.save();
        const { x, y } = appleRef.current;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 200);
        grad.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
        grad.addColorStop(0.7, 'rgba(255, 0, 0, 0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(x - 200, y - 200, 400, 400);

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4D4D';
        ctx.fill();
        ctx.restore();
      }

      const currentSnake = snakeRef.current;
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';

      // Draw AI Snake
      const currentAISnake = aiSnakeRef.current;
      if (currentAISnake.length > 0) {
        ctx.save();
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 0, 255, 0.2)' : 'rgba(200, 0, 200, 0.2)';
        
        ctx.beginPath();
        ctx.moveTo(currentAISnake[0].x, currentAISnake[0].y);
        for (let i = 1; i < currentAISnake.length; i++) {
          ctx.lineTo(currentAISnake[i].x, currentAISnake[i].y);
        }
        ctx.stroke();
        ctx.restore();

        // AI Head Glow
        ctx.save();
        const { x, y } = currentAISnake[0];
        const aiColor = theme === 'dark' ? '#FF00FF' : '#AA00AA';
        const aiGrad = ctx.createRadialGradient(x, y, 0, x, y, 200);
        aiGrad.addColorStop(0, theme === 'dark' ? 'rgba(255, 0, 255, 0.3)' : 'rgba(200, 0, 200, 0.3)');
        aiGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = aiGrad;
        ctx.fillRect(x - 200, y - 200, 400, 400);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = aiColor;
        ctx.fill();
        ctx.restore();
      }

      // Draw Player Snake
      if (currentSnake.length > 0) {
        ctx.save();
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 136, 204, 0.4)';
        
        ctx.beginPath();
        ctx.moveTo(currentSnake[0].x, currentSnake[0].y);
        for (let i = 1; i < currentSnake.length; i++) {
          ctx.lineTo(currentSnake[i].x, currentSnake[i].y);
        }
        ctx.stroke();
        ctx.restore();

        // Player Head Glow
        ctx.save();
        const { x, y } = currentSnake[0];
        const headColor = theme === 'dark' ? '#00F0FF' : '#0088CC';
        const playerGrad = ctx.createRadialGradient(x, y, 0, x, y, 200);
        playerGrad.addColorStop(0, theme === 'dark' ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 136, 204, 0.3)');
        playerGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = playerGrad;
        ctx.fillRect(x - 200, y - 200, 400, 400);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = headColor;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-5 hidden lg:block opacity-60"
    />
  );
};
