import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const EMOJIS = ['🎮', '🕹️', '👾', '🚀', '💻', '🕶️', '🛸', '🤖', '🌌', '⚡'];

interface SlotMachineProps {
  onWin?: () => void;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ onWin }) => {
  const [slots, setSlots] = useState(['🎮', '🚀', '👾']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [coins, setCoins] = useState<{ id: number; x: number; y: number }[]>([]);
  const clickCount = useRef(0);
  const nextWinAt = useRef(Math.floor(Math.random() * 4) + 2); // 2 to 5 clicks for more frequent wins

  const spawnCoins = (count = 15) => {
    const newCoins = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 250 - 60,
    }));
    setCoins(newCoins);
    setTimeout(() => setCoins([]), 2000);
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    clickCount.current += 1;

    let count = 0;
    const isJackpotWin = clickCount.current >= nextWinAt.current;

    const interval = setInterval(() => {
      if (count < 10) {
        setSlots([
          EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        ]);
      } else {
        clearInterval(interval);
        
        let finalSlots;
        if (isJackpotWin) {
          // REAL JACKPOT: 3 same symbols
          const winEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
          finalSlots = [winEmoji, winEmoji, winEmoji];
          clickCount.current = 0;
          nextWinAt.current = Math.floor(Math.random() * 4) + 2; 
          spawnCoins(20);
          if (onWin) onWin();
        } else {
          // RANDOM OR NEAR MISS: 2 same symbols for excitement
          const emoji1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
          const emoji2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
          
          // 40% chance for a near miss (2 same)
          if (Math.random() < 0.4) {
            finalSlots = [emoji1, emoji1, emoji2];
            // Ensure 3rd is different
            if (finalSlots[2] === finalSlots[0]) {
              finalSlots[2] = EMOJIS[(EMOJIS.indexOf(finalSlots[0]) + 1) % EMOJIS.length];
            }
          } else {
            finalSlots = [
              EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
              EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
              EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            ];
            // Safety: Ensure no accidental 3-of-a-kind
            if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
              finalSlots[2] = EMOJIS[(EMOJIS.indexOf(finalSlots[0]) + 1) % EMOJIS.length];
            }
          }
        }
        
        setSlots(finalSlots);
        setIsSpinning(false);
      }
      count++;
    }, 80);
  };

  const isJackpot = !isSpinning && slots[0] === slots[1] && slots[1] === slots[2];

  return (
    <div 
      onClick={spin}
      className={`slot-3d shine-effect flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer select-none relative overflow-hidden
        ${isJackpot ? 'slot-3d-jackpot' : ''}
      `}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10" />
      
      <AnimatePresence mode="popLayout">
        <div className="flex gap-2">
          {slots.map((emoji, i) => (
            <motion.span
              key={`${i}-${emoji}`}
              initial={{ y: isSpinning ? -20 : 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={`text-lg filter drop-shadow-md ${isJackpot ? 'scale-125' : ''} transition-transform`}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </AnimatePresence>
      
      {isJackpot && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[var(--accent)]/5 animate-pulse pointer-events-none rounded-xl shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]"
        />
      )}

      {/* Coins Animation */}
      <AnimatePresence>
        {coins.map((coin) => (
          <motion.span
            key={coin.id}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 0.5, 
              x: coin.x, 
              y: coin.y,
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 text-yellow-400 pointer-events-none z-50 text-sm"
          >
            🪙
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};
