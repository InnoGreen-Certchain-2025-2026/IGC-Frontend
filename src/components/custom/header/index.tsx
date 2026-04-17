import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import HeaderNavigation from "./HeaderNavigation";

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/92 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:gap-8">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src="/logo/logo_icon.png"
              alt="InnoGreen Icon"
              className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
            />
          </motion.div>
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#214e41] tracking-tight leading-none">
            IGC
          </span>
        </Link>

        {/* Navigation - Center */}
        <div className="hidden md:flex flex-1 justify-center">
          <HeaderNavigation />
        </div>

        {/* Auth Buttons & Language - Right */}
        <motion.div
          className="hidden md:flex items-center gap-3 shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 sm:gap-2 h-8 sm:h-10 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-200 border border-slate-200 rounded-xl sm:rounded-2xl transition-colors font-bold text-xs sm:text-sm text-slate-800 shadow-sm"
          >
            {i18n.language === "vi" ? (
              <>
                <img
                  src="https://flagcdn.com/w40/vn.png"
                  alt="Việt Nam"
                  className="w-5 h-auto rounded-sm"
                />
                <span>VI</span>
              </>
            ) : (
              <>
                <img
                  src="https://flagcdn.com/w40/us.png"
                  alt="English"
                  className="w-5 h-auto rounded-sm"
                />
                <span>EN</span>
              </>
            )}
          </button>

          <Link to="/auth?mode=sign-in">
            <Button
              variant="ghost"
              className="text-slate-500 hover:text-slate-950 font-bold text-sm hidden sm:flex px-6 rounded-2xl h-12 gap-2"
            >
              <LogIn className="h-4 w-4" />{" "}
              {t("landingPage.header.signIn", "Đăng Nhập")}
            </Button>
          </Link>
          <Link to="/auth?mode=sign-up">
            <Button className="bg-slate-950 hover:bg-black text-white px-4 sm:px-8 rounded-xl sm:rounded-2xl h-10 sm:h-12 text-xs sm:text-sm font-bold transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-slate-900/10 gap-1 sm:gap-2">
              <span className="hidden min-[400px]:inline-block">
                {t("landingPage.header.getStarted", "Bắt Đầu")}
              </span>
              <span className="min-[400px]:hidden">Join</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 h-9 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors font-bold text-xs text-slate-800 shadow-sm"
          >
            {i18n.language === "vi" ? (
              <>
                <img
                  src="https://flagcdn.com/w40/vn.png"
                  alt="Việt Nam"
                  className="w-4 h-auto rounded-sm"
                />
                <span>VI</span>
              </>
            ) : (
              <>
                <img
                  src="https://flagcdn.com/w40/us.png"
                  alt="English"
                  className="w-4 h-auto rounded-sm"
                />
                <span>EN</span>
              </>
            )}
          </button>

          <button
            aria-label={
              isMobileMenuOpen
                ? t("landingPage.header.closeMenu", "Đóng menu")
                : t("landingPage.header.openMenu", "Mở menu")
            }
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#214e41] transition-colors"
              >
                {t("landingPage.header.intro", "Giới thiệu")}
              </Link>
              <Link
                to="/verify"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#214e41] transition-colors"
              >
                {t("landingPage.header.verify", "Xác thực")}
              </Link>
              <Link
                to="/#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  if (location.pathname === "/") {
                    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                    }, 400);
                  }
                }}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#214e41] transition-colors"
              >
                {t("landingPage.header.pricing", "Gói dịch vụ")}
              </Link>
              <Link
                to="/#contact"
                onClick={scrollToContact}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#214e41] transition-colors"
              >
                {t("landingPage.header.contact", "Liên hệ")}
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/auth?mode=sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full h-11 rounded-xl font-bold text-slate-500 hover:text-slate-950 gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    {t("landingPage.header.signIn", "Đăng Nhập")}
                  </Button>
                </Link>
                <Link
                  to="/auth?mode=sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full h-11 rounded-xl bg-slate-950 hover:bg-black text-white font-bold gap-2 shadow-xl shadow-slate-900/10">
                    {t("landingPage.header.getStarted", "Bắt Đầu")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
