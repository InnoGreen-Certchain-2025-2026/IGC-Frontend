import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";

export default function HeaderNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isVerifyPage = location.pathname === "/verify";
  const isIntroPage = location.pathname === "/";

  const scrollTo = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  const regularLinks = [
    {
      label: t("landingPage.header.intro", "Giới thiệu"),
      to: "/",
      isActive: isIntroPage,
      onClick: undefined as ((e: React.MouseEvent) => void) | undefined,
    },
    {
      label: t("landingPage.header.about", "Về chúng tôi"),
      to: "/#story",
      isActive: false,
      onClick: scrollTo("story"),
    },
    {
      label: t("landingPage.header.pricing", "Gói dịch vụ"),
      to: "/#pricing",
      isActive: false,
      onClick: scrollTo("pricing"),
    },
    {
      label: t("landingPage.header.contact", "Liên hệ"),
      to: "/#contact",
      isActive: false,
      onClick: scrollTo("contact"),
    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex items-center gap-1"
    >
      {regularLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={link.onClick}
          className={`relative px-4 py-2.5 font-semibold transition-colors duration-300 whitespace-nowrap ${
            link.isActive
              ? "text-[#214e41]"
              : "text-slate-600 hover:text-[#214e41]"
          }`}
        >
          {link.label}
          {link.isActive && (
            <motion.div
              layoutId="header-underline"
              className="absolute bottom-0 left-0 right-0 h-1 bg-[#214e41]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Link>
      ))}

      {/* ── Verify — shining badge ── */}
      <Link
        to="/verify"
        className={`relative ml-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold overflow-hidden transition-all duration-300 whitespace-nowrap ${
          isVerifyPage
            ? "bg-[#214e41] text-white shadow-lg shadow-[#214e41]/30"
            : "bg-[#214e41]/10 text-[#214e41] hover:bg-[#214e41] hover:text-white hover:shadow-lg hover:shadow-[#214e41]/30"
        }`}
      >
        {/* Shine sweep */}
        <motion.span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
        />
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        {t("landingPage.header.verify", "Xác thực")}

        {/* Pulse ring */}
        {!isVerifyPage && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#214e41]/40"
            animate={{ scale: [1, 1.15], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </Link>
    </motion.nav>
  );
}
