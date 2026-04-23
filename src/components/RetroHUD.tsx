import React, { useEffect, useState, useRef } from 'react';

interface RetroHUDProps {
  isActive: boolean;
  onExit?: () => void;
}

export function RetroHUD({ isActive, onExit }: RetroHUDProps) {
  const [fps, setFps] = useState(0);
  const [time, setTime] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (!isActive) {
      setTime(0);
      return;
    }
    
    startTime.current = performance.now();
    lastTime.current = performance.now();
    frameCount.current = 0;
    
    let rafId: number;
    const update = () => {
      const now = performance.now();
      
      // Update Timer
      setTime(now - startTime.current);

      // Update FPS
      frameCount.current++;
      if (now >= lastTime.current + 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
        lastTime.current = now;
        frameCount.current = 0;
      }

      rafId = requestAnimationFrame(update);
    };
    
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isActive]);

  if (!isActive) return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[10002] font-retro text-[#00FF00]">
      {/* Top Bar */}
      <div className="absolute top-6 inset-x-6 flex justify-between items-start text-[10px] md:text-xs tracking-tighter drop-shadow-[0_0_4px_rgba(0,255,0,0.5)]">
        {/* Left Side: Speedrun Timer */}
        <div className="flex flex-col gap-1.5 translate-y-2">
          <div className="opacity-40 text-[7px] uppercase tracking-[0.2em] animate-pulse">Running Session</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full animate-ping opacity-75" />
            <div className="bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
              {formatTime(time)}
            </div>
          </div>
        </div>

        {/* Right Side: FPS Monitor */}
        <div className="flex flex-col items-end gap-1.5 translate-y-2">
          <div className="opacity-40 text-[7px] uppercase tracking-[0.2em]">Engine Feedback</div>
          <div className="bg-black/20 backdrop-blur-sm px-2 py-1 rounded flex items-baseline gap-1">
            <span className="text-[var(--accent)]">{fps}</span>
            <span className="text-[6px] opacity-60 tracking-normal">FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
