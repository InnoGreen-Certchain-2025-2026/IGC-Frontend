import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-full h-2 bg-linear-to-r from-[#214e41] via-[#4f9b5a] to-[#f2ce3c]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24 max-w-6xl mx-auto">
          <div className="md:col-span-2 space-y-8">
            <Link to="/" className="inline-block">
              <img
                src="/logo/logo_original.png"
                alt="InnoGreen Certchain Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-600 max-w-sm leading-relaxed font-medium">
              Hệ thống quản lý xác thực văn bằng/chứng chỉ xanh dựa trên nền tảng Blockchain và chữ ký số, kiến tạo giá trị thực cho tương lai bền vững.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-[#214e41] mb-8 uppercase tracking-[0.2em] text-xs">Liên kết</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><Link to="/" className="hover:text-[#4f9b5a] transition-colors">Trang chủ</Link></li>
              <li><a href="#about" className="hover:text-[#4f9b5a] transition-colors">Về dự án</a></li>
              <li><a href="#targets" className="hover:text-[#4f9b5a] transition-colors">Tính năng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#214e41] mb-8 uppercase tracking-[0.2em] text-xs">Pháp lý</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><Link to="#" className="hover:text-[#4f9b5a] transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="#" className="hover:text-[#4f9b5a] transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 max-w-6xl mx-auto">
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            &copy; {currentYear} InnoGreen Certchain. All rights reserved.
          </p>
          <div className="flex space-x-8">
             <a href="#" className="text-slate-300 hover:text-[#214e41] transition-colors text-sm font-bold uppercase tracking-widest">Facebook</a>
             <a href="#" className="text-slate-300 hover:text-[#214e41] transition-colors text-sm font-bold uppercase tracking-widest">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
