import { motion } from "framer-motion";
import { ShieldCheck, Zap, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const PLAN_STYLES: Record<string, {
  border: string;
  borderActive: string;
  iconBg: string;
  iconBgActive: string;
  title: string;
  price: string;
  badge: string;
  desc: string;
  exceedPrice: string;
}> = {
  BASIC: {
    border: "hover:border-slate-400 hover:shadow-slate-200 hover:-translate-y-1 border-gray-200",
    borderActive: "border-slate-500 bg-slate-50/70 shadow-slate-200 ring-4 ring-slate-500/10 -translate-y-1",
    iconBg: "bg-slate-100 text-slate-500",
    iconBgActive: "bg-slate-600 text-white",
    title: "text-slate-800",
    price: "text-slate-800",
    badge: "bg-slate-600 text-white",
    desc: "text-slate-500",
    exceedPrice: "text-red-600",
  },
  PRO: {
    border: "hover:border-[#2d6a4f] hover:shadow-[#2d6a4f]/20 hover:-translate-y-2 border-[#2d6a4f]/30",
    borderActive: "border-[#2d6a4f] bg-emerald-50/50 shadow-[#2d6a4f]/20 shadow-xl ring-4 ring-[#2d6a4f]/20 -translate-y-2 z-10",
    iconBg: "bg-emerald-100 text-[#2d6a4f]",
    iconBgActive: "bg-[#2d6a4f] text-white",
    title: "text-[#2d6a4f]",
    price: "text-[#2d6a4f]",
    badge: "bg-[#2d6a4f] text-white shadow-md shadow-[#2d6a4f]/20",
    desc: "text-emerald-700/80",
    exceedPrice: "text-red-500",
  },
  ENTERPRISE: {
    border: "hover:border-indigo-400 hover:shadow-indigo-200 hover:-translate-y-1 border-indigo-200",
    borderActive: "border-indigo-500 bg-indigo-50/70 shadow-indigo-200 ring-4 ring-indigo-500/10 -translate-y-1",
    iconBg: "bg-indigo-100 text-indigo-500",
    iconBgActive: "bg-indigo-600 text-white",
    title: "text-indigo-800",
    price: "text-indigo-800",
    badge: "bg-indigo-600 text-white",
    desc: "text-indigo-500/80",
    exceedPrice: "text-red-600",
  }
};

export default function PricingSection() {
  const { t } = useTranslation();

  const PLANS = [
    {
      id: "BASIC" as const,
      name: t("landingPage.pricing.plans.basic.name"),
      description: t("landingPage.pricing.plans.basic.description"),
      price: t("landingPage.pricing.plans.basic.price"),
      period: t("landingPage.pricing.plans.basic.period"),
      limit: t("landingPage.pricing.plans.basic.limit"),
      customText: t("landingPage.pricing.plans.basic.customText"),
      exceedPrice: t("landingPage.pricing.plans.basic.exceedPrice"),
      featuresTitle: t("landingPage.pricing.plans.basic.featuresTitle"),
      includes: t("landingPage.pricing.plans.basic.includes", { returnObjects: true }) as string[],
      supportTitle: t("landingPage.pricing.plans.basic.supportTitle"),
      support: t("landingPage.pricing.plans.basic.support", { returnObjects: true }) as string[],
      icon: Building2,
    },
    {
      id: "PRO" as const,
      name: t("landingPage.pricing.plans.pro.name"),
      description: t("landingPage.pricing.plans.pro.description"),
      price: t("landingPage.pricing.plans.pro.price"),
      period: t("landingPage.pricing.plans.pro.period"),
      limit: t("landingPage.pricing.plans.pro.limit"),
      customText: t("landingPage.pricing.plans.pro.customText"),
      exceedPrice: t("landingPage.pricing.plans.pro.exceedPrice"),
      featuresTitle: t("landingPage.pricing.plans.pro.featuresTitle"),
      includes: t("landingPage.pricing.plans.pro.includes", { returnObjects: true }) as string[],
      supportTitle: t("landingPage.pricing.plans.pro.supportTitle"),
      support: t("landingPage.pricing.plans.pro.support", { returnObjects: true }) as string[],
      icon: Zap,
      popular: true,
    },
    {
      id: "ENTERPRISE" as const,
      name: t("landingPage.pricing.plans.enterprise.name"),
      description: t("landingPage.pricing.plans.enterprise.description"),
      price: t("landingPage.pricing.plans.enterprise.price"),
      period: t("landingPage.pricing.plans.enterprise.period"),
      limit: t("landingPage.pricing.plans.enterprise.limit"),
      customText: t("landingPage.pricing.plans.enterprise.customText"),
      exceedPrice: t("landingPage.pricing.plans.enterprise.exceedPrice"),
      featuresTitle: t("landingPage.pricing.plans.enterprise.featuresTitle"),
      includes: t("landingPage.pricing.plans.enterprise.includes", { returnObjects: true }) as string[],
      supportTitle: t("landingPage.pricing.plans.enterprise.supportTitle"),
      support: t("landingPage.pricing.plans.enterprise.support", { returnObjects: true }) as string[],
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto mb-16 md:mb-20 flex items-center gap-4">
           <div className="w-1.5 h-10 bg-[#f2ce3c]" />
           <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-[#214e41] uppercase tracking-tight">{t("landingPage.pricing.title")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto pt-6">
          {PLANS.map((p, index) => {
            const styles = PLAN_STYLES[p.id];
            const isSelected = p.popular;
            
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                  "relative flex flex-col p-6 rounded-3xl border-2 transition-all duration-300",
                  isSelected
                    ? styles.borderActive
                    : cn("bg-white", styles.border)
                )}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-max">
                     <span className={cn("px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider rounded-full", styles.badge)}>
                       {t("landingPage.pricing.recommended")}
                     </span>
                  </div>
                )}
                
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-sm transition-colors",
                    isSelected ? styles.iconBgActive : styles.iconBg,
                  )}
                >
                  <p.icon size={24} />
                </div>
                
                <h4 className={cn("font-bold mb-1 text-center text-xl uppercase", styles.title)}>{p.name}</h4>
                <p className={cn("text-[0.85rem] mb-4 text-center", styles.desc)}>{p.description}</p>
                
                <div className={cn("text-center mb-1 font-bold transition-colors", styles.price)}>
                  <span className="text-xl md:text-2xl font-black">{p.price}</span>
                  {p.period && <span className="text-[0.95rem] font-semibold ml-1 opacity-80">{p.period}</span>}
                </div>
                
                {p.customText && (
                   <p className={cn("text-sm text-center mb-1 font-medium", styles.title)}>{p.customText}</p>
                )}

                {p.limit && (
                   <p className={cn("text-sm text-center mb-1 font-semibold", styles.title)}>{p.limit}</p>
                )}

                <p className={cn("text-sm font-semibold mb-6 text-center", styles.exceedPrice)}>
                  {p.exceedPrice}
                </p>

                <div className="mt-auto w-full flex justify-center pb-2">
                  <div className="w-fit text-left">
                    <div>
                      <h5 className={cn("font-bold text-[0.95rem] mb-3", styles.title)}>{p.featuresTitle}</h5>
                      <div className="space-y-2.5 flex flex-col">
                        {p.includes.map((f, i) => (
                          <div key={i} className="flex items-start text-[0.9rem] text-gray-600 gap-2.5">
                            <Check size={16} className={cn("mt-[1px] shrink-0", isSelected ? styles.title : "text-gray-300")} strokeWidth={2.5} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6">
                      <h5 className={cn("font-bold text-[0.95rem] mb-3", styles.title)}>{p.supportTitle}</h5>
                      <div className="space-y-2.5 flex flex-col">
                        {p.support.map((f, i) => (
                          <div key={i} className="flex items-start text-[0.9rem] text-gray-600 gap-2.5">
                            <Check size={16} className={cn("mt-[1px] shrink-0", isSelected ? styles.title : "text-gray-300")} strokeWidth={2.5} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

