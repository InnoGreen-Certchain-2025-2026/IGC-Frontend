import { motion } from "framer-motion";
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
                 <img src="/logo/logo_icon.png" alt="CertChain Icon" className="h-full w-full object-contain" />
              </span>
              <span className="text-xs sm:text-sm md:text-md font-bold tracking-widest sm:tracking-[0.2em] text-white uppercase truncate">
                CERTCHAIN
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black leading-tight uppercase tracking-tight text-white wrap-break-word">
              {t("landingPage.hero.verify")} <span className="text-[#f2ce3c]">{t("landingPage.hero.trust")}</span><br />
              {t("landingPage.hero.create")} <span className="text-[#f2ce3c]">{t("landingPage.hero.value")}</span>
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
