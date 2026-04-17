import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex items-center justify-center gap-1.5 h-9 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-[10px] transition-colors font-bold text-xs text-slate-800 shadow-sm",
        className
      )}
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
  );
}
