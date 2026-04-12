import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 opacity-80" />
      
      {/* Abstract Animated Mesh Background matching Landing Page */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f2ce3c] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#214e41] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Core Animation */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-8">
          
          {/* Inner pulsating glow behind logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-4 bg-[#4f9b5a] rounded-full blur-xl"
          />

          {/* Golden Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#f2ce3c]/60"
          />

          {/* Deep Green Rotating Ring (Opposite Direction) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full border-2 border-[#214e41]/10 border-t-[#214e41]/40 border-b-[#214e41]/40"
          />

          {/* Center Hexagon / Logo Base */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-white p-4 md:p-5 rounded-2xl shadow-2xl shadow-[#214e41]/10 border border-slate-100 flex items-center justify-center"
          >
            <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-[#214e41]" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Text Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-4 w-full max-w-xs"
        >
          <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-[#214e41] uppercase">
            InnoGreen <span className="text-[#f2ce3c]">Certchain</span>
          </h1>
          
          <div className="flex items-center justify-center space-x-2 text-slate-500 font-medium text-xs md:text-sm tracking-widest uppercase mb-2">
            <span>Đang thiết lập kết nối</span>
            <span className="flex space-x-1">
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#214e41] to-[#4f9b5a] rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            >
              <motion.div 
                className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-[2px]"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <div className="text-[#214e41] font-bold text-xs tracking-widest flex w-full justify-end">
            {Math.round(progress)}%
          </div>
        </motion.div>
      </div>

    </div>
  );
}
