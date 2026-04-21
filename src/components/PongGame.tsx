import React, { useEffect, useRef } from 'react';

interface PongGameProps {
  onScoreChange?: (score: number) => void;
  onAIScoreChange?: (score: number) => void;
}

export const PongGame: React.FC<PongGameProps> = ({ onScoreChange, onAIScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef({ x: 0, y: 0, vx: 5, vy: 5 });
  const playerRef = useRef({ y: 0 });
  const aiRef = useRef({ y: 0 });
  const scoresRef = useRef({ player: 0, ai: 0 });
  
  const hitEffectRef = useRef({ x: 0, y: 0, opacity: 0 });
  
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballSize = 8;
  const paddleMargin = 50;

  const triggerHitEffect = (x: number, y: number) => {
    hitEffectRef.current = { x, y, opacity: 1 };
  };

  const resetBall = (canvasWidth: number, canvasHeight: number) => {
    ballRef.current = {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      vx: (Math.random() > 0.5 ? 1 : -1) * 5,
      vy: (Math.random() - 0.5) * 10
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      playerRef.current.y = e.clientY - paddleHeight / 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const { width, height } = canvas;
      if (ballRef.current.x === 0 && ballRef.current.y === 0) {
        resetBall(width, height);
        playerRef.current.y = height / 2 - paddleHeight / 2;
        aiRef.current.y = height / 2 - paddleHeight / 2;
      }

      // Update ball
      ballRef.current.x += ballRef.current.vx;
      ballRef.current.y += ballRef.current.vy;

      // Wall bounce (top/bottom)
      if (ballRef.current.y < 0 || ballRef.current.y > height) {
        ballRef.current.vy *= -1;
        triggerHitEffect(ballRef.current.x, ballRef.current.y < 0 ? 0 : height);
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
      }

      // AI Movement
      const aiTarget = ballRef.current.y - paddleHeight / 2;
      aiRef.current.y += (aiTarget - aiRef.current.y) * 0.1;

      // Scoring
      if (ballRef.current.x < 0) {
        scoresRef.current.ai += 1;
        if (onAIScoreChange) onAIScoreChange(scoresRef.current.ai);
        resetBall(width, height);
      } else if (ballRef.current.x > width) {
        scoresRef.current.player += 1;
        if (onScoreChange) onScoreChange(scoresRef.current.player);
        resetBall(width, height);
      }

      // Draw
      ctx.clearRect(0, 0, width, height);
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const playerColor = theme === 'dark' ? '#00F0FF' : '#0088CC';
      const aiColor = theme === 'dark' ? '#FF00FF' : '#AA00AA';

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
      ctx.fillRect(paddleMargin, playerRef.current.y, paddleWidth, paddleHeight);

      // AI Paddle
      ctx.fillStyle = aiColor;
      ctx.shadowColor = aiColor;
      ctx.shadowBlur = 25;
      ctx.fillRect(width - paddleMargin - paddleWidth, aiRef.current.y, paddleWidth, paddleHeight);

      // Ball
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballSize, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFFFFF';
      ctx.fill();

      // Hit Glow Effect
      if (hitEffectRef.current.opacity > 0) {
        const { x, y, opacity } = hitEffectRef.current;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 100);
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.4})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.shadowBlur = 0;
        ctx.fillRect(x - 100, y - 100, 200, 200);
        hitEffectRef.current.opacity -= 0.05;
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
