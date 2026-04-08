import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center space-x-2">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <img
                  src="/favicon/web-logo.png"
                  alt="IGC Logo"
                  className="h-6 w-6 object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter font-display">IGC</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
              Nền tảng số hóa chứng chỉ tiên phong trên Blockchain, mang lại sự minh bạch và tin cậy tuyệt đối cho giáo dục toàn cầu.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px] font-display">Sản phẩm</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Trang chủ</a></li>
              <li><a href="#about" className="hover:text-slate-900 transition-colors">Giới thiệu</a></li>
              <li><a href="#targets" className="hover:text-slate-900 transition-colors">Hệ sinh thái</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px] font-display">Pháp lý</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Điều khoản</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Bảo mật</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-slate-400 font-medium">
            &copy; {currentYear} InnoGreen Certchain (IGC). All rights reserved.
          </p>
          <div className="flex space-x-8">
             <div className="text-slate-300 hover:text-slate-900 transition-colors cursor-pointer text-sm font-bold">Twitter</div>
             <div className="text-slate-300 hover:text-slate-900 transition-colors cursor-pointer text-sm font-bold">LinkedIn</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
