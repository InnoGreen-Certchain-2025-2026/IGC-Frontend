import { motion } from "framer-motion";
import { PlusCircle, Box, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
           <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#214e41] uppercase tracking-tight">{t("landingPage.features.title")}</h2>
           <div className="h-1.5 w-16 md:w-24 bg-[#f2ce3c] mx-auto mt-4 md:mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group bg-slate-50 rounded-[2rem] md:rounded-[3rem] p-5 sm:p-6 md:p-10 hover:bg-[#214e41] transition-colors duration-500 hover:-translate-y-2 shadow-lg"
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full border-4 border-[#4f9b5a] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 bg-white group-hover:border-[#f2ce3c] transition-colors duration-300">
               <PlusCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#4f9b5a] group-hover:text-[#f2ce3c] transition-colors" />
            </div>
            <h3 className="text-3xl font-black text-[#214e41] mb-4 group-hover:text-white transition-colors">{t("landingPage.features.issue")}</h3>
            <p className="text-slate-600 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
               {t("landingPage.features.issueDesc")}
            </p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center group bg-slate-50 rounded-[2rem] md:rounded-[3rem] p-5 sm:p-6 md:p-10 hover:bg-[#214e41] transition-colors duration-500 hover:-translate-y-2 shadow-lg"
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full border-4 border-[#4f9b5a] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 bg-white group-hover:border-[#f2ce3c] transition-colors duration-300">
               <Box className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#4f9b5a] group-hover:text-[#f2ce3c] transition-colors" />
            </div>
            <h3 className="text-3xl font-black text-[#214e41] mb-4 group-hover:text-white transition-colors">{t("landingPage.features.store")}</h3>
            <p className="text-slate-600 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
               {t("landingPage.features.storeDesc")}
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center group bg-slate-50 rounded-[2rem] md:rounded-[3rem] p-5 sm:p-6 md:p-10 hover:bg-[#214e41] transition-colors duration-500 hover:-translate-y-2 shadow-lg"
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full border-4 border-[#4f9b5a] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 bg-white group-hover:border-[#f2ce3c] transition-colors duration-300">
               <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#4f9b5a] group-hover:text-[#f2ce3c] transition-colors" />
            </div>
            <h3 className="text-3xl font-black text-[#214e41] mb-4 group-hover:text-white transition-colors">{t("landingPage.features.verify")}</h3>
            <p className="text-slate-600 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
               {t("landingPage.features.verifyDesc")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
