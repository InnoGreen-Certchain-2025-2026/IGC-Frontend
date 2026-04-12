import { MapPin, Mail, Phone, QrCode } from "lucide-react";

export default function ContactCtaSection() {
  return (
    <section className="py-24 bg-[#214e41] border-b-8 border-[#f2ce3c]">
       <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white p-12 lg:p-16 rounded-[3rem] shadow-2xl max-w-6xl mx-auto transform -translate-y-10">
             
             <div className="space-y-8 flex-1">
                <div>
                  <h2 className="text-5xl font-black uppercase text-[#214e41] mb-4">Làm việc với chúng tôi</h2>
                  <p className="text-xl text-slate-500 font-medium">Kết nối với InnoGreen CertChain ngay hôm nay.</p>
                </div>
                
                <div className="space-y-6 font-bold text-lg text-slate-700">
                   <div className="flex items-center gap-5 group cursor-pointer w-fit">
                     <div className="h-14 w-14 flex items-center justify-center bg-slate-50 group-hover:bg-[#f2ce3c] rounded-full transition-colors">
                       <MapPin className="h-6 w-6 text-[#214e41]"/>
                     </div>
                     <p className="group-hover:text-[#214e41] transition-colors max-w-xs">123/2/6 Đường số 20 Phường An Nhơn, TP. Hồ Chí Minh</p>
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
                     <p className="text-3xl text-[#214e41] font-black tracking-wider">079-968-1949</p>
                   </div>
                </div>
             </div>
             
             <div className="w-64 h-64 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center shrink-0 border-4 border-[#214e41] shadow-2xl p-6 group hover:border-[#f2ce3c] transition-colors cursor-pointer">
                <QrCode className="w-full h-full text-[#214e41] group-hover:text-[#4f9b5a] transition-colors" />
                <p className="font-bold text-[#214e41] mt-4 tracking-widest">QUÉT MÃ QR</p>
             </div>
             
          </div>
       </div>
    </section>
  );
}
