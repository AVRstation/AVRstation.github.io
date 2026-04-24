import React from 'react';
import { motion } from 'motion/react';

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
      <div className="absolute inset-0" style={{ transform: `translateZ(${d/2}px)`, backgroundColor: fc, border: '1px solid rgba(0,0,0,0.15)' }} />
      {/* Back */}
      <div className="absolute inset-0" style={{ transform: `rotateY(180deg) translateZ(${d/2}px)`, backgroundColor: c, border: '1px solid rgba(0,0,0,0.15)' }} />
      {/* Right */}
      <div className="absolute" style={{ width: d, height: h, transform: `rotateY(90deg) translateZ(${w/2}px)`, left: w/2 - d/2, backgroundColor: lc, border: '1px solid rgba(0,0,0,0.15)' }} />
      {/* Left */}
      <div className="absolute" style={{ width: d, height: h, transform: `rotateY(-90deg) translateZ(${w/2}px)`, left: w/2 - d/2, backgroundColor: lc, border: '1px solid rgba(0,0,0,0.15)' }} />
      {/* Top */}
      <div className="absolute" style={{ width: w, height: d, transform: `rotateX(90deg) translateZ(${h/2}px)`, top: h/2 - d/2, backgroundColor: tc, border: '1px solid rgba(0,0,0,0.15)' }} />
      {/* Bottom */}
      <div className="absolute" style={{ width: w, height: d, transform: `rotateX(-90deg) translateZ(${h/2}px)`, top: h/2 - d/2, backgroundColor: c, border: '1px solid rgba(0,0,0,0.15)' }} />
    </div>
  );
};

const VBlock = ({ w, h, d, y, color, topColor, leftColor }: any) => (
  <Block w={w} h={h} d={d} x={-w/2} y={y} z={-d/2} color={color} topColor={topColor} leftColor={leftColor} />
);

const UFO_LAYERS = [
  { y: -18, r: 2, c: '#475569', t: '#64748b', l: '#334155' },
  { y: -12, r: 4, c: 'rgba(74, 222, 128, 0.8)', t: 'rgba(134, 239, 172, 0.9)', l: 'rgba(74, 222, 128, 0.6)' },
  { y: -6,  r: 7, c: '#94a3b8', t: '#cbd5e1', l: '#64748b' },
  { y: 0,   r: 8, c: '#cbd5e1', t: '#f1f5f9', l: '#94a3b8', lights: true },
  { y: 6,   r: 7, c: '#94a3b8', t: '#cbd5e1', l: '#64748b' },
  { y: 12,  r: 4, c: '#475569', t: '#64748b', l: '#334155' },
  { y: 18,  r: 2, c: '#38bdf8', t: '#7dd3fc', l: '#0ea5e9' }
];

const VoxelUFO = React.memo(() => {
    const size = 6;
    const strips: any[] = [];

    UFO_LAYERS.forEach((layer, layerIdx) => {
        const R = layer.r;
        for (let z = -R; z <= R; z++) {
            const maxX = Math.floor(Math.sqrt(R * R - z * z));
            if (maxX >= 0) {
                const widthVoxels = maxX * 2 + 1;
                const width = widthVoxels * size;
                const xPos = -width / 2;
                const zPos = z * size;
                
                strips.push(
                    <Block 
                        key={`strip-${layerIdx}-${z}`}
                        w={width} h={size} d={size} 
                        x={xPos} y={layer.y} z={zPos} 
                        color={layer.c} topColor={layer.t} leftColor={layer.l} 
                    />
                );
            }
        }
        
        if (layer.lights) {
            const numLights = 12;
            for (let i = 0; i < numLights; i++) {
                const angle = (Math.PI * 2 * i) / numLights;
                const lx = Math.cos(angle) * (R + 0.2);
                const lz = Math.sin(angle) * (R + 0.2);
                const isRed = i % 2 === 0;
                
                strips.push(
                    <Block 
                        key={`light-${layerIdx}-${i}`}
                        w={size} h={size} d={size} 
                        x={lx * size - size/2} y={layer.y} z={lz * size} 
                        color={isRed ? '#ef4444' : '#3b82f6'} 
                        topColor={isRed ? '#f87171' : '#60a5fa'} 
                        leftColor={isRed ? '#dc2626' : '#2563eb'} 
                    />
                );
            }
        }
    });

    return <React.Fragment>{strips}</React.Fragment>;
});

VoxelUFO.displayName = 'VoxelUFO';

export const CowAbduction = () => {
    // Decouple Cow and UFO animations so we can just use simple time steps
    
    // Ensure numeric interpolation to prevent Framer Motion from snapping/teleporting
    // We use a React state or constant so that it doesn't change during render
    const vw = React.useMemo(() => typeof window !== 'undefined' ? window.innerWidth + 300 : 2000, []);

    // Cow sequences
    // 0 -> 0.25 (0-3s): Walk in
    // 0.25 -> 0.6 (3s-7.2s): Wait
    // 0.6 -> 0.75 (7.2s-9s): Abducted up
    // 0.75 -> 0.8 (9s-9.6s): Inside UFO wait
    // 0.8 -> 1 (9.6s-12s): Fly away in UFO
    const cowX = [-200, 100, 100, 100, 100, -vw];
    const cowY = [0, 0, 0, -290, -290, -400];
    const cowScale = [2, 2, 2, 2, 0, 0];
    const cowTimes = [0, 0.25, 0.6, 0.75, 0.8, 1];

    const cowRotateX = [-20, -20, -20, 360, 360, 360];
    const cowRotateY = [30, 30, 30, 720, 720, 720];

    const legRotate1 = [0, 30, -30, 30, -30, 30, 0, 0];
    const legRotate2 = [0, -30, 30, -30, 30, -30, 0, 0];
    const legTimes = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.26, 1];

    const headRotate = [0, 10, 0, 10, 0, 10, 0, 70, 60, 70, 0, 70, 60, 70, 0, -30, -30];
    const headTimes =  [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.26, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.58, 0.6, 0.65, 1];

    // UFO sequences
    // 0 -> 0.35 (0-4.2s): Wait offscreen, close to viewer
    // 0.35 -> 0.45 (4.2s-5.4s): Dive deep into screen
    // 0.45 -> 0.5 (5.4s-6s): Swoop up to cow
    // 0.5 -> 0.8 (6s-9.6s): Hover and abduct
    // 0.8 -> 1 (9.6s-12s): Fly away
    const ufoX = [vw, vw, vw/2, 130, 130, -vw];
    const ufoY = [-200, -200, -400, -280, -280, -500];
    const ufoZ = [400, 400, -800, 0, 0, -400];
    const ufoTimes = [0, 0.35, 0.45, 0.5, 0.8, 1];

    // Beam sequences
    // 0.5 -> 0.55: Beam extends downward
    // 0.55 -> 0.75: Beam holds cow
    // 0.75 -> 0.8: Beam retracts right as pickup finishes
    const beamOpacity = [0, 0, 1, 1, 0, 0];
    const beamScaleY = [0, 0, 1, 1, 0, 0];
    const beamTimes = [0, 0.5, 0.55, 0.75, 0.8, 1];

    // Initial UFO state matches the start of the sequence to avoid jumps
    const initialUfoX = vw;
    const initialUfoY = -200;
    const initialUfoZ = 400;

    return (
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" style={{ perspective: 800 }}>
        {/* Cow */}
        <motion.div
           className="absolute bottom-20 left-0"
           initial={{ x: -200, y: 0 }}
           animate={{ x: cowX, y: cowY }}
           transition={{ duration: 12, times: cowTimes, ease: "easeInOut" }}
        >
            <motion.div 
               style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
               animate={{ 
                   rotateX: cowRotateX, 
                   rotateY: cowRotateY,
                   scale: cowScale
               }}
               transition={{ duration: 12, times: cowTimes, ease: "easeInOut" }}
            >
                {/* Body */}
                <Block w={30} h={20} d={15} x={0} y={0} z={0} color="#f8fafc" topColor="#e2e8f0" leftColor="#e2e8f0" />
                {/* Cow spots: just use some smaller blocks */}
                <Block w={10} h={10} d={16} x={10} y={5} z={-0.5} color="#0f172a" topColor="#1e293b" leftColor="#1e293b" />
                <Block w={5} h={8} d={16} x={2} y={12} z={-0.5} color="#0f172a" topColor="#1e293b" leftColor="#1e293b" />
                
                {/* Head */}
                <motion.div
                   className="absolute"
                   style={{ transformStyle: 'preserve-3d', width: 12, height: 12, x: 25, y: -8, z: 0, transformOrigin: '0% 100%' }}
                   animate={{ rotateZ: headRotate }}
                   transition={{ duration: 12, times: headTimes, ease: "easeInOut" }}
                >
                    <Block w={12} h={12} d={12} x={0} y={0} z={0} color="#f8fafc" topColor="#e2e8f0" leftColor="#e2e8f0" />
                    {/* Snout */}
                    <Block w={4} h={6} d={10} x={12} y={6} z={1} color="#f472b6" topColor="#fbcfe8" leftColor="#fbcfe8" />
                    {/* Eyes */}
                    <Block w={2} h={2} d={14} x={5} y={4} z={-1} color="#000000" />
                </motion.div>
                
                {/* Legs */}
                <motion.div className="absolute" style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 0%', x: 2, y: 20, z: 5 }} animate={{ rotateZ: legRotate1 }} transition={{ duration: 12, times: legTimes }}>
                   <Block w={4} h={10} d={4} x={0} y={0} z={0} color="#e2e8f0" />
                </motion.div>
                <motion.div className="absolute" style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 0%', x: 22, y: 20, z: 5 }} animate={{ rotateZ: legRotate2 }} transition={{ duration: 12, times: legTimes }}>
                   <Block w={4} h={10} d={4} x={0} y={0} z={0} color="#e2e8f0" />
                </motion.div>
                <motion.div className="absolute" style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 0%', x: 2, y: 20, z: -5 }} animate={{ rotateZ: legRotate2 }} transition={{ duration: 12, times: legTimes }}>
                   <Block w={4} h={10} d={4} x={0} y={0} z={0} color="#cbd5e1" />
                </motion.div>
                <motion.div className="absolute" style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 0%', x: 22, y: 20, z: -5 }} animate={{ rotateZ: legRotate1 }} transition={{ duration: 12, times: legTimes }}>
                   <Block w={4} h={10} d={4} x={0} y={0} z={0} color="#cbd5e1" />
                </motion.div>
            </motion.div>
        </motion.div>

        {/* UFO */}
        <motion.div
           className="absolute bottom-20 left-0"
           initial={{ x: initialUfoX, y: initialUfoY, z: initialUfoZ, opacity: 1 }}
           animate={{ x: ufoX, y: ufoY, z: ufoZ }}
           transition={{ duration: 12, times: ufoTimes, ease: "easeInOut" }}
        >
            <motion.div 
               style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-15deg) scale(3)' }}
            >
                <motion.div
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: [0, -720] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                    <VoxelUFO />
                </motion.div>
                
                {/* Light Beam */}
                <motion.div 
                   className="absolute origin-top"
                   initial={{ opacity: 0, scaleY: 0, rotateX: 15 }}
                   animate={{ opacity: beamOpacity, scaleY: beamScaleY, rotateX: 15 }}
                   transition={{ duration: 12, times: beamTimes }}
                   style={{
                       width: 40,
                       height: 300,
                       top: 12,
                       left: -20,
                       background: 'linear-gradient(to bottom, rgba(250, 204, 21, 0.8), rgba(250, 204, 21, 0))',
                       willChange: 'transform, opacity'
                   }}
                />
            </motion.div>
        </motion.div>
      </div>
    );
};

