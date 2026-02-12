import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-blue-50 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
             <span className="text-xl font-bold text-blue-900 italic">IGC</span>
             <span className="text-gray-400">|</span>
             <p className="text-sm text-gray-500">Nền Tảng Chứng Chỉ InnoGreen</p>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-blue-600 transition-colors">Chính Sách Bảo Mật</Link>
            <Link to="#" className="hover:text-blue-600 transition-colors">Điều Khoản Dịch Vụ</Link>
          </div>

          <p className="text-sm text-gray-400">
            &copy; {currentYear} IGC. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
