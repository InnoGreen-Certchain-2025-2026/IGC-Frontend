import { motion } from "framer-motion";
import { Globe, Quote, Target, Network } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StorySection() {
  const { t } = useTranslation();

  return (
    <>
      {/* DIAGONAL SPLIT SECTION (Sứ mệnh & Về dự án) */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-slate-50 min-h-[500px] md:min-h-[600px] flex items-center">
         {/* Geometric Background Shapes mimicking Brochure Layout */}
         <div className="absolute top-0 right-0 w-full md:w-[60%] h-full bg-[#f2ce3c] opacity-20 md:opacity-100" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
         <div className="absolute top-0 left-0 w-full md:w-[55%] h-[110%] bg-[#214e41]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'translateY(-5%)' }}></div>
         
         <div className="container relative z-10 mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
             
             {/* Sứ Mệnh */}
             <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="text-white space-y-6 md:space-y-8 md:pr-16"
             >
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#f2ce3c]">{t("landingPage.story.missionTitle")}</h2>
               <p className="text-lg sm:text-xl leading-relaxed text-slate-200 font-medium text-left sm:text-justify">
                 {t("landingPage.story.missionDesc")}
               </p>
               <div className="pt-4 flex items-center gap-4 text-[#f2ce3c] hover:text-white transition-colors cursor-pointer w-max">
                  <Globe className="h-8 w-8" />
                  <span className="text-xl font-bold tracking-wider">www.igcert.click</span>
               </div>
             </motion.div>

             {/* Về dự án */}
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] shadow-2xl ml-0 md:ml-12 relative overflow-hidden"
             >
               {/* Decorative Corner */}
               <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-[#214e41]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
               
               <h2 className="text-3xl md:text-4xl font-black uppercase text-[#214e41] mb-4 md:mb-6 relative z-10">{t("landingPage.story.aboutTitle")}</h2>
               <div className="w-16 h-1 bg-[#4f9b5a] mb-6 md:mb-8" />
               <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium text-left sm:text-justify relative z-10">
                 {t("landingPage.story.aboutDesc")}
               </p>
             </motion.div>
             
           </div>
         </div>
      </section>

      {/* CÂU CHUYỆN TRUYỀN CẢM HỨNG */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Subtle logo background */}
        <Network className="absolute -left-20 -top-20 w-64 h-64 md:w-96 md:h-96 text-slate-50 rotate-12" />
        
        <div className="container mx-auto px-4 relative z-10">
           <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-1 space-y-6 md:space-y-8"
              >
                 <div className="inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center bg-[#f2ce3c] rounded-xl mb-2 md:mb-4 text-[#214e41]">
                   <Quote className="h-6 w-6 md:h-8 md:w-8 fill-current" />
                 </div>
                 <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#214e41] leading-tight">
                    {t("landingPage.story.storyTitle").split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                 </h2>
                 <div className="w-24 h-2 bg-[#f2ce3c]" />
                 <p className="text-xl text-slate-600 leading-relaxed text-justify font-medium pt-4">
                    {t("landingPage.story.storyDesc")}
                 </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 w-full relative"
              >
                 {/* Diagonal Accent Background */}
                 <div className="absolute inset-0 bg-[#f2ce3c] transform -rotate-3 rounded-[3rem]"></div>
                 
                 <div className="relative bg-[#214e41] p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden min-h-[350px] md:min-h-[450px] flex flex-col justify-center items-center text-center transform hover:-translate-y-2 transition-transform duration-500">
                   <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-br-[6rem]" />
                   <div className="absolute bottom-0 right-0 w-40 h-40 md:w-48 md:h-48 bg-[#f2ce3c]/10 rounded-tl-[6rem]" />
                   
                   <div className="relative z-10">
                     <Target className="h-12 w-12 md:h-20 md:w-20 text-[#f2ce3c] mx-auto mb-6 md:mb-10" />
                     <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                       {t("landingPage.story.bannerSystem")} <br/>
                       <span className="text-[#f2ce3c]">{t("landingPage.story.bannerHighlight")}</span> <br/>
                       {t("landingPage.story.bannerSub").split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                     </h3>
                     <div className="mt-8 md:mt-12 inline-block px-4 sm:px-6 md:px-8 py-2 md:py-3 border-2 border-[#f2ce3c] text-[#f2ce3c] font-bold text-sm sm:text-lg md:text-xl tracking-[0.1em] sm:tracking-[0.2em] uppercase rounded-full hover:bg-[#f2ce3c] hover:text-[#214e41] transition-colors cursor-pointer w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                        WWW.IGCERT.CLICK
                     </div>
                   </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>
    </>
  );
}
