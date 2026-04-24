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

const CubeFace = ({ isOuter, bgColor, emoji, transform }: { isOuter: boolean, bgColor: string, emoji: string, transform: string }) => {
  if (!isOuter) {
    return (
      <div 
        className="absolute w-[30px] h-[30px] bg-black/40 border border-white/10"
        style={{ transform }}
      />
    );
  }
  return (
    <div 
      className="absolute w-[30px] h-[30px] border border-white/40 flex items-center justify-center rounded-sm shadow-[inset_0_0_10px_rgba(255,255,255,0.3)] backdrop-blur-[2px]"
      style={{ transform, backgroundColor: bgColor }}
    >
      <span className="text-[14px] leading-none select-none drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{emoji}</span>
    </div>
  );
};

const CUBE_COLORS = [
  { bgColor: "rgba(239, 68, 68, 0.4)", emoji: "🕹️" },
  { bgColor: "rgba(249, 115, 22, 0.4)", emoji: "🚀" },
  { bgColor: "rgba(59, 130, 246, 0.4)", emoji: "👾" },
  { bgColor: "rgba(34, 197, 94, 0.4)", emoji: "🤖" },
  { bgColor: "rgba(255, 255, 255, 0.3)", emoji: "😎" },
  { bgColor: "rgba(234, 179, 8, 0.4)", emoji: "🛸" }
];

const MiniCube = ({ x, y, z }: { x: number, y: number, z: number, key?: string }) => {
  const faces = React.useMemo(() => ({
    front: CUBE_COLORS[Math.floor(Math.random() * 6)],
    back: CUBE_COLORS[Math.floor(Math.random() * 6)],
    right: CUBE_COLORS[Math.floor(Math.random() * 6)],
    left: CUBE_COLORS[Math.floor(Math.random() * 6)],
    top: CUBE_COLORS[Math.floor(Math.random() * 6)],
    bottom: CUBE_COLORS[Math.floor(Math.random() * 6)],
  }), []);

  return (
    <div 
      className="absolute w-[30px] h-[30px] ml-[-15px] mt-[-15px]" 
      style={{ 
        transformStyle: 'preserve-3d', 
        transform: `translate3d(${x * 32}px, ${y * 32}px, ${z * 32}px)`
      }}
    >
      <CubeFace isOuter={z === 1} bgColor={faces.front.bgColor} emoji={faces.front.emoji} transform="translateZ(15px)" />
      <CubeFace isOuter={z === -1} bgColor={faces.back.bgColor} emoji={faces.back.emoji} transform="translateZ(-15px) rotateY(180deg)" />
      <CubeFace isOuter={x === 1} bgColor={faces.right.bgColor} emoji={faces.right.emoji} transform="translateX(15px) rotateY(90deg)" />
      <CubeFace isOuter={x === -1} bgColor={faces.left.bgColor} emoji={faces.left.emoji} transform="translateX(-15px) rotateY(-90deg)" />
      <CubeFace isOuter={y === -1} bgColor={faces.top.bgColor} emoji={faces.top.emoji} transform="translateY(-15px) rotateX(90deg)" />
      <CubeFace isOuter={y === 1} bgColor={faces.bottom.bgColor} emoji={faces.bottom.emoji} transform="translateY(15px) rotateX(-90deg)" />
    </div>
  );
};

const cubeSequence = [
  { axis: 'y', index: -1, dir: 1 },
  { axis: 'x', index: -1, dir: 1 },
  { axis: 'y', index: 1, dir: -1 },
  { axis: 'x', index: 1, dir: -1 },
  { axis: 'y', index: 0, dir: 1 },
  { axis: 'x', index: 0, dir: 1 },
  { axis: 'z', index: -1, dir: 1 },
  { axis: 'z', index: 1, dir: -1 },
];

const MiniCubeAnimator = ({ x, y, z }: { x: number, y: number, z: number, key?: string }) => {
   const rotateX = [0];
   const rotateY = [0];
   const rotateZ = [0];

   let currX = 0, currY = 0, currZ = 0;

   cubeSequence.forEach(step => {
      if (step.axis === 'x' && step.index === x) currX += 360 * step.dir;
      if (step.axis === 'y' && step.index === y) currY += 360 * step.dir;
      if (step.axis === 'z' && step.index === z) currZ += 360 * step.dir;
      
      rotateX.push(currX);
      rotateY.push(currY);
      rotateZ.push(currZ);
   });

   return (
      <motion.div
         className="absolute inset-0"
         style={{ transformStyle: 'preserve-3d' }}
         animate={{ rotateX, rotateY, rotateZ }}
         transition={{
            duration: cubeSequence.length * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, ...cubeSequence.map((_, i) => (i + 1) / cubeSequence.length)]
         }}
      >
         <MiniCube x={x} y={y} z={z} />
      </motion.div>
   );
};

const RubiksCube = () => {
  return (
    <div className="flex justify-center items-center mb-24 h-[100px]" style={{ perspective: 800 }}>
      {/* Container providing a 3D view angle */}
      <div className="relative" style={{ transformStyle: 'preserve-3d', transform: 'scale(1.3) rotateX(-25deg) rotateY(-35deg)' }}>
        {/* Global slow rotation */}
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: [0, 360], rotateX: [0, 10, 0, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[-1, 0, 1].map(x => (
            [-1, 0, 1].map(y => (
              [-1, 0, 1].map(z => {
                if (x === 0 && y === 0 && z === 0) return null;
                return <MiniCubeAnimator key={`${x}-${y}-${z}`} x={x} y={y} z={z} />;
              })
            ))
          ))}
        </motion.div>
      </div>
    </div>
  );
};

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

    // Make the loading a bit longer to show off the cube
    const duration = 5000; 
    const intervalTime = 50;
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
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center font-retro text-white px-8"
      style={{
        background: 'radial-gradient(circle at 50% -20%, var(--bg-grad) 0%, var(--bg) 70%)',
        backgroundColor: 'var(--bg)'
      }}
    >
      <RubiksCube />

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
