import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FUNNY_MESSAGES = [
  "Calibrating flux capacitor...",
  "Powering up vacuum tubes...",
  "Feeding virtual kittens...",
  "Rerouting power to main thrusters...",
  "Defragmenting reality...",
  "Optimizing gravity levels...",
  "Loading pixels one by one...",
  "Searching for the 'Any' key...",
  "Polishing the achievements...",
  "Inflating 3D vertices...",
  "Brewing coffee for the engine...",
  "Generating random bugs...",
  "Synchronizing with the motherboard...",
  "Adjusting level of awesome...",
  "Reticulating splines...",
  "Downloading common sense...",
  "Waking up the sprites...",
  "Cleaning the mouse balls...",
  "Engaging warp drive...",
  "Translating binary to jokes...",
  "Polishing pixels with non-existent rag...",
  "Counting to infinity... twice...",
  "Calculating the answer to life...",
  "Scanning for plot holes...",
  "Warming up the GPU with high-fives...",
  "Bending the laws of physics...",
  "Un-discovering fire for a moment...",
  "Sorting icons by emotional state...",
  "Teaching AI how to appreciate art...",
  "Mining for data-gold...",
  "Whispering sweet nothings to the CPU..."
];

interface RetroLoaderProps {
  onFinish: () => void;
  key?: string;
}

export function RetroLoader({ onFinish }: RetroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(() => FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);

  useEffect(() => {
    // Preload critical images while loading
    const imagesToPreload = [
      "https://raw.githubusercontent.com/AVRstation/AVRstation.github.io/main/public/FootBall_case.jpg",
      "https://raw.githubusercontent.com/AVRstation/AVRstation.github.io/main/public/jigle_case.png",
      "https://raw.githubusercontent.com/AVRstation/AVRstation.github.io/main/public/biathlon_case.jpeg",
      "https://raw.githubusercontent.com/AVRstation/AVRstation.github.io/main/public/museum_case.jpg",
      "https://raw.githubusercontent.com/AVRstation/AVRstation.github.io/main/public/apart_case.jpg",
      "https://static.tildacdn.com/tild3234-6461-4636-b435-643732656430/firm2222.jpg",
      "https://cdn.forbes.ru/files/boxglass_1.webp"
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const duration = 2000; // Faster loading
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const messageInterval = setInterval(() => {
      setMessage(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);
    }, 1500); // Slower message rotation

    return () => {
      clearInterval(timer);
      clearInterval(messageInterval);
    };
  }, [onFinish]);

  // Calculate number of segments based on progress
  // Total blocks in reference is about 20
  const totalBlocks = 20;
  const activeBlocks = Math.floor((progress / 100) * totalBlocks);

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center font-retro text-white px-8"
      style={{
        background: 'radial-gradient(circle at 50% -20%, var(--bg-grad) 0%, var(--bg) 70%)',
        backgroundColor: 'var(--bg)'
      }}
    >
      <div className="w-full max-w-2xl">
        {/* Loading and Percentage Row */}
        <div className="flex justify-between items-end mb-6 text-sm sm:text-lg tracking-widest">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            LOADING...
          </motion.div>
          <div className="min-w-[80px] text-right">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Retro Block Bar */}
        <div className="h-10 sm:h-14 border-4 border-white p-1.5 flex gap-1 relative bg-black">
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <div 
              key={i}
              className={`flex-1 h-full transition-colors duration-100 ${
                i < activeBlocks ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Caption - Centered and subtle */}
        <div className="mt-12 text-center min-h-[3rem] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={message}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="text-[9px] sm:text-[11px] leading-relaxed text-white/40 uppercase tracking-[0.15em] px-4"
            >
              {message}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
