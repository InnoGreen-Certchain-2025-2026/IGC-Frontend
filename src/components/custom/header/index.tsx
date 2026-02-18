import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Header() {
  const navLinks = [
    { name: "Trang Chủ", href: "/landing-page" },
    { name: "Giới Thiệu", href: "#about" },
    { name: "Dịch Vụ", href: "#service" },
    { name: "Gói Dịch Vụ", href: "#plans" },
    { name: "Liên Hệ", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/landing-page" className="flex items-center space-x-2">
          <img
            src="/favicon/web-logo.png"
            alt="IGC Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-black tracking-tighter text-blue-900 border-l-2 border-blue-100 pl-3 ml-1">
            IGC
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="transition-colors hover:text-blue-600"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            asChild
            className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
          >
            <Link to="/auth?mode=sign-in">Đăng Nhập</Link>
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 px-6 font-semibold"
            asChild
          >
            <Link to="/auth?mode=sign-up">Đăng Ký</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
