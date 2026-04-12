import { MapPin, Mail, Phone, QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactCtaSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#214e41] border-b-8 border-[#f2ce3c]">
       <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 bg-white p-5 sm:p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-6xl mx-auto transform -translate-y-5 md:-translate-y-10">
             
             <div className="space-y-6 md:space-y-8 flex-1 text-center md:text-left">
                <div>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-[#214e41] mb-2 sm:mb-4">{t("landingPage.contact.title")}</h2>
                  <p className="text-xl text-slate-500 font-medium">{t("landingPage.contact.sub")}</p>
                </div>
                
                <div className="space-y-6 font-bold text-lg text-slate-700">
                   <div className="flex items-center gap-5 group cursor-pointer w-fit">
                     <div className="h-14 w-14 flex items-center justify-center bg-slate-50 group-hover:bg-[#f2ce3c] rounded-full transition-colors">
                       <MapPin className="h-6 w-6 text-[#214e41]"/>
                     </div>
                     <p className="group-hover:text-[#214e41] transition-colors max-w-xs">{t("landingPage.contact.address")}</p>
                   </div>
                   
                   <div className="flex items-center gap-5 group cursor-pointer w-fit">
                     <div className="h-14 w-14 flex items-center justify-center bg-slate-50 group-hover:bg-[#f2ce3c] rounded-full transition-colors">
                       <Mail className="h-6 w-6 text-[#214e41]"/>
                     </div>
                     <p className="group-hover:text-[#214e41] transition-colors">igcertchain@gmail.com</p>
                   </div>
                   
                   <div className="flex items-center gap-5 group cursor-pointer w-fit">
                     <div className="h-14 w-14 flex items-center justify-center bg-[#f2ce3c] group-hover:bg-[#214e41] rounded-full transition-colors shadow-lg shadow-[#f2ce3c]/20">
                       <Phone className="h-6 w-6 text-[#214e41] group-hover:text-[#f2ce3c] transition-colors"/>
                     </div>
                     <p className="text-2xl sm:text-3xl text-[#214e41] font-black tracking-wider">079-968-1949</p>
                   </div>
                </div>
             </div>
             
             <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center shrink-0 border-4 border-[#214e41] shadow-2xl p-4 sm:p-6 group hover:border-[#f2ce3c] transition-colors cursor-pointer mx-auto">
                <QrCode className="w-full h-full text-[#214e41] group-hover:text-[#4f9b5a] transition-colors" />
                <p className="font-bold text-[#214e41] mt-2 sm:mt-4 tracking-widest text-xs sm:text-base">{t("landingPage.contact.scan")}</p>
             </div>
             
          </div>
       </div>
    </section>
  );
}
