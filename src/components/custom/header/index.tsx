import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LogIn, ArrowUpRight } from "lucide-react";

export default function Header() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

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
            whileHover={{ scale: 1.05 }}
            className="p-1"
          >
            <img
              src="/logo/logo_original.png"
              alt="InnoGreen Certchain Logo"
              className="h-14 w-auto object-contain"
            />
          </motion.div>
        </Link>


        {/* Auth Buttons & Language */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-slate-50 hover:bg-slate-200 border border-slate-200 rounded-2xl transition-colors font-bold text-sm text-slate-800 shadow-sm"
          >
            {i18n.language === "vi" ? (
               <>
                 <img src="https://flagcdn.com/w40/vn.png" alt="Việt Nam" className="w-5 h-auto rounded-sm" />
                 <span>VI</span>
               </>
            ) : (
               <>
                 <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-5 h-auto rounded-sm" />
                 <span>EN</span>
               </>
            )}
          </button>

          <Link to="/auth?mode=sign-in">
            <Button
              variant="ghost"
              className="text-slate-500 hover:text-slate-950 font-bold text-sm hidden sm:flex px-6 rounded-2xl h-12 gap-2"
            >
              <LogIn className="h-4 w-4" /> {t("landingPage.header.signIn", "Đăng Nhập")}
            </Button>
          </Link>
          <Link to="/auth?mode=sign-up">
            <Button
              className="bg-slate-950 hover:bg-black text-white px-8 rounded-2xl h-12 font-bold transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-slate-900/10 gap-2"
            >
              <span>{t("landingPage.header.getStarted", "Bắt Đầu")}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
