import React, { useEffect, useRef } from 'react';
import { sounds } from '../lib/sounds';

interface SpaceInvadersProps {
  onScoreChange?: (score: number) => void;
  onAIScoreChange?: (score: number) => void;
  soundEnabled?: boolean;
}

export const SpaceInvadersGame: React.FC<SpaceInvadersProps> = ({ onScoreChange, onAIScoreChange, soundEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);
  
  // Game state refs
  const playerY = useRef(0);
  const bullets = useRef<{ x: number, y: number, side: 'player' | 'alien' }[]>([]);
  const aliens = useRef<{ x: number, y: number, alive: boolean, id: number }[]>([]);
  const alienDirection = useRef(1); // 1 for down, -1 for up
  const alienMoveStep = useRef(0);
  const lastShotTime = useRef(0);
  const lastAlienShotTime = useRef(0);
  const playerPos = useRef({ x: 50, y: 0 });
  const score = useRef(0);
  const aiScore = useRef(0);
  const particles = useRef<{ x: number, y: number, vx: number, vy: number, life: number, color: string }[]>([]);

  const ALIEN_ROWS = 5;
  const ALIEN_COLS = 4;
  const ALIEN_SPACING = 50;

  const lastPattern = useRef(-1);

  const triggerExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      particles.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1.0,
        color
      });
    }
  };

  const initAliens = (width: number, height: number) => {
    const newAliens = [];
    let pattern;
    do {
      pattern = Math.floor(Math.random() * 5);
    } while (pattern === lastPattern.current);
    lastPattern.current = pattern;
    
    const startX = width - 50; // Shifted further right, almost flush to edge
    const centerY = height / 2;
    const spacing = 50;

    alienDirection.current = 1;
    alienMoveStep.current = 0;
    bullets.current = []; // Clear old bullets on new wave

    switch (pattern) {
      case 0: // Classic Grid (4x4) - moving left from startX
        for (let c = 0; c < 4; c++) {
          for (let r = 0; r < 4; r++) {
            newAliens.push({
              x: startX - c * spacing,
              y: centerY - 75 + r * spacing,
              alive: true, id: newAliens.length
            });
          }
        }
        break;
      case 1: // V-Shape - pointing left
        for (let i = 0; i < 16; i++) {
          const row = Math.floor(i / 2);
          const side = i % 2 === 0 ? 1 : -1;
          newAliens.push({
            x: startX - row * 30,
            y: centerY + side * row * 40,
            alive: true, id: i
          });
        }
        break;
      case 2: // Diamond - centered around startX-100
        const centerRefX = startX - 120;
        const coords = [
          [0,0], [1,1], [1,-1], [2,2], [2,0], [2,-2], [3,3], [3,1], [3,-1], [3,-3],
          [2,2], [2,0], [2,-2], [1,1], [1,-1], [0,0] // Simplified for 16
        ];
        // Re-defining diamond for 16 items more clearly
        const diamondGrid = [
          [0,0], 
          [-1,1], [-1,-1], 
          [-2,2], [-2,0], [-2,-2],
          [-3,3], [-3,1], [-3,-1], [-3,-3],
          [-4,2], [-4,0], [-4,-2],
          [-5,1], [-5,-1],
          [-6,0]
        ];
        diamondGrid.forEach((pos, i) => {
          newAliens.push({
            x: startX + pos[0] * 30,
            y: centerY + pos[1] * 35,
            alive: true, id: i
          });
        });
        break;
      case 3: // Two Columns - rightmost
        for (let i = 0; i < 16; i++) {
          const col = Math.floor(i / 8);
          const row = i % 8;
          newAliens.push({
            x: startX - col * 60,
            y: centerY - 175 + row * 50,
            alive: true, id: i
          });
        }
        break;
      case 4: // X-Cross - rightmost
        for (let i = 0; i < 16; i++) {
          const step = i - 8;
          const xOffset = -Math.abs(step) * 30;
          const yOffset = step * 40;
          newAliens.push({
            x: startX + xOffset,
            y: centerY + yOffset,
            alive: true, id: i
          });
        }
        break;
    }
    aliens.current = newAliens;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      playerY.current = e.clientY;
      playerPos.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = (time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const { width, height } = canvas;
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const playerColor = theme === 'dark' ? '#00F0FF' : '#0088CC';
      const alienColor = theme === 'dark' ? '#FF00FF' : '#AA00AA';

      if (aliens.current.length === 0) {
        initAliens(width, height);
      }

      // 1. Update Player Bullets
      if (time - lastShotTime.current > 400) {
        bullets.current.push({ x: playerPos.current.x + 20, y: playerPos.current.y, side: 'player' });
        // Shoot sounds disabled as per request
        // if (soundEnabled) sounds.playSpaceShoot();
        lastShotTime.current = time;
      }

      // 2. Update Aliens Movement
      alienMoveStep.current += 1;
      if (alienMoveStep.current > 2) {
        let hitEdge = false;
        aliens.current.forEach(a => {
          if (!a.alive) return;
          a.y += alienDirection.current * 1;
          if (a.y < 50 || a.y > height - 50) hitEdge = true;
        });

        if (hitEdge) {
          alienDirection.current *= -1;
        }
        alienMoveStep.current = 0;
      }

      // Alien Shooting
      if (time - lastAlienShotTime.current > 1000) {
        const aliveAliens = aliens.current.filter(a => a.alive);
        if (aliveAliens.length > 0) {
          const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
          bullets.current.push({ x: shooter.x - 20, y: shooter.y, side: 'alien' });
        }
        lastAlienShotTime.current = time;
      }

      // 3. Update Bullets position & Collisions
      bullets.current = bullets.current.filter(b => {
        if (b.side === 'player') {
          b.x += 8;
          // Check collision with aliens
          let hit = false;
          aliens.current.forEach(a => {
            if (a.alive && Math.abs(b.x - a.x) < 20 && Math.abs(b.y - a.y) < 20) {
              a.alive = false;
              hit = true;
              score.current += 10;
              triggerExplosion(a.x, a.y, alienColor);
              if (soundEnabledRef.current) sounds.playSpaceExplosion();
              if (onScoreChange) onScoreChange(score.current);
            }
          });
          return !hit && b.x < width;
        } else {
          b.x -= 6;
          // Check collision with player
          if (Math.abs(b.x - playerPos.current.x) < 30 && Math.abs(b.y - playerPos.current.y) < 40) {
            aiScore.current += 1;
            triggerExplosion(playerPos.current.x, playerPos.current.y, playerColor);
            if (soundEnabledRef.current) sounds.playSpaceExplosion();
            if (onAIScoreChange) onAIScoreChange(aiScore.current);
            return false;
          }
          return b.x > 0;
        }
      });

      // 3.5 Update Particles
      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        return p.life > 0;
      });

      // Reset if all aliens dead
      if (aliens.current.every(a => !a.alive)) {
        initAliens(width, height);
      }
      
      // Reset if aliens reached player
      if (aliens.current.some(a => a.alive && a.x < 100)) {
        aiScore.current += 5;
        if (onAIScoreChange) onAIScoreChange(aiScore.current);
        initAliens(width, height);
      }

      // 4. Draw
      ctx.clearRect(0, 0, width, height);

      // Draw Player (Spaceship)
      ctx.fillStyle = playerColor;
      ctx.shadowBlur = 30;
      ctx.shadowColor = playerColor;
      ctx.beginPath();
      ctx.moveTo(playerPos.current.x - 10, playerPos.current.y - 20);
      ctx.lineTo(playerPos.current.x + 20, playerPos.current.y);
      ctx.lineTo(playerPos.current.x - 10, playerPos.current.y + 20);
      ctx.fill();

      // Draw Aliens
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '24px serif';
      aliens.current.forEach(a => {
        if (!a.alive) return;
        ctx.shadowColor = alienColor;
        ctx.shadowBlur = 20;
        ctx.fillText('👾', a.x, a.y);
      });
      ctx.shadowBlur = 0; // Reset shadow for bullets

      // Draw Bullets
      bullets.current.forEach(b => {
        ctx.fillStyle = b.side === 'player' ? playerColor : alienColor;
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.shadowBlur = 10;
        ctx.fillRect(b.x - 5, b.y - 2, 10, 4);
      });
      ctx.shadowBlur = 0;

      // Draw Particles
      particles.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
      });
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

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
    animationFrameId = requestAnimationFrame(render);

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
