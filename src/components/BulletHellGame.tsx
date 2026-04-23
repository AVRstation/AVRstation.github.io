import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Rocket, ShieldAlert } from 'lucide-react';
import { sounds } from '../lib/sounds';

interface BulletHellGameProps {
  onScoreChange: (score: number) => void;
  onAIScoreChange: (score: number) => void;
  soundEnabled: boolean;
  onClose?: () => void;
  autoStart?: boolean;
}

export const BulletHellGame = ({ onScoreChange, onAIScoreChange, soundEnabled, onClose, autoStart }: BulletHellGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing'>('playing');
  const [hp, setHp] = useState(3);
  const [rockets, setRockets] = useState(3);
  const [score, setScore] = useState(0);
  const [bossInvulnerable, setBossInvulnerable] = useState(false);

  // Auto-init on mount
  useEffect(() => {
    // Small delay to ensure canvas is ready
    const t = setTimeout(initGame, 100);
    return () => clearTimeout(t);
  }, []);

  // Game Engine Refs
  const requestRef = useRef<number>(0);
  const playerRef = useRef({ x: 0, y: 0, radius: 15, angle: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const bulletsRef = useRef<any[]>([]);
  const enemyBulletsRef = useRef<any[]>([]);
  const bossRef = useRef<any>(null);
  const blocksRef = useRef<any[]>([]);
  const minionsRef = useRef<any[]>([]);
  const dropsRef = useRef<any[]>([]);
  const particlesRef = useRef<any[]>([]);

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    playerRef.current = {
      x: canvas.width / 2,
      y: canvas.height * 0.8,
      radius: 12,
      angle: 0
    };

    // Create Boss (Alien Emoji Shape 👾)
    // 11x8 grid roughly
    const alienMap = [
      "  X     X  ",
      "   X   X   ",
      "  XXXXXXX  ",
      " XX XXX XX ",
      "XXXXXXXXXXX",
      "X XXXXXXX X",
      "X X     X X",
      "   XX XX   "
    ];

    const blockSize = 18;
    const startX = canvas.width / 2 - (alienMap[0].length * blockSize) / 2;
    const startY = canvas.height * 0.2;

    const newBlocks: any[] = [];
    alienMap.forEach((row, y) => {
      row.split('').forEach((char, x) => {
        if (char === 'X') {
          newBlocks.push({
            x: startX + x * blockSize,
            y: startY + y * blockSize,
            w: blockSize - 2,
            h: blockSize - 2,
            hp: 2,
            color: x % 2 === 0 ? '#00f0ff' : '#00b8ff'
          });
        }
      });
    });

    blocksRef.current = newBlocks;
    minionsRef.current = [];
    bulletsRef.current = [];
    enemyBulletsRef.current = [];
    dropsRef.current = [];
    particlesRef.current = [];
    setHp(3);
    setRockets(3);
    setScore(0);
    setGameState('playing');
    
    // Boss Invulnerability at start
    setBossInvulnerable(true);
    setTimeout(() => setBossInvulnerable(false), 3000);
  };

  const spawnDrop = (x: number, y: number) => {
    if (Math.random() > 0.8) {
      dropsRef.current.push({
        x,
        y,
        type: Math.random() > 0.7 ? 'heart' : 'rocket',
        radius: 10,
        vy: 2
      });
    }
  };

  const createExplosion = (x: number, y: number, color: string, isBig = false) => {
    const count = isBig ? 30 : 12;
    for (let i = 0; i < count; i++) {
        particlesRef.current.push({
            x, y,
            vx: (Math.random() - 0.5) * (isBig ? 12 : 6),
            vy: (Math.random() - 0.5) * (isBig ? 12 : 6),
            radius: Math.random() * (isBig ? 4 : 2) + 0.5,
            color,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            rotation: Math.random() * Math.PI,
            rv: (Math.random() - 0.5) * 0.1
        });
    }
  };

  const shootRocket = () => {
    if (rockets > 0 && gameState === 'playing' && (blocksRef.current.length > 0 || minionsRef.current.length > 0)) {
      setRockets(prev => prev - 1);
      
      // Auto-aim rocket at a random target (block or minion)
      const targets = [...blocksRef.current, ...minionsRef.current];
      const target = targets[Math.floor(Math.random() * targets.length)];
      const targetX = target.x + (target.w || 0) / 2;
      const targetY = target.y + (target.h || 0) / 2;
      const angle = Math.atan2(targetY - playerRef.current.y, targetX - playerRef.current.x);
      
      bulletsRef.current.push({
        x: playerRef.current.x,
        y: playerRef.current.y,
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8,
        power: 10,
        isRocket: true,
        trail: []
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleClick = () => shootRocket();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [rockets, gameState]);

  const update = () => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Player Follow Mouse
    const targetX = mouseRef.current.x;
    const targetY = mouseRef.current.y;
    playerRef.current.x += (targetX - playerRef.current.x) * 0.15;
    playerRef.current.y += (targetY - playerRef.current.y) * 0.15;

    // Boss Chaotic Movement
    if (!bossRef.current) {
      bossRef.current = { 
        vx: (Math.random() - 0.5) * 2, 
        vy: (Math.random() - 0.5) * 2,
        lastInvulToggle: Date.now()
      };
    }

    // Random Boss Invulnerability toggle
    if (Date.now() - bossRef.current.lastInvulToggle > 8000) {
      if (Math.random() < 0.3) {
        setBossInvulnerable(true);
        setTimeout(() => setBossInvulnerable(false), 2500);
        bossRef.current.lastInvulToggle = Date.now();
      }
    }

    // Spawn minions around player
    if (Math.random() < 0.015 && minionsRef.current.length < 8) {
      minionsRef.current.push({
        x: Math.random() < 0.5 ? -30 : canvas.width + 30,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 12,
        color: '#ff00ff',
        hp: 3,
        lastShot: Date.now(),
        angle: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2
      });
    }

    // Minion Logic (Independent flight)
    minionsRef.current.forEach((m, mi) => {
      // Change direction occasionally
      if (Math.random() < 0.02) {
        m.targetAngle = Math.random() * Math.PI * 2;
      }
      
      if (m.targetAngle !== undefined) {
        const diff = m.targetAngle - m.angle;
        m.angle += diff * 0.05;
      }
      
      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;

      // Wrap around or bounce
      if (m.x < -50) m.x = canvas.width + 40;
      if (m.x > canvas.width + 50) m.x = -40;
      if (m.y < -50) m.y = canvas.height + 40;
      if (m.y > canvas.height + 50) m.y = -40;

      // Minion Shooting
      if (Date.now() - m.lastShot > 2500) {
        const shotAngle = Math.atan2(playerRef.current.y - m.y, playerRef.current.x - m.x);
        enemyBulletsRef.current.push({
          x: m.x,
          y: m.y,
          vx: Math.cos(shotAngle) * 3,
          vy: Math.sin(shotAngle) * 3,
          radius: 3
        });
        m.lastShot = Date.now();
      }
    });

    // Update Player orientation towards target
    const getTarget = () => {
      // Priority: Nearest minion ONLY if very close (< 250px)
      let nearestMinion = null;
      let minDist = Infinity;
      minionsRef.current.forEach(m => {
        const d = Math.hypot(m.x - playerRef.current.x, m.y - playerRef.current.y);
        if (d < minDist) {
          minDist = d;
          nearestMinion = m;
        }
      });

      if (nearestMinion && minDist < 250) return nearestMinion;

      // Default: Nearest boss block
      let nearestBlock = null;
      let minBlockDist = Infinity;
      blocksRef.current.forEach(b => {
        const d = Math.hypot(b.x + b.w/2 - playerRef.current.x, b.y + b.h/2 - playerRef.current.y);
        if (d < minBlockDist) {
          minBlockDist = d;
          nearestBlock = b;
        }
      });
      return nearestBlock;
    };

    const currentTarget = getTarget();
    if (currentTarget) {
      const tx = currentTarget.x + (currentTarget.w || 0) / 2;
      const ty = currentTarget.y + (currentTarget.h || 0) / 2;
      const targetAngle = Math.atan2(ty - playerRef.current.y, tx - playerRef.current.x);
      
      let diff = targetAngle - playerRef.current.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      playerRef.current.angle += diff * 0.1;
    }
    
    // Change direction occasionally
    if (Math.random() < 0.01) {
      bossRef.current.vx = (Math.random() - 0.5) * 4;
      bossRef.current.vy = (Math.random() - 0.5) * 4;
    }

    // Apply movement to all blocks
    blocksRef.current.forEach(block => {
      block.x += bossRef.current.vx;
      block.y += bossRef.current.vy;
      
      // Screen bounce logic for the group
      if (block.x < 50 || block.x > canvas.width - 50) bossRef.current.vx *= -1;
      if (block.y < 50 || block.y > canvas.height / 2) bossRef.current.vy *= -1;
    });

    // Bullet Spawning (Auto fire)
    if (Date.now() % 300 < 20 && currentTarget) {
      const targetCenterX = currentTarget.x + (currentTarget.w || 0) / 2;
      const targetCenterY = currentTarget.y + (currentTarget.h || 0) / 2;
      
      const angle = Math.atan2(targetCenterY - playerRef.current.y, targetCenterX - playerRef.current.x);
      
      bulletsRef.current.push({
        x: playerRef.current.x,
        y: playerRef.current.y,
        vx: Math.cos(angle) * 10,
        vy: Math.sin(angle) * 10,
        power: 1
      });
    }

    // Boss Shooting (Bullet Hell - reduced rate)
    if (Date.now() % 1200 < 20 && blocksRef.current.length > 0) {
        const sourceBlock = blocksRef.current[Math.floor(Math.random() * blocksRef.current.length)];
        for(let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i + (Date.now() / 1000);
            enemyBulletsRef.current.push({
                x: sourceBlock.x + sourceBlock.w/2,
                y: sourceBlock.y + sourceBlock.h/2,
                vx: Math.cos(angle) * 2.5,
                vy: Math.sin(angle) * 2.5,
                radius: 4
            });
        }
    }

    // Spawn static drops like in Snake (rarely)
    if (Math.random() < 0.005 && dropsRef.current.length < 3) {
      dropsRef.current.push({
        x: 100 + Math.random() * (canvas.width - 200),
        y: 100 + Math.random() * (canvas.height - 200),
        type: Math.random() > 0.7 ? 'heart' : 'rocket',
        radius: 12,
        pulse: 0
      });
    }

    // Logic: Bullets
    bulletsRef.current.forEach((b, bi) => {
      b.x += b.vx;
      b.y += b.vy;

      if (b.isRocket) {
        b.trail = b.trail || [];
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 12) b.trail.shift();
      }

      // Collision with Blocks
      blocksRef.current.forEach((block, bli) => {
        if (b.x > block.x && b.x < block.x + block.w && b.y > block.y && b.y < block.y + block.h) {
          if (bossInvulnerable) {
            // Deflect effect
            createExplosion(b.x, b.y, "#ffffff");
            b.vx *= -1;
            b.vy *= -1;
            return;
          }
          if (b.isRocket) {
            // Explosive damage: check nearby blocks
            const blastRadius = 60;
            blocksRef.current = blocksRef.current.filter(other => {
              const dx = (other.x + other.w/2) - b.x;
              const dy = (other.y + other.h/2) - b.y;
              if (Math.hypot(dx, dy) < blastRadius) {
                createExplosion(other.x + other.w/2, other.y + other.h/2, other.color);
                setScore(s => s + 100);
                return false;
              }
              return true;
            });

            // Rocket also damages minions
            minionsRef.current = minionsRef.current.filter(m => {
              const dx = m.x - b.x;
              const dy = m.y - b.y;
              if (Math.hypot(dx, dy) < blastRadius) {
                createExplosion(m.x, m.y, m.color);
                if (soundEnabled) sounds.playMinionDeath();
                setScore(s => s + 200);
                return false;
              }
              return true;
            });

            createExplosion(b.x, b.y, "#ffaa00", true);
            if (soundEnabled) sounds.playRocketExplosion();
            bulletsRef.current.splice(bi, 1);
          } else {
            block.hp -= b.power;
            createExplosion(b.x, b.y, block.color);
            bulletsRef.current.splice(bi, 1);
            if (soundEnabled) sounds.playBossDamage();
            if (block.hp <= 0) {
              blocksRef.current.splice(bli, 1);
              setScore(s => s + 50);
              onScoreChange(score + 50);
            }
          }
        }
      });

      // Collision with Minions
      minionsRef.current.forEach((m, mi) => {
        if (Math.hypot(b.x - m.x, b.y - m.y) < m.radius + 5) {
          m.hp -= b.power;
          createExplosion(b.x, b.y, m.color);
          bulletsRef.current.splice(bi, 1);
          if (m.hp <= 0) {
            minionsRef.current.splice(mi, 1);
            if (soundEnabled) sounds.playMinionDeath();
            setScore(s => s + 200);
            onScoreChange(score + 200);
            spawnDrop(m.x, m.y);
          }
        }
      });

      if (b.y < -50 || b.y > canvas.height + 50 || b.x < -50 || b.x > canvas.width + 50) {
        bulletsRef.current.splice(bi, 1);
      }
    });

    // Logic: enemy bullets
    enemyBulletsRef.current.forEach((eb, ebi) => {
        eb.x += eb.vx;
        eb.y += eb.vy;

        // Player collision
        const dx = eb.x - playerRef.current.x;
        const dy = eb.y - playerRef.current.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < playerRef.current.radius + eb.radius) {
            if (soundEnabled) sounds.playPlayerDamage();
            setHp(h => {
              const next = h - 1;
              if (next <= 0) {
                if (soundEnabled) sounds.playSpaceExplosion();
                setTimeout(initGame, 100);
                return 3; 
              }
              return next;
            });
            enemyBulletsRef.current.splice(ebi, 1);
            createExplosion(playerRef.current.x, playerRef.current.y, '#ff0055');
        }

        if (eb.x < 0 || eb.x > canvas.width || eb.y < 0 || eb.y > canvas.height) {
            enemyBulletsRef.current.splice(ebi, 1);
        }
    });

    // Logic: Drops (Static glowing drops)
    dropsRef.current.forEach((d, di) => {
      const dx = d.x - playerRef.current.x;
      const dy = d.y - playerRef.current.y;
      if (Math.sqrt(dx*dx + dy*dy) < 30) {
        if (d.type === 'heart') setHp(h => Math.min(h + 1, 5));
        else setRockets(r => r + 1);
        dropsRef.current.splice(di, 1);
      }
    });

    // Logic: Particles
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay || 0.02;
      if (p.rotation !== undefined) p.rotation += p.rv || 0;
      if (p.life <= 0) particlesRef.current.splice(pi, 1);
    });

    if (blocksRef.current.length === 0) {
      if (soundEnabled) sounds.playBossWin();
      setTimeout(initGame, 500);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0,0, canvas.width, canvas.height);

    // Draw Player (Airplane look)
    ctx.save();
    ctx.translate(playerRef.current.x, playerRef.current.y);
    ctx.rotate(playerRef.current.angle + Math.PI / 2); // Facing target
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    
    // Body
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(0, -15); // Nose
    ctx.lineTo(10, 10);
    ctx.lineTo(0, 5);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();
    
    // Wings
    ctx.fillRect(-15, 0, 30, 4);
    
    ctx.restore();
    ctx.shadowBlur = 0;

    // Draw Blocks (3D Style)
    blocksRef.current.forEach(block => {
      const displayColor = bossInvulnerable ? '#1a1a2e' : block.color;
      
      // Side shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(block.x + 3, block.y + 3, block.w, block.h);
      
      // Face
      ctx.fillStyle = displayColor;
      ctx.fillRect(block.x, block.y, block.w, block.h);
      
      // Shimmer during invulnerability
      if (bossInvulnerable) {
        const shimmer = (Math.sin(Date.now() / 100) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${shimmer * 0.15})`;
        ctx.fillRect(block.x, block.y, block.w, block.h);
      }

      // Highlighting edges
      ctx.fillStyle = bossInvulnerable ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)';
      ctx.fillRect(block.x, block.y, block.w, 2);
      ctx.fillRect(block.x, block.y, 2, block.h);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(block.x, block.y + block.h - 2, block.w, 2);
      ctx.fillRect(block.x + block.w - 2, block.y, 2, block.h);
    });

    // Draw Bullets (with curves and glow)
    bulletsRef.current.forEach(b => {
      if (b.isRocket) {
        // Trail
        if (b.trail) {
          b.trail.forEach((t: any, i: number) => {
            const alpha = i / b.trail.length;
            ctx.fillStyle = `rgba(255, 170, 0, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 6 * alpha, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffaa00';
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
      }
    });

    // Draw Enemy Bullets
    ctx.fillStyle = '#ff0055';
    enemyBulletsRef.current.forEach(eb => {
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, eb.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Minions (👾)
    minionsRef.current.forEach(m => {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.shadowBlur = 10;
      ctx.shadowColor = m.color;
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👾', 0, 0);
      ctx.restore();
    });

    // Draw Drops (Glowing like Snake apples)
    dropsRef.current.forEach(d => {
      d.pulse = (d.pulse || 0) + 0.1;
      const glowScale = 1 + Math.sin(d.pulse) * 0.3;
      
      ctx.shadowBlur = 15 * glowScale;
      ctx.shadowColor = d.type === 'heart' ? '#ff0055' : '#ffaa00';
      
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = d.type === 'heart' ? '#ff0055' : '#ffaa00';
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(d.type === 'heart' ? '❤' : '🚀', d.x, d.y + 4);
    });

    // Draw Particles (Improved with rotation)
    particlesRef.current.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.rotation !== undefined) ctx.rotate(p.rotation);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      
      if (p.rotation !== undefined) {
        ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  };

  const loop = () => {
    update();
    draw();
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, rockets, hp]);

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-[5]">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full pointer-events-auto cursor-none opacity-60"
      />

      {/* UI Overlay - Minimalistic for integrated feel */}
      <div className="absolute top-32 left-10 flex flex-col gap-3 pointer-events-none lg:top-40">
        <div className="flex gap-1.5 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart 
              key={i} 
              className={`w-4 h-4 transition-all ${i < hp ? 'text-[#ff0055] fill-[#ff0055] scale-100' : 'text-zinc-800 scale-75 opacity-20'}`} 
            />
          ))}
        </div>
        <div className="flex gap-1.5 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          {Array.from({ length: Math.max(0, rockets) }).map((_, i) => (
            <Rocket 
              key={i} 
              className="w-4 h-4 text-[#ffaa00] fill-[#ffaa00]" 
            />
          ))}
        </div>
      </div>

      {/* HP Warn */}
      {hp === 1 && (
        <motion.div 
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute inset-0 border-[20px] border-red-500/50 pointer-events-none"
        />
      )}
    </div>
  );
};
