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
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#061410] overflow-hidden text-emerald-50">
      {/* ================= BACKGROUND GLOWS & GRID ================= */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTM5LjUgMzkuNVYwTTM5LjUgMzkuNUgwIiBzdHJva2U9InJnYmEoMTYsIDE4NSLCAxMjksIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=')] opacity-30 mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* ================= MAIN ANIMATION CONTAINER ================= */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-56 h-56 flex items-center justify-center mb-12">
          
          {/* Layer 1: Outer glowing rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-emerald-400/40"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2.5, delay: 1.25, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-green-300/20"
          />

          {/* Layer 2: Rotating Dashed Border (Data processing) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-transparent stroke-emerald-500/50" strokeWidth="1" strokeDasharray="4 8">
              <circle cx="50" cy="50" r="48" />
            </svg>
          </motion.div>

          {/* Layer 3: Rotating Blockchain Hexagon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 text-emerald-950/60"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current stroke-emerald-800" strokeWidth="1">
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
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-[#0a1f18] border border-emerald-400/80 rounded-lg p-2 shadow-[0_0_15px_rgba(52,211,153,0.6)] backdrop-blur-sm z-20">
                {i === 0 ? <Box size={14} className="text-emerald-300" /> : 
                 i === 1 ? <GraduationCap size={14} className="text-green-300" /> : 
                           <Cpu size={14} className="text-teal-300" />}
              </div>
            </motion.div>
          ))}

          {/* Layer 5: Central Morphing Emblem (Certificate <-> Leaf) */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-[#061410]/90 p-6 rounded-2xl border border-emerald-400/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-xl"
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              {/* Certificate/Shield Icon */}
              <motion.div
                animate={{ opacity: [1, 0, 0, 1], scale: [1, 0.8, 0.8, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              >
                <ShieldCheck size={48} strokeWidth={1.2} />
              </motion.div>
              
              {/* Eco/Green Leaf Icon */}
              <motion.div
                animate={{ opacity: [0, 1, 0, 0], scale: [0.8, 1, 0.8, 0.8], rotate: [10, 0, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute inset-0 flex items-center justify-center text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]"
              >
                <Leaf size={46} strokeWidth={1.2} />
              </motion.div>

              {/* Education Book Icon */}
              <motion.div
                animate={{ opacity: [0, 0, 1, 0], scale: [0.8, 0.8, 1, 0.8], rotate: [-10, 10, 0, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                className="absolute inset-0 flex items-center justify-center text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]"
              >
                <BookOpen size={44} strokeWidth={1.2} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ================= TEXT & PROGRESS ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-green-400 to-teal-300 uppercase leading-snug font-mono z-10 drop-shadow-sm text-center">
            InnoGreen Certchain
          </h1>
          <h2 className="text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] text-emerald-500/90 uppercase font-mono mt-3 mb-6 flex items-center gap-2 sm:gap-3 font-semibold text-center leading-relaxed">
            <span className="hidden sm:inline-block w-8 h-[1px] bg-emerald-500/40"></span>
            Ươm Mầm Tri Thức <Sparkles size={14} className="text-yellow-300 mx-1 mb-1 animate-pulse"/> Tương Lai Kiến Tạo
            <span className="hidden sm:inline-block w-8 h-[1px] bg-emerald-500/40"></span>
          </h2>
          
          <div className="flex items-center space-x-3 text-emerald-400/90 font-mono text-sm tracking-wider mt-2">
            <span className="flex items-center gap-2">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Orbit size={16} className="text-emerald-500" />
              </motion.div>
              Đang mã hoá dải băng tương lai
            </span>
            <span className="flex space-x-1 w-6">
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
            </span>
          </div>

          {/* Futuristic Progress Bar */}
          <div className="mt-8 relative w-72 h-1.5 bg-emerald-950/80 rounded-full overflow-hidden shadow-inner border border-emerald-900/50">
            {/* Shimmer line */}
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-200"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Grid overlay for tech feel */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGxpbmUgeDE9IjQiIHkxPSIwIiB4Mj0iMCIgeTI9IjQiIHN0cm9rZT0icmdiYSgwLCAwLCAwLCAwLjQpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 z-10" />
            
            {/* Glowing tip */}
            <motion.div
              className="absolute top-0 bottom-0 w-8 bg-white blur-[4px] z-20"
              initial={{ left: "-10%" }}
              animate={{ left: "110%" }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
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
              backgroundColor: p.isGreen ? '#34d399' : '#10b981',
              opacity: p.opacityInit,
              boxShadow: '0 0 8px rgba(52,211,153,0.8)'
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
            key={`block-${i}`}
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
    </div>
  );
}
