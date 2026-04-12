import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full pt-32 pb-48 overflow-hidden bg-[#214e41] text-white">
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: 'url("/common/homepage-hero-bg.png")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      />

      {/* Diagonal cut at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[150px]">
          <path d="M0,0 L1200,120 L0,120 Z" fill="#f2ce3c"></path>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-1/2">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[100px]">
          <path d="M0,120 L1200,0 L0,120 Z" fill="#ffffff"></path>
        </svg>
      </div>

      {/* Hexagon/Cube Logo Watermark */}
      <div className="absolute top-20 right-10 opacity-5 blur-[2px]">
         <img src="/logo/logo_icon.png" alt="" className="w-96 h-96 object-contain grayscale" />
      </div>

      <div className="container relative z-20 mx-auto px-4 mt-12 md:mt-24">
        <div className="flex flex-col items-center text-center gap-10">
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-6 md:mb-8 bg-[#183930]/50 backdrop-blur-sm border border-[#336b59] rounded-full px-4 sm:px-5 py-1.5 sm:py-2 shadow-sm max-w-full overflow-hidden">
              <span className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shrink-0">
                 <img src="/logo/logo_icon.png" alt="InnoGreen Icon" className="h-full w-full object-contain" />
              </span>
              <span className="text-xs sm:text-sm md:text-md font-bold tracking-widest sm:tracking-[0.2em] text-white uppercase truncate">
                INNOGREEN CERTCHAIN
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black leading-tight uppercase tracking-tight text-white wrap-break-word">
              {t("landingPage.hero.verify")} <span className="text-[#f2ce3c]">{t("landingPage.hero.trust")}</span><br />
              {t("landingPage.hero.create")} <span className="text-[#f2ce3c]">{t("landingPage.hero.value")}</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-2xl mt-8"
          >
            <div className="relative flex items-center p-1 md:p-2.5 pl-3 md:pl-8 bg-white border-2 md:border-4 border-[#183930] rounded-full shadow-2xl transition-all duration-500 h-12 sm:h-14 md:h-20 hover:border-[#4f9b5a]">
              <Search className="h-4 w-4 md:h-6 md:w-6 text-[#214e41] shrink-0 font-bold hidden sm:block" />
              <Input 
                type="text" 
                placeholder={t("landingPage.hero.placeholder")}
                className="grow bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-900 px-2 sm:px-3 md:px-6 text-xs sm:text-sm md:text-lg placeholder:text-slate-400 h-full font-medium w-full min-w-0"
              />
              <Button className="bg-[#214e41] hover:bg-[#183930] text-[#f2ce3c] rounded-full h-full px-4 sm:px-6 md:px-10 text-xs sm:text-sm md:text-lg font-bold transition-all shrink-0 hover:scale-[1.02]">
                {t("landingPage.hero.search")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
