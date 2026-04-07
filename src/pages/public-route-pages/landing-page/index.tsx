import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Globe, Users, GraduationCap, Building2, Target, Network } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary-500 selection:text-white mesh-bg">
      <Header />
      
      <main className="grow">
        {/* Hero Section - Airy & Editorial */}
        <section className="relative w-full pt-48 pb-32 overflow-hidden px-4">
          <div className="container relative z-10 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              
              <div className="flex-1 space-y-12">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center space-x-3 bg-white border border-slate-100 rounded-full px-5 py-2 shadow-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] font-display">
                    Niềm tin trên Blockchain
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-6xl md:text-8xl font-black text-slate-900 leading-none tracking-tight"
                >
                  Xác minh <span className="text-gradient-trust">niềm tin</span> <br />
                  Kiến tạo giá trị thực
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed font-medium"
                >
                  Hệ sinh thái chứng thực số minh bạch trên Blockchain, bảo vệ tài sản tri thức và kết nối nhân tài toàn cầu.
                </motion.p>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="pt-2"
                >
                  <div className="relative w-full max-w-2xl group">
                    <div className="absolute -inset-1 bg-linear-to-r from-primary-500 to-accent-500 rounded-full blur opacity-20 group-focus-within:opacity-40 transition duration-700"></div>
                    <div className="relative flex items-center p-2.5 pl-8 bg-white border border-slate-100 rounded-full shadow-2xl transition-all duration-500 h-20">
                      <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" />
                      <Input 
                        type="text" 
                        placeholder="Nhập mã chứng chỉ để xác thực ngay..." 
                        className="grow bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-900 px-6 text-lg placeholder:text-slate-400 h-full font-medium"
                      />
                      <Button className="bg-slate-950 hover:bg-black text-white rounded-full h-full px-12 text-lg font-bold transition-all hover:scale-[1.02] active:scale-95 shrink-0 shadow-lg">
                        Tra cứu
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="flex-1 relative hidden lg:block"
              >
                <div className="absolute -inset-40 bg-primary-500/10 blur-[140px] rounded-full animate-pulse" />
                <div className="relative p-6 bg-slate-950 rounded-[4rem] rotate-3 hover:-translate-y-2.5 hover:rotate-0 transition-all duration-700 aspect-square max-w-md mx-auto overflow-hidden group shadow-2xl shadow-primary-900/20">
                   <div className="absolute inset-0 bg-linear-to-br from-primary-600/10 via-transparent to-accent-500/10" />
                   <img 
                    src="/homepage-hero-bg.png" 
                    alt="Xem trước bản đồ nền tảng" 
                    className="relative z-10 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute bottom-10 left-10 right-10 z-20">
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                         <div className="h-10 w-10 bg-accent-500 rounded-xl flex items-center justify-center">
                            <Network className="h-5 w-5 text-white" />
                         </div>
                         <div className="text-white font-bold text-sm">Mạng lưới xác minh toàn cầu</div>
                      </div>
                   </div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* Section: Giới thiệu - Clean Grid */}
        <section id="about" className="py-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Tầm Nhìn",
                  icon: <Globe className="h-6 w-6" />,
                  desc: "Trở thành nền tảng số hóa tiên phong, kiến tạo niềm tin tuyệt đối cho hồ sơ năng lực số toàn cầu.",
                  color: "bg-primary-50 text-primary-600"
                },
                {
                  title: "Sứ Mệnh",
                  icon: <Target className="h-6 w-6" />,
                  desc: "Số hóa triệt để quy trình cấp phát bằng cấp, xóa bỏ hoàn toàn gian lận bằng cấp giả.",
                  color: "bg-accent-50 text-accent-600"
                },
                {
                  title: "Giá Trị",
                  icon: <ShieldCheck className="h-6 w-6" />,
                  desc: "Lấy minh bạch Blockchain làm nền tảng, chúng tôi bảo vệ giá trị thực của tri thức và nhân tài.",
                  color: "bg-slate-50 text-slate-600"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-12 bg-white border border-slate-50 rounded-[3rem] hover-float"
                >
                  <div className={`h-16 w-16 ${item.color} rounded-2xl flex items-center justify-center mb-10 shadow-inner`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Hệ sinh thái - Unified & Visual */}
        <section id="targets" className="py-section bg-slate-50/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-24 space-y-4">
               <span className="text-primary-500 font-bold text-xs uppercase tracking-[0.3em]">Hệ sinh thái IGC</span>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Kết nối giá trị thực cho mọi đối tác</h2>
               <div className="h-1 w-20 bg-accent-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { 
                  title: "Người học", 
                  image: "/nguoi-hoc.webp", 
                  icon: <GraduationCap className="h-5 w-5" />,
                  desc: "Chủ động quản lý và bảo vệ thành quả học tập, kiến tạo hồ sơ năng lực số tin cậy trọn đời." 
                },
                { 
                  title: "Đơn vị đào tạo", 
                  image: "/don-vi-dao-tao.webp", 
                  icon: <Building2 className="h-5 w-5" />,
                  desc: "Chuẩn hóa quy trình cấp phát chứng chỉ, tối ưu vận hành và nâng cao uy tín thương hiệu." 
                },
                { 
                  title: "Doanh nghiệp", 
                  image: "/doanh-nghiep.webp", 
                  icon: <Users className="h-5 w-5" />,
                  desc: "Xác thực tức thời hồ sơ ứng viên, xây dựng đội ngũ vững mạnh dựa trên dữ liệu thật." 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 hover-float group flex flex-col"
                >
                   <div className="aspect-4/3 relative overflow-hidden bg-slate-50">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute top-6 left-6">
                         <div className="h-10 w-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-primary-500">
                            {item.icon}
                         </div>
                      </div>
                   </div>
                   <div className="p-10 space-y-4">
                      <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed text-lg">{item.desc}</p>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: CTA - Simple & Clean */}
        <section className="py-40 text-center">
           <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto space-y-12">
                <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-tight tracking-tighter">
                  Sẵn sàng số hóa <br /> cùng IGC?
                </h2>
                <div className="flex flex-wrap justify-center gap-8">
                  <Button className="bg-primary-500 hover:bg-primary-600 text-white px-12 py-10 rounded-full text-xl font-black shadow-2xl shadow-primary-500/20 transition-all">
                    Đăng ký miễn phí
                  </Button>
                  <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50 px-12 py-10 rounded-full text-xl font-bold transition-all">
                    Liên hệ hợp tác
                  </Button>
                </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


