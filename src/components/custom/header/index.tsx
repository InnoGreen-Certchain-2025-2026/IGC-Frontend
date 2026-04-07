import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { 
  Home, 
  Info, 
  Network, 
  LogIn, 
  ArrowUpRight 
} from "lucide-react";

export default function Header() {
  const navLinks = [
    { name: "Trang Chủ", href: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Giới Thiệu", href: "#about", icon: <Info className="h-4 w-4" /> },
    { name: "Thị Trường", href: "#targets", icon: <Network className="h-4 w-4" /> },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-primary-100/70">
            <img
              src="/favicon/web-logo.png"
              alt="IGC Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="flex flex-col -space-y-1">
             <span className="text-2xl font-black tracking-tighter text-slate-900 font-display uppercase">
                InnoGreen
             </span>
             <span className="text-[9px] font-bold tracking-[1.4em] uppercase text-primary-700">Certchain</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 shadow-[0_1px_0_rgba(16,24,40,0.02),0_8px_24px_rgba(15,23,42,0.04)]">
            {navLinks.map((link, i) => (
              <li key={link.name}>
                <motion.a
                  href={link.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-2 rounded-full border border-transparent px-4.5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition-all duration-150 hover:border-primary-200 hover:bg-slate-100 hover:text-primary-800 hover:shadow-sm"
                >
                  <span className="opacity-80">{link.icon}</span>
                  <span>{link.name}</span>
                </motion.a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="ghost"
            asChild
            className="hidden h-11 rounded-full px-5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-primary-800 sm:flex"
          >
            <Link to="/auth?mode=sign-in" className="flex gap-2">
              <LogIn className="h-4 w-4" /> Đăng nhập
            </Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-primary px-6 font-semibold text-white shadow-sm transition-colors hover:bg-primary-600 active:scale-95"
          >
            <Link to="/auth?mode=sign-up" className="flex gap-2">
              <span>Bắt đầu ngay</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}
