import React, { useEffect, useRef } from 'react';
import { sounds } from '../lib/sounds';

interface PongGameProps {
  onScoreChange?: (score: number) => void;
  onAIScoreChange?: (score: number) => void;
  soundEnabled?: boolean;
}

export const PongGame: React.FC<PongGameProps> = ({ onScoreChange, onAIScoreChange, soundEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);
  const ballRef = useRef<{ x: number, y: number, vx: number, vy: number, trail: { x: number, y: number }[] }>({ 
    x: 0, y: 0, vx: 5, vy: 5, trail: [] 
  });
  const playerRef = useRef({ y: 0 });
  const aiRef = useRef({ y: 0 });
  const scoresRef = useRef({ player: 0, ai: 0 });
  const playerLives = useRef(3);
  const aiLives = useRef(3);
  const respawnTimer = useRef(0);
  const particles = useRef<{ x: number, y: number, vx: number, vy: number, life: number, color: string }[]>([]);
  
  const hitEffectRef = useRef({ x: 0, y: 0, opacity: 0, color: '#FFFFFF' });
  
  const paddleHeight = 120;
  const paddleWidth = 14;
  const ballSize = 8;
  const paddleMargin = 50;

  const triggerHitEffect = (x: number, y: number, color = '#FFFFFF') => {
    hitEffectRef.current = { x, y, opacity: 1, color };
  };

  const triggerExplosion = (x: number, y: number, color: string, isHuge: boolean = false) => {
    const count = isHuge ? 40 : 15;
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x, y,
        vx: (Math.random() - 0.5) * (isHuge ? 15 : 6),
        vy: (Math.random() - 0.5) * (isHuge ? 15 : 6),
        life: 1.0,
        color
      });
    }
  };

  const resetGame = (width: number, height: number, time: number) => {
    scoresRef.current.player = 0;
    scoresRef.current.ai = 0;
    if (onScoreChange) onScoreChange(0);
    if (onAIScoreChange) onAIScoreChange(0);
    playerLives.current = 3;
    aiLives.current = 3;
    resetBall(width, height, time);
  };

  const resetBall = (canvasWidth: number, canvasHeight: number, time: number) => {
    ballRef.current = {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      vx: (Math.random() > 0.5 ? 1 : -1) * 5,
      vy: (Math.random() - 0.5) * 10,
      trail: []
    };
    respawnTimer.current = time + 1500; // 1.5 seconds pause
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      playerRef.current.y = e.clientY - paddleHeight / 2;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        playerRef.current.y = e.touches[0].clientY - paddleHeight / 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let animationFrameId: number;
    const render = (time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const { width, height } = canvas;
      if (ballRef.current.x === 0 && ballRef.current.y === 0) {
        resetBall(width, height, time);
        playerRef.current.y = height / 2 - paddleHeight / 2;
        aiRef.current.y = height / 2 - paddleHeight / 2;
      }

      const isRespawning = time < respawnTimer.current;

      // Update ball
      if (!isRespawning) {
        ballRef.current.trail.unshift({ x: ballRef.current.x, y: ballRef.current.y });
        if (ballRef.current.trail.length > 10) ballRef.current.trail.pop();

        ballRef.current.x += ballRef.current.vx;
        ballRef.current.y += ballRef.current.vy;

        // Wall bounce (top/bottom)
      if (ballRef.current.y < 0 || ballRef.current.y > height) {
        ballRef.current.vy *= -1;
        // Firm position correction to avoid sticking
        ballRef.current.y = ballRef.current.y < 0 ? 0 : height;
        if (soundEnabledRef.current) sounds.playPongHit();
        triggerHitEffect(ballRef.current.x, ballRef.current.y);
      }

      // Player paddle bounce
      if (
        ballRef.current.x < paddleMargin + paddleWidth &&
        ballRef.current.x > paddleMargin &&
        ballRef.current.y > playerRef.current.y &&
        ballRef.current.y < playerRef.current.y + paddleHeight
      ) {
        ballRef.current.vx = Math.abs(ballRef.current.vx) * 1.05; // Speed up
        const deltaY = ballRef.current.y - (playerRef.current.y + paddleHeight / 2);
        ballRef.current.vy = deltaY * 0.2;
        triggerHitEffect(paddleMargin + paddleWidth, ballRef.current.y);
        if (soundEnabledRef.current) sounds.playPongHit();
      }

      // AI paddle bounce
      if (
        ballRef.current.x > width - paddleMargin - paddleWidth &&
        ballRef.current.x < width - paddleMargin &&
        ballRef.current.y > aiRef.current.y &&
        ballRef.current.y < aiRef.current.y + paddleHeight
      ) {
        ballRef.current.vx = -Math.abs(ballRef.current.vx) * 1.05; // Speed up
        const deltaY = ballRef.current.y - (aiRef.current.y + paddleHeight / 2);
        ballRef.current.vy = deltaY * 0.2;
        triggerHitEffect(width - paddleMargin - paddleWidth, ballRef.current.y);
        if (soundEnabledRef.current) sounds.playPongHit();
      }
      } // CLOSE if(!isRespawning)

      // AI Movement
      if (!isRespawning) {
        const aiTarget = ballRef.current.y - paddleHeight / 2;
        aiRef.current.y += (aiTarget - aiRef.current.y) * 0.1;
      }

      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const playerColor = theme === 'dark' ? '#00F0FF' : '#0088CC';
      const aiColor = theme === 'dark' ? '#FF00FF' : '#AA00AA';

      // Scoring
      if (!isRespawning) {
        if (ballRef.current.x < 0) {
          scoresRef.current.ai += 1;
          if (onAIScoreChange) onAIScoreChange(scoresRef.current.ai);
          
          playerLives.current -= 1;
          
          if (playerLives.current <= 0) {
            triggerExplosion(paddleMargin, playerRef.current.y + paddleHeight / 2, playerColor, true);
            if (soundEnabledRef.current) sounds.playSnakeDeath();
            resetGame(width, height, time);
          } else {
            // Just break a heart
            triggerExplosion(paddleMargin - 25, playerRef.current.y + paddleHeight / 2 + (playerLives.current - 1) * 20, '#FF0000', false);
            triggerHitEffect(0, ballRef.current.y, '#FF0000');
            if (soundEnabledRef.current) sounds.playPongScore();
            resetBall(width, height, time);
          }
        } else if (ballRef.current.x > width) {
          scoresRef.current.player += 1;
          if (onScoreChange) onScoreChange(scoresRef.current.player);

          aiLives.current -= 1;

          if (aiLives.current <= 0) {
            triggerExplosion(width - paddleMargin, aiRef.current.y + paddleHeight / 2, aiColor, true);
            if (soundEnabledRef.current) sounds.playSnakeDeath();
            resetGame(width, height, time);
          } else {
            // Just break a heart
            triggerExplosion(width - paddleMargin + 25, aiRef.current.y + paddleHeight / 2 + (aiLives.current - 1) * 20, '#FF0000', false);
            triggerHitEffect(width, ballRef.current.y, '#FF0000');
            if (soundEnabledRef.current) sounds.playPongScore();
            resetBall(width, height, time);
          }
        }
      }

      // Update Particles
      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        return p.life > 0;
      });

      // Draw
      ctx.clearRect(0, 0, width, height);
      
      // Middle Line
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player Paddle
      ctx.fillStyle = playerColor;
      ctx.shadowBlur = 25;
      ctx.shadowColor = playerColor;
      ctx.beginPath();
      ctx.roundRect(paddleMargin, playerRef.current.y, paddleWidth, paddleHeight, paddleWidth / 2);
      ctx.fill();

      // Draw Player Lives (Hearts)
      ctx.shadowBlur = 0;
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < playerLives.current; i++) {
        // Arrange vertically, left of the player's paddle
        ctx.fillText('❤️', paddleMargin - 25, playerRef.current.y + paddleHeight / 2 - 20 + i * 20);
      }

      // AI Paddle
      ctx.fillStyle = aiColor;
      ctx.shadowColor = aiColor;
      ctx.shadowBlur = 25;
      
      // Draw death/rebirth effect
      if (isRespawning && aiLives.current > 0 && playerLives.current > 0) {
        // Add a spawning flicker
        ctx.globalAlpha = 0.5 + Math.sin(time / 50) * 0.5;
        // The ball also blinks while respawning
      }

      ctx.beginPath();
      ctx.roundRect(width - paddleMargin - paddleWidth, aiRef.current.y, paddleWidth, paddleHeight, paddleWidth / 2);
      ctx.fill();

      // Draw AI Lives (Hearts)
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
      for (let i = 0; i < aiLives.current; i++) {
        // Arrange vertically, right of the ai's paddle
        ctx.fillText('❤️', width - paddleMargin + 25, aiRef.current.y + paddleHeight / 2 - 20 + i * 20);
      }

      // Ball Trail
      if (!isRespawning) {
        ballRef.current.trail.forEach((t, i) => {
          const ratio = (10 - i) / 10;
          ctx.beginPath();
          ctx.arc(t.x, t.y, ballSize * ratio, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 160, 0, ${ratio * 0.4})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        });
      }

      // Ball
      if (isRespawning && (playerLives.current > 0 && aiLives.current > 0)) {
        ctx.globalAlpha = 0.5 + Math.sin(time / 50) * 0.5;
      }
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballSize, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB000';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFB000';
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Hit Glow Effect
      if (hitEffectRef.current.opacity > 0) {
        const { x, y, opacity, color } = hitEffectRef.current;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 100);
        const rgb = color === '#FF0000' ? '255, 0, 0' : '255, 255, 255';
        grad.addColorStop(0, `rgba(${rgb}, ${opacity * 0.5})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.shadowBlur = 0;
        ctx.fillRect(x - 100, y - 100, 200, 200);
        hitEffectRef.current.opacity -= 0.05;
      }

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
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-5 hidden lg:block opacity-60"
      role="img"
      aria-label="Interactive background game: Pong. A classic arcade game where you control a paddle to hit a ball against an AI opponent."
    />
  );
};
