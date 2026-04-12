import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function TargetAudienceSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
           <h2 className="text-5xl md:text-6xl font-black text-[#214e41] uppercase tracking-tight">{t("landingPage.targetAudience.title")}</h2>
           <div className="h-1.5 w-24 bg-[#f2ce3c] mx-auto mt-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="flex flex-col items-center text-center p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-[#f2ce3c] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-slate-50 hover:bg-white group"
           >
             <div className="h-40 flex items-center justify-center mb-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-500">
               <img src="/common/don-vi-dao-tao.webp" alt="Đại học" className="w-[120px] h-[120px] object-contain drop-shadow-sm" />
             </div>
             <h3 className="text-3xl font-black text-[#214e41] mb-2">{t("landingPage.targetAudience.university")}</h3>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">{t("landingPage.targetAudience.universityDesc")}</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="flex flex-col items-center text-center p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-[#f2ce3c] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-slate-50 hover:bg-white group"
           >
             <div className="h-40 flex items-center justify-center mb-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-500">
               <img src="/common/nguoi-hoc.webp" alt="Sinh viên" className="w-[120px] h-[120px] object-contain drop-shadow-sm" />
             </div>
             <h3 className="text-3xl font-black text-[#214e41] mb-2">{t("landingPage.targetAudience.student")}</h3>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">{t("landingPage.targetAudience.studentDesc")}</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="flex flex-col items-center text-center p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-[#f2ce3c] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-slate-50 hover:bg-white group"
           >
             <div className="h-40 flex items-center justify-center mb-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-500">
               <img src="/common/doanh-nghiep.webp" alt="Tổ chức" className="w-[120px] h-[120px] object-contain drop-shadow-sm" />
             </div>
             <h3 className="text-3xl font-black text-[#214e41] mb-2">{t("landingPage.targetAudience.organization")}</h3>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">{t("landingPage.targetAudience.organizationDesc")}</p>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
