import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import { Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-[#003366]">
          {/* Background Image */}
          <img 
            src="/homepage-hero-bg.png" 
            alt="Bản đồ thế giới"
            className="absolute inset-0 z-[1] w-full h-full object-cover opacity-30"
          />
          {/* Dark blue overlay for text readability */}
          <div className="absolute inset-0 z-[2] bg-[#003366]/50" />

          <div className="container relative z-[3] mx-auto px-4 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight max-w-4xl">
              Tra Cứu và Xác Minh <br />
              <span className="text-blue-200">Chứng Chỉ & Hơn Thế Nữa</span>
            </h1>
            
            <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Cơ sở dữ liệu toàn cầu chính thức cho các chứng chỉ được công nhận. Kiểm tra chứng chỉ IGC trực tuyến hoặc xác minh 
              các chứng chỉ quốc tế, quốc gia và theo ngành với thông báo tức thì.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-3xl mb-16">
              <div className="flex items-center bg-white rounded-full border-2 border-white/30 p-1.5 shadow-xl shadow-black/20 transition-all focus-within:border-white/60 focus-within:ring-4 focus-within:ring-white/20">
                <Input 
                  type="text" 
                  placeholder="Nhập tên công ty hoặc mã chứng chỉ" 
                  className="flex-grow bg-transparent border-none shadow-none focus-visible:ring-0 text-lg py-6 h-auto px-6 italic text-gray-400"
                />
                <Button className="bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-full h-12 px-8 flex items-center space-x-2 font-bold transition-all hover:scale-102">
                  <Search className="h-5 w-5" />
                  <span>Tìm kiếm</span>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 w-full">
              {[
                { label: "Chứng Chỉ", value: "3,245,888" },
                { label: "Tổ Chức Chứng Nhận", value: "2,493" },
                { label: "Tổ Chức Công Nhận", value: "80" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
                  <span className="text-sm font-semibold text-blue-200 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Details Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                { title: "Hỗ Trợ Blockchain", desc: "Tính bất biến và minh bạch cho mọi chứng chỉ được ghi nhận trên chuỗi khối." },
                { title: "Truy Cập Tức Thì", desc: "Kiểm tra bất kỳ chứng chỉ nào trên toàn cầu, 24/7 không chậm trễ hay qua trung gian." },
                { title: "Chống Giả Mạo", desc: "Chữ ký số và mã băm mật mã đảm bảo dữ liệu luôn nguyên bản." }
              ].map((feat, i) => (
                <div key={i} className="text-center p-8 rounded-2xl border border-blue-50 bg-blue-50/10 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="h-6 w-6 bg-blue-500 rounded-full" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{feat.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


