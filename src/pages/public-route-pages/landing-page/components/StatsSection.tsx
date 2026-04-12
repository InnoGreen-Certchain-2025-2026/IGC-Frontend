import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ from, to, duration = 2, suffix = "", prefix = "" }: { from: number, to: number, duration?: number, suffix?: string, prefix?: string }) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(v) {
          setValue(Math.round(v));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration]);

  return <span ref={nodeRef}>{prefix}{value}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="bg-white py-12 relative z-20 md:-mt-24">
      <div className="container mx-auto px-4">
        <motion.div 
           initial={{ y: 40, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="bg-[#214e41] rounded-[2rem] shadow-2xl p-10 flex flex-col md:flex-row justify-between items-center text-white border-b-8 border-[#f2ce3c]"
        >
           <div className="text-center flex-1 px-4 border-b md:border-b-0 md:border-r border-[#336b59] last:border-0 min-w-[200px] py-6 md:py-0 w-full">
              <h3 className="text-5xl lg:text-6xl font-black text-white mb-2">
                 <AnimatedNumber from={1900} to={2025} duration={2.5} />
              </h3>
              <p className="text-[#f2ce3c] font-bold text-lg uppercase tracking-wider">Thành lập</p>
           </div>
           <div className="text-center flex-1 px-4 border-b md:border-b-0 md:border-r border-[#336b59] last:border-0 min-w-[200px] py-6 md:py-0 w-full">
              <h3 className="text-5xl lg:text-6xl font-black text-white mb-2">
                 <AnimatedNumber from={0} to={24} duration={2} suffix="/7" />
              </h3>
              <p className="text-[#f2ce3c] font-bold text-lg uppercase tracking-wider">Hỗ trợ</p>
           </div>
           <div className="text-center flex-1 px-4 min-w-[200px] py-6 md:py-0 w-full">
              <h3 className="text-5xl lg:text-6xl font-black text-white mb-2">
                 <AnimatedNumber from={2000} to={300} duration={2} suffix=" MS" />
              </h3>
              <p className="text-[#f2ce3c] font-bold text-lg uppercase tracking-wider">Thời gian phản hồi</p>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
