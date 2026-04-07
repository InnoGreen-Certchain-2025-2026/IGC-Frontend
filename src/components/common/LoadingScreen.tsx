import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Box, Cpu, GraduationCap, Sparkles, Orbit, BookOpen } from "lucide-react";

// Generate random particles once when module loads
const PARTICLES = [...Array(25)].map(() => ({
  width: Math.random() * 3 + 1,
  height: Math.random() * 3 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  isGreen: Math.random() > 0.5,
  opacityInit: Math.random() * 0.4 + 0.1,
  yDest: -Math.random() * 100 - 50,
  xDest: Math.random() * 40 - 20,
  opacityMid: Math.random() * 0.5 + 0.4,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 5,
}));

const BLOCKS = [...Array(8)].map(() => ({
  width: Math.random() * 15 + 10,
  height: Math.random() * 15 + 10,
  left: Math.random() * 100,
  rotate: Math.random() * 360,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 8,
}));



export default function LoadingScreen() {

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden text-emerald-950 bg-sky-50">
      
      {/* ================= 1. BẦU TRỜI & MẶT TRỜI (SKY & SUN) ================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 opacity-100" />
      
      <motion.div 
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20vh] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-t from-yellow-200 to-orange-400 rounded-full opacity-90 blur-[1px] shadow-[0_0_150px_rgba(250,204,21,0.8)] z-0"
      />

      {/* ================= 2. DÃY NÚI (MOUNTAINS) ================= */}
      <div className="absolute bottom-[15vh] left-0 w-full h-[35vh] z-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute bottom-0 w-[200vw] h-full fill-[#1c1833] opacity-80">
          <path d="M0,100 L0,50 Q100,20 250,55 T500,45 T750,65 T1000,35 L1000,100 Z" />
        </svg>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute bottom-0 w-[200vw] h-[70%] fill-emerald-500/40">
          <path d="M0,100 L0,70 Q150,40 300,60 T600,50 T850,70 T1000,50 L1000,100 Z" />
        </svg>
      </div>

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTM5LjUgMzkuNVYwTTM5LjUgMzkuNUgwIiBzdHJva2U9InJnYmEoNCwgNDcsIDI2LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+')] opacity-60 mask-image:radial-gradient(ellipse_at_center,black,transparent)] z-0" />

      {/* ================= MAIN ANIMATION CONTAINER ================= */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-56 h-56 flex items-center justify-center mb-12">
          
          {/* Layer 1: Outer glowing rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-emerald-600/40"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2.5, delay: 1.25, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-teal-500/30"
          />

          {/* Layer 2: Rotating Dashed Border (Data processing) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-transparent stroke-emerald-700/60" strokeWidth="1" strokeDasharray="4 8">
              <circle cx="50" cy="50" r="48" />
            </svg>
          </motion.div>

          {/* Layer 3: Rotating Blockchain Hexagon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 text-emerald-100/80"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current stroke-emerald-600" strokeWidth="1">
              <polygon points="50 3 93 28 93 72 50 97 7 72 7 28" />
            </svg>
          </motion.div>

          {/* Layer 4: Orbiting Blockchain Nodes */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-full -ml-[50%] -mt-[50%]"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: i * (6/3) }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-white/90 border border-emerald-400/80 rounded-lg p-2 shadow-[0_0_15px_rgba(52,211,153,0.3)] backdrop-blur-sm z-20">
                {i === 0 ? <Box size={14} className="text-emerald-600" /> : 
                 i === 1 ? <GraduationCap size={14} className="text-teal-600" /> : 
                           <Cpu size={14} className="text-green-600" />}
              </div>
            </motion.div>
          ))}

          {/* Layer 5: Central Morphing Emblem (Certificate <-> Leaf) */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-white/70 p-6 rounded-2xl border border-emerald-300/50 shadow-[0_10px_40px_rgba(16,185,129,0.3)] backdrop-blur-xl"
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              {/* Certificate/Shield Icon */}
              <motion.div
                animate={{ opacity: [1, 0, 0, 1], scale: [1, 0.8, 0.8, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center text-emerald-600"
              >
                <ShieldCheck size={48} strokeWidth={1.5} />
              </motion.div>
              
              {/* Eco/Green Leaf Icon */}
              <motion.div
                animate={{ opacity: [0, 1, 0, 0], scale: [0.8, 1, 0.8, 0.8], rotate: [10, 0, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute inset-0 flex items-center justify-center text-green-600"
              >
                <Leaf size={46} strokeWidth={1.5} />
              </motion.div>

              {/* Education Book Icon */}
              <motion.div
                animate={{ opacity: [0, 0, 1, 0], scale: [0.8, 0.8, 1, 0.8], rotate: [-10, 10, 0, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                className="absolute inset-0 flex items-center justify-center text-teal-600"
              >
                <BookOpen size={44} strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ================= TEXT ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center bg-black/15 backdrop-blur-md px-10 py-6 rounded-3xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative z-20"
        >
          <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-white uppercase leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-center">
            InnoGreen Certchain
          </h1>
          <h2 className="text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] text-emerald-50 uppercase font-mono mt-3 mb-6 flex items-center gap-2 sm:gap-3 font-semibold text-center leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
            <span className="hidden sm:inline-block w-8 h-[1px] bg-white/40"></span>
            Ươm Mầm Tri Thức <Sparkles size={14} className="text-yellow-300 mx-1 mb-1 animate-pulse"/> Tương Lai Kiến Tạo
            <span className="hidden sm:inline-block w-8 h-[1px] bg-white/40"></span>
          </h2>
          
          <div className="flex items-center space-x-3 text-emerald-100 font-mono text-sm tracking-wider mt-2 font-medium drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
            <span className="flex items-center gap-2">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Orbit size={16} className="text-white" />
              </motion.div>
              Đang mã hoá dải băng tương lai
            </span>
            <span className="flex space-x-1 w-6">
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
            </span>
          </div>

        </motion.div>
      </div>

      {/* ================= FLOATING BLOCKCHAIN/LEAF PARTICLES ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.width + 'px',
              height: p.height + 'px',
              left: p.left + '%',
              top: p.top + '%',
              backgroundColor: p.isGreen ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.4)',
              opacity: p.opacityInit,
              boxShadow: '0 0 8px rgba(52,211,153,0.3)'
            }}
            animate={{
              y: [0, p.yDest],
              x: [0, p.xDest],
              opacity: [0, p.opacityMid, 0],
              scale: [0.8, 1.5, 0.5]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}

        {/* Few falling green blocks/rects to simulate data blocks */}
        {BLOCKS.map((b, i) => (
          <motion.div
            key={"block-" + i}
            className="absolute rounded-[1px] border border-emerald-500/30 bg-emerald-900/20"
            style={{
              width: b.width + 'px',
              height: b.height + 'px',
              left: b.left + '%',
              top: '-5%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotate: b.rotate,
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              ease: "linear",
              delay: b.delay,
            }}
          />
        ))}
      </div>



      {/* ================= 4. DÒNG SÔNG (RIVER) ================= */}
      <div className="absolute bottom-0 left-0 w-full h-[12vh] bg-gradient-to-b from-sky-400 via-teal-300 to-cyan-600 z-0 border-t border-sky-300/40">
        <motion.div 
           animate={{ x: ["0%", "-50%"] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-1 w-[200%] h-[2px] opacity-40 mix-blend-overlay"
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 80px)' }}
        />
        <motion.div 
           animate={{ x: ["-50%", "0%"] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute top-4 w-[200%] h-[1px] opacity-20 mix-blend-overlay"
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,1) 60px, rgba(255,255,255,1) 120px)' }}
        />
      </div>

    </div>
  );
}
