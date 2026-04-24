import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TreasureChestProps {
  onOpen?: () => void;
  onBackToTop?: () => void;
  t: any;
}

const Block = ({ w, h, d, x, y, z, color, topColor, leftColor, frontColor }: any) => {
  const c = color;
  const tc = topColor || c;
  const lc = leftColor || c;
  const fc = frontColor || c;

  return (
    <div 
      className="absolute"
      style={{
        width: w,
        height: h,
        transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
      }}
    >
      {/* Front */}
      <div className="absolute inset-0" style={{ transform: `translateZ(${d/2}px)`, backgroundColor: fc, border: '2px solid rgba(0,0,0,0.3)' }} />
      {/* Back */}
      <div className="absolute inset-0" style={{ transform: `rotateY(180deg) translateZ(${d/2}px)`, backgroundColor: c, border: '2px solid rgba(0,0,0,0.3)' }} />
      {/* Right */}
      <div className="absolute" style={{ width: d, height: h, transform: `rotateY(90deg) translateZ(${w/2}px)`, left: w/2 - d/2, backgroundColor: lc, border: '2px solid rgba(0,0,0,0.3)' }} />
      {/* Left */}
      <div className="absolute" style={{ width: d, height: h, transform: `rotateY(-90deg) translateZ(${w/2}px)`, left: w/2 - d/2, backgroundColor: lc, border: '2px solid rgba(0,0,0,0.3)' }} />
      {/* Top */}
      <div className="absolute" style={{ width: w, height: d, transform: `rotateX(90deg) translateZ(${h/2}px)`, top: h/2 - d/2, backgroundColor: tc, border: '2px solid rgba(0,0,0,0.3)' }} />
      {/* Bottom */}
      <div className="absolute" style={{ width: w, height: d, transform: `rotateX(-90deg) translateZ(${h/2}px)`, top: h/2 - d/2, backgroundColor: c, border: '2px solid rgba(0,0,0,0.3)' }} />
    </div>
  );
};

export const TreasureChest: React.FC<TreasureChestProps> = ({ onOpen, onBackToTop, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<{ id: number; char: string; x: number; y: number; z: number; delay: number }[]>([]);

  const openChest = () => {
    if (isOpen) return;
    setIsOpen(true);
    if (onOpen) onOpen();

    const rewards = ['🪙', '💎', '💍', '🧿', '✨', '👑', '💰', '⚔️', '🛡️', '🧪'];
    const newItems = Array.from({ length: 18 }).map((_, i) => ({
      id: Date.now() + i,
      char: rewards[Math.floor(Math.random() * rewards.length)],
      x: (Math.random() - 0.5) * 300,
      y: -Math.random() * 250 - 100,
      z: (Math.random() - 0.5) * 200, // add a bit of Z scatter since it's 3D now
      delay: Math.random() * 0.3,
    }));
    setItems(newItems);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onBackToTop) onBackToTop();
  };

  return (
    <div className="relative mt-20 mb-32 flex flex-col items-center" style={{ perspective: '1200px' }}>
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-[10px] font-black uppercase tracking-[0.6em] text-yellow-400 bg-yellow-400/10 px-6 py-2 rounded-full border border-yellow-400/20 shadow-[0_0_30px_rgba(250,204,21,0.15)]"
        >
          {isOpen ? t.chest_title_open : t.chest_title_locked}
        </motion.div>
      </div>

      <div 
        onClick={openChest}
        className="relative group cursor-pointer transition-transform duration-500 hover:scale-110 active:scale-95"
        style={{ width: 160, height: 120 }}
      >
        {/* Glow Magic (outside 3D container to avoid preserve-3d flattening) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.1 }}
              className="absolute inset-0 bg-yellow-400/60 rounded-full blur-[25px] mix-blend-screen pointer-events-none z-0"
            />
          )}
        </AnimatePresence>

        {/* Magic Glow Rays */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-32 left-[-60px] right-[-60px] bottom-[40px] bg-gradient-to-t from-yellow-500/40 to-transparent blur-[40px] pointer-events-none z-0"
          />
        )}

        {/* 3D Rotating Chest Body */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ rotateY: 15, rotateX: -10 }}
          animate={{ rotateX: -20, rotateY: -25 }}
        >
          {/* Ground Shadow */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-48 h-12 bg-black/60 blur-2xl rounded-[100%] z-[-1]" style={{ transform: 'translateZ(-50px)' }} />

          {/* --- BASE --- */}
        <div className="absolute left-0 top-[40px]" style={{ width: 160, height: 80, transformStyle: 'preserve-3d' }}>
          {/* Base Wood */}
          <Block w={160} h={80} d={100} x={0} y={0} z={0} color="#5d4037" topColor="#4e342e" leftColor="#3e2723" />
          {/* Base gold bands */}
          <Block w={16} h={82} d={102} x={16} y={-1} z={0} color="#ca8a04" topColor="#eab308" leftColor="#a16207" />
          <Block w={16} h={82} d={102} x={128} y={-1} z={0} color="#ca8a04" topColor="#eab308" leftColor="#a16207" />
          
          {/* Lock Bottom Half */}
          <Block w={24} h={16} d={8} x={68} y={0} z={50} color="#eab308" topColor="#fde047" leftColor="#ca8a04" />
        </div>

        {/* --- LID --- */}
        <motion.div 
          className="absolute left-0 top-0"
          style={{ 
            width: 160, 
            height: 40, 
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 100% -50px' 
          }}
          animate={isOpen ? { rotateX: -120 } : { rotateX: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12, mass: 1.5 }}
        >
          {/* Lid Wood */}
          <Block w={160} h={40} d={100} x={0} y={0} z={0} color="#5d4037" topColor="#795548" leftColor="#3e2723" />
          
          {/* Lid Bevel Top (to give it that curved chest look) */}
          <Block w={160} h={16} d={70} x={0} y={-16} z={0} color="#6d4c41" topColor="#8d6e63" leftColor="#4e342e" />
          
          {/* Lid gold bands Main */}
          <Block w={16} h={42} d={102} x={16} y={-2} z={0} color="#ca8a04" topColor="#eab308" leftColor="#a16207" />
          <Block w={16} h={42} d={102} x={128} y={-2} z={0} color="#ca8a04" topColor="#eab308" leftColor="#a16207" />

          {/* Lid gold bands Top Bevel */}
          <Block w={16} h={18} d={72} x={16} y={-18} z={0} color="#ca8a04" topColor="#eab308" leftColor="#a16207" />
          <Block w={16} h={18} d={72} x={128} y={-18} z={0} color="#ca8a04" topColor="#eab308" leftColor="#a16207" />

          {/* Lock Top Half */}
          <Block w={24} h={24} d={8} x={68} y={24} z={50} color="#eab308" topColor="#fde047" leftColor="#ca8a04" />
          <Block w={6} h={8} d={10} x={77} y={30} z={50} color="#000" topColor="#000" leftColor="#000" />
        </motion.div>

        {/* Loot Spawning */}
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0, z: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0, 1.5, 1, 0.4],
                x: item.x,
                y: item.y,
                z: item.z,
                rotateX: Math.random() * 720,
                rotateY: Math.random() * 720,
              }}
              transition={{ 
                duration: 2.5, 
                delay: item.delay,
                ease: "easeOut"
              }}
              className="absolute left-1/2 top-4 -translate-x-1/2 text-3xl will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {item.char}
            </motion.div>
          ))}
        </div>

        </motion.div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-8 z-30">
        <div className="text-[10px] uppercase font-black tracking-[0.3em] text-yellow-500/60 text-center max-w-[200px] leading-relaxed">
          {!isOpen ? t.chest_desc_locked : t.chest_desc_open}
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
              <span className="text-sm font-black uppercase tracking-[0.2em] text-yellow-400">{t.chest_button}</span>
              <motion.span 
                animate={{ y: [0, -4, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-lg flex items-center gap-0.5"
              >
                🚀🌕
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

