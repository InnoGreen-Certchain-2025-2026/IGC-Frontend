import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HeaderNavigation() {
  const location = useLocation();
  const { t } = useTranslation();

  const isVerifyPage = location.pathname === "/verify";
  const isIntroPage = location.pathname === "/";

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="grid grid-cols-2 items-center gap-2"
    >
      <Link
        to="/"
        className={`relative w-28 text-center px-4 py-2.5 font-semibold transition-colors duration-300 ${
          isIntroPage ? "text-[#214e41]" : "text-slate-600 hover:text-[#214e41]"
        }`}
      >
        {t("landingPage.header.intro", "Giới thiệu")}
        {isIntroPage && (
          <motion.div
            layoutId="header-underline"
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#214e41]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>

      <Link
        to="/verify"
        className={`relative w-28 text-center px-4 py-2.5 font-semibold transition-colors duration-300 ${
          isVerifyPage
            ? "text-[#214e41]"
            : "text-slate-600 hover:text-[#214e41]"
        }`}
      >
        {t("landingPage.header.verify", "Xác thực")}
        {isVerifyPage && (
          <motion.div
            layoutId="header-underline"
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#214e41]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </motion.nav>
  );
}
