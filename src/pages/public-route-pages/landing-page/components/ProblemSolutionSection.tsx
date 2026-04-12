import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProblemSolutionSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute -left-32 top-10 w-96 h-96 bg-[#f2ce3c] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -right-32 bottom-10 w-96 h-96 bg-[#214e41] opacity-10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
               <div>
                 <h2 className="text-3xl lg:text-4xl font-black text-slate-800 uppercase tracking-tight leading-tight">
                   {t("landingPage.problemSolution.problemTitle").split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                 </h2>
                 <div className="h-1.5 w-16 bg-slate-400 mt-6" />
               </div>
               
               <ul className="space-y-6">
                 {(t("landingPage.problemSolution.problemList", { returnObjects: true }) as string[]).map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-xl text-slate-600 font-bold">
                     <XCircle className="h-8 w-8 text-red-500 shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10 bg-white p-12 rounded-[3rem] shadow-2xl border-t-8 border-[#214e41] relative"
            >
               <div>
                 <h2 className="text-3xl lg:text-4xl font-black text-[#214e41] uppercase tracking-tight leading-tight">
                   {t("landingPage.problemSolution.solutionTitle").split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                 </h2>
                 <div className="h-1.5 w-16 bg-[#f2ce3c] mt-6" />
               </div>
               
               <ul className="space-y-6">
                 {(t("landingPage.problemSolution.solutionList", { returnObjects: true }) as string[]).map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-xl text-[#214e41] font-bold relative z-10">
                     <CheckCircle className="h-8 w-8 text-[#4f9b5a] shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
            </motion.div>
         </div>
      </div>
    </section>
  );
}
