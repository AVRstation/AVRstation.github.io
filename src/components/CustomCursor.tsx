import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.getAttribute('role') === 'button';
      
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isClicking ? 0.9 : (isHovering ? 1.2 : 1)
      }}
      transition={{ 
        opacity: { duration: 0.15 },
        scale: { type: "spring", stiffness: 400, damping: 25 }
      }}
    >
      <div className="relative">
        {/* Glow Effect */}
        <motion.div 
          className="absolute inset-0 bg-[var(--accent)] blur-md opacity-30 rounded-full"
          animate={{
            scale: isHovering ? 2 : 1.2,
            opacity: isHovering ? 0.4 : 0.2
          }}
        />
        
        {/* Pointer Shape - Modern Triangle */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-xl"
        >
          <path 
            d="M3 3L21 12L12 14L9 21L3 3Z" 
            fill="var(--accent)" 
            stroke="white" 
            strokeWidth="1.5"
            strokeLinejoin="round" 
          />
        </svg>

        {/* Status Dot for Hovering */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -right-1 -bottom-1 w-2.5 h-2.5 bg-white rounded-full shadow-lg border border-[var(--accent)]"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { AnimatePresence } from 'motion/react';
