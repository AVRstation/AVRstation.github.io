import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Apple extends Point {
  opacity: number;
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
  const applesRef = useRef<Apple[]>([]);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const aiScoreRef = useRef(0);
  const segmentDist = 15; // Distance between segments
  const particlesRef = useRef<{ x: number, y: number, vx: number, vy: number, life: number, color: string }[]>([]);

  const triggerExplosion = (snake: Point[], color: string) => {
    snake.forEach((seg, idx) => {
      const count = idx === 0 ? 12 : 4;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: seg.x,
          y: seg.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 1.0,
          color
        });
      }
    });
  };

  // Initialize game
  const resetGame = () => {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const color = theme === 'dark' ? '#00F0FF' : '#0088CC';
    if (snakeRef.current.length > 0) triggerExplosion(snakeRef.current, color);

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
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const color = theme === 'dark' ? '#FF00FF' : '#AA00AA';
    if (aiSnakeRef.current.length > 0) triggerExplosion(aiSnakeRef.current, color);

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

    const newApple: Apple = {
      x: Math.max(margin, Math.min(window.innerWidth - margin, x)),
      y: Math.random() * (window.innerHeight - 100) + 50,
      opacity: 0
    };
    
    applesRef.current.push(newApple);
  };

  const ensureApples = () => {
    while (applesRef.current.length < 3) {
      spawnApple();
    }
  };

  useEffect(() => {
    resetGame();
    spawnAISnake();
    ensureApples();

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
        
        // --- Improved AI logic with Obstacle Avoidance ---
        let bestAngle = targetAngle;
        let maxWeight = -10000;
        
        // Check 12 directions around the snake
        for (let i = 0; i < 12; i++) {
          const testAngle = (i / 12) * Math.PI * 2;
          let weight = 0;

          // 1. Goal alignment (prefer directions towards apple)
          let angleDiff = Math.abs(testAngle - targetAngle);
          while (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
          weight -= angleDiff * 50;

      // 2. Obstacle detection
          const checkDistances = [25, 50, 100]; // Check near, medium, and far
          
          for (const dist of checkDistances) {
            const px = head.x + Math.cos(testAngle) * dist;
            const py = head.y + Math.sin(testAngle) * dist;

            // Wall avoidance (extremely high penalty)
            const margin = 60;
            if (px < margin || px > window.innerWidth - margin || py < margin || py > window.innerHeight - margin) {
              weight -= 10000 / (dist / 25);
            }

            // Player avoidance (very high penalty)
            for (const seg of snakeRef.current) {
              const dx = px - seg.x;
              const dy = py - seg.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < 2500) { // 50px radius for weight
                weight -= 5000 / (dist / 25);
              }
            }

            // Self avoidance (extremely high penalty to avoid crashing into self)
            for (let k = 4; k < snake.length; k++) {
              const seg = snake[k];
              const dx = px - seg.x;
              const dy = py - seg.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < 2025) { // 45px radius for weight
                weight -= 8000 / (dist / 25);
              }
            }
          }

          if (weight > maxWeight) {
            maxWeight = weight;
            bestAngle = testAngle;
          }
        }

        // Smoothly rotate towards bestAngle
        let diff = bestAngle - aiAngleRef.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        
        const turnSpeed = 0.12; // Even faster turning to dodge self
        if (Math.abs(diff) < turnSpeed) {
          aiAngleRef.current = bestAngle;
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

      // Calculate dynamic speed based on individual scores (the longer the snake, the slower it moves)
      const playerSpeed = Math.max(4.5 - scoreRef.current * 0.1, 2.0);
      const aiSpeed = Math.max(4.2 - aiScoreRef.current * 0.1, 1.8);

      // 1. Update Player position
      snakeRef.current = updateSnake(snakeRef.current, mouseRef.current, playerSpeed);
      
      // 2. Update AI position (Move towards closest apple)
      if (applesRef.current.length > 0) {
        // Find closest apple
        const aiHead = aiSnakeRef.current[0];
        if (aiHead) {
          let closestApple = applesRef.current[0];
          let minDist = Math.sqrt((aiHead.x - closestApple.x)**2 + (aiHead.y - closestApple.y)**2);
          
          for (let i = 1; i < applesRef.current.length; i++) {
            const dist = Math.sqrt((aiHead.x - applesRef.current[i].x)**2 + (aiHead.y - applesRef.current[i].y)**2);
            if (dist < minDist) {
              minDist = dist;
              closestApple = applesRef.current[i];
            }
          }
          aiSnakeRef.current = updateAISnake(aiSnakeRef.current, closestApple, aiSpeed);
        }
      }

      // Check Player collisions
      const head = snakeRef.current[0];
      if (head) {
        // Self
        for (let i = 2; i < snakeRef.current.length; i++) {
          const seg = snakeRef.current[i];
          if (Math.sqrt((head.x - seg.x)**2 + (head.y - seg.y)**2) < 6) {
            if (scoreRef.current > 0) resetGame();
            break;
          }
        }
        // With AI
        for (let i = 0; i < aiSnakeRef.current.length; i++) {
          const seg = aiSnakeRef.current[i];
          if (Math.sqrt((head.x - seg.x)**2 + (head.y - seg.y)**2) < 10) {
            if (scoreRef.current > 0) resetGame();
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
          if (Math.sqrt((aiHead.x - seg.x)**2 + (aiHead.y - seg.y)**2) < 6) {
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
      applesRef.current.forEach((apple, index) => {
        // Update opacity for smooth appearance
        if (apple.opacity < 1) apple.opacity += 0.02;

        // Player eat
        if (head && Math.sqrt((head.x - apple.x)**2 + (head.y - apple.y)**2) < 20) {
          scoreRef.current += 1;
          if (onScoreChange) onScoreChange(scoreRef.current);
          for(let k=0; k<4; k++) snakeRef.current.push({ ...snakeRef.current[snakeRef.current.length-1] });
          applesRef.current.splice(index, 1);
          ensureApples();
        }
        // AI eat
        else if (aiHead && Math.sqrt((aiHead.x - apple.x)**2 + (aiHead.y - apple.y)**2) < 20) {
          aiScoreRef.current += 1;
          if (onAIScoreChange) onAIScoreChange(aiScoreRef.current);
          for(let k=0; k<4; k++) aiSnakeRef.current.push({ ...aiSnakeRef.current[aiSnakeRef.current.length-1] });
          applesRef.current.splice(index, 1);
          ensureApples();
        }
      });

      // 3. Update Particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        return p.life > 0;
      });

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Particles
      ctx.save();
      particlesRef.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      });
      ctx.restore();

      // Draw Apples
      applesRef.current.forEach(apple => {
        ctx.save();
        const { x, y, opacity } = apple;
        const glowRadius = 100; // Decreased by 2 times from 200
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        grad.addColorStop(0, `rgba(255, 0, 0, ${0.4 * opacity})`);
        grad.addColorStop(0.7, 'rgba(255, 0, 0, 0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 77, 77, ${opacity})`;
        ctx.fill();
        ctx.restore();
      });

      const currentSnake = snakeRef.current;
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';

      // Draw AI Snake
      const currentAISnake = aiSnakeRef.current;
      if (currentAISnake.length > 0) {
        ctx.save();
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 0, 255, 0.6)' : 'rgba(200, 0, 200, 0.6)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = theme === 'dark' ? 'rgba(255, 0, 255, 0.8)' : 'rgba(200, 0, 200, 0.8)';
        
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
        const aiGradRadius = 100;
        const aiGrad = ctx.createRadialGradient(x, y, 0, x, y, aiGradRadius);
        aiGrad.addColorStop(0, theme === 'dark' ? 'rgba(255, 0, 255, 0.3)' : 'rgba(200, 0, 200, 0.3)');
        aiGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = aiGrad;
        ctx.fillRect(x - aiGradRadius, y - aiGradRadius, aiGradRadius * 2, aiGradRadius * 2);

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
        ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 240, 255, 0.6)' : 'rgba(0, 136, 204, 0.6)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = theme === 'dark' ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 136, 204, 0.8)';
        
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
        const playerGradRadius = 100;
        const playerGrad = ctx.createRadialGradient(x, y, 0, x, y, playerGradRadius);
        playerGrad.addColorStop(0, theme === 'dark' ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 136, 204, 0.3)');
        playerGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = playerGrad;
        ctx.fillRect(x - playerGradRadius, y - playerGradRadius, playerGradRadius * 2, playerGradRadius * 2);

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
