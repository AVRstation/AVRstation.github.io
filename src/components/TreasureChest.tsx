import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TreasureChestProps {
  onOpen?: () => void;
  onBackToTop?: () => void;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({ onOpen, onBackToTop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<{ id: number; char: string; x: number; y: number; delay: number }[]>([]);

  const openChest = () => {
    if (isOpen) return;
    setIsOpen(true);
    if (onOpen) onOpen();

    const rewards = ['🪙', '💎', '💍', '🧿', '✨', '👑', '💰', '⚔️', '🛡️', '🧪'];
    const newItems = Array.from({ length: 18 }).map((_, i) => ({
      id: Date.now() + i,
      char: rewards[Math.floor(Math.random() * rewards.length)],
      x: (Math.random() - 0.5) * 440,
      y: -Math.random() * 350 - 150,
      delay: Math.random() * 0.3,
    }));
    setItems(newItems);
  };

  const scrollToTop = () => {
    // Try scrolling both the window and the main container for maximum compatibility
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (onBackToTop) onBackToTop();
  };

  return (
    <div className="relative mt-20 mb-32 flex flex-col items-center perspective-1000">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-[10px] font-black uppercase tracking-[0.6em] text-yellow-400 bg-yellow-400/10 px-6 py-2 rounded-full border border-yellow-400/20 shadow-[0_0_30px_rgba(250,204,21,0.15)]"
        >
          {isOpen ? "ANCIENT TREASURE DISCOVERED" : "QUEST REWARD LOCATED"}
        </motion.div>
      </div>

      <div 
        onClick={openChest}
        className="relative group cursor-pointer w-48 h-32 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 duration-500"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Ground Shadow */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-40 h-8 bg-black/50 blur-2xl rounded-[100%] z-0" />

        {/* 3D Chest Body */}
        <div className="relative w-40 h-24 preserve-3d">
          
          {/* Base of Chest */}
          <div className="absolute inset-0 bg-[#5d4037] border-2 border-[#3e2723] rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
            {/* Wooden Planks Effect */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, #000 95%), linear-gradient(0deg, transparent 95%, #000 95%)', backgroundSize: '10px 10px' }} />
            {/* Gold Bands */}
            <div className="absolute left-4 top-0 bottom-0 w-3 bg-yellow-600 border-x border-yellow-800" />
            <div className="absolute right-4 top-0 bottom-0 w-3 bg-yellow-600 border-x border-yellow-800" />
            
            {/* Lock */}
            <div className="absolute left-1/2 top-1 -translate-x-1/2 w-6 h-8 bg-yellow-500 border-2 border-yellow-700 rounded-b-lg shadow-lg z-20">
               <div className="absolute left-1/2 top-4 -translate-x-1/2 w-2 h-3 bg-black/40 rounded-full" />
            </div>
          </div>

          {/* Lid of Chest */}
          <motion.div 
            animate={isOpen ? { rotateX: -110, y: -5 } : { rotateX: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="absolute top-0 left-0 w-40 h-16 origin-bottom z-10 preserve-3d"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Top Side */}
            <div className="absolute inset-0 bg-[#5d4037] border-2 border-[#3e2723] rounded-t-xl shadow-[inset_0_10px_20px_rgba(255,255,255,0.1)]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, #000 95%)', backgroundSize: '15px 10px' }} />
              {/* Gold Bands Top */}
              <div className="absolute left-4 top-0 bottom-0 w-3 bg-yellow-600 border-x border-yellow-800" />
              <div className="absolute right-4 top-0 bottom-0 w-3 bg-yellow-600 border-x border-yellow-800" />
            </div>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.1 }}
                className="absolute inset-0 bg-yellow-400/60 rounded-full blur-[25px] -z-10 mix-blend-screen overflow-visible will-change-transform"
              />
            )}
          </AnimatePresence>

          {/* Loot Spawning */}
          <div className="absolute inset-0 pointer-events-none z-40">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0, x: "0px", y: "0px" }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  scale: [0, 1.5, 1, 0.4],
                  x: item.x,
                  y: item.y,
                  rotate: 720
                }}
                transition={{ 
                  duration: 2.5, 
                  delay: item.delay,
                  ease: "easeOut"
                }}
                className="absolute left-1/2 top-4 -translate-x-1/2 text-3xl will-change-transform"
              >
                {item.char}
              </motion.div>
            ))}
          </div>

          {/* Magic Glow Rays */}
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-32 left-[-60px] right-[-60px] bottom-0 bg-gradient-to-t from-yellow-500/30 to-transparent blur-[40px] pointer-events-none -z-20 will-change-opacity"
            />
          )}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-8 z-30">
        <div className="text-[10px] uppercase font-black tracking-[0.3em] text-yellow-500/60 text-center max-w-[200px] leading-relaxed">
          {!isOpen ? "EPIC LOAT AWAITS YOUR COMMAND" : "TREASURE CLAIMED SUCCESSFULLY"}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="kb-key px-8 py-4 !flex-row gap-3 border-yellow-500/30 hover:border-yellow-400 shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:translate-y-1 touch-manipulation z-[60]"
            >
              <span className="kb-key-label !static !translate-y-0 text-[10px] opacity-50">TOP</span>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-yellow-400">Return to Start</span>
              <motion.span 
                animate={{ y: [0, -4, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-lg"
              >
                🏰
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
