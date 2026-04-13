import { motion } from "framer-motion";

interface LandingPageTabsProps {
  activeTab: "intro" | "verify";
  onTabChange: (tab: "intro" | "verify") => void;
}

export default function LandingPageTabs({
  activeTab,
  onTabChange,
}: LandingPageTabsProps) {
  return (
    <div className="sticky top-20 z-40 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 flex">
        <motion.button
          onClick={() => onTabChange("intro")}
          className={`relative px-6 py-4 font-semibold text-lg transition-colors duration-300 ${
            activeTab === "intro"
              ? "text-[#214e41]"
              : "text-slate-600 hover:text-[#214e41]"
          }`}
        >
          Giới thiệu
          {activeTab === "intro" && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-1 bg-[#214e41]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>

        <motion.button
          onClick={() => onTabChange("verify")}
          className={`relative px-6 py-4 font-semibold text-lg transition-colors duration-300 ${
            activeTab === "verify"
              ? "text-[#214e41]"
              : "text-slate-600 hover:text-[#214e41]"
          }`}
        >
          Xác thực
          {activeTab === "verify" && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-1 bg-[#214e41]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
