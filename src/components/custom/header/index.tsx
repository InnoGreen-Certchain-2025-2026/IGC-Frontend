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
      className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/60 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-1"
          >
            <img
              src="/favicon/web-logo.png"
              alt="IGC Logo"
              className="h-10 w-10 object-contain"
            />
          </motion.div>
          <div className="flex flex-col -space-y-1">
             <span className="text-2xl font-black tracking-tighter text-slate-900 font-display uppercase italic">
                InnoGreen
             </span>
             <span className="text-[8px] font-black tracking-[0.3em] uppercase text-primary-500">Certchain Platform</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {navLinks.map((link, i) => (
              <motion.li
                key={link.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <a
                  href={link.href}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-primary-600 hover:bg-white hover:shadow-sm transition-all uppercase tracking-widest"
                >
                  <span className="opacity-70 group-hover:opacity-100">{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              </motion.li>
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
            className="text-slate-500 hover:text-slate-950 font-bold text-sm hidden sm:flex px-6 rounded-2xl h-12"
          >
            <Link to="/auth?mode=sign-in" className="flex gap-2">
              <LogIn className="h-4 w-4" /> Sign In
            </Link>
          </Button>
          <Button
            asChild
            className="bg-slate-950 hover:bg-black text-white px-8 rounded-2xl h-12 font-bold transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-slate-900/10"
          >
            <Link to="/auth?mode=sign-up" className="flex gap-2">
              <span>Get Started</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}
