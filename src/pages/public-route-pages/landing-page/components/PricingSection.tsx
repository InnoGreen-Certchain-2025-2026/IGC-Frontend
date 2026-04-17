import { motion } from "framer-motion";
import { ShieldCheck, Zap, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const PLAN_STYLES: Record<string, {
  container: string;
  iconColor: string;
  title: string;
  price: string;
  badge: string;
  desc: string;
  check: string;
  exceedPrice: string;
}> = {
  BASIC: {
    container: "border-gray-500 border bg-white rounded-3xl",
    iconColor: "text-gray-900",
    title: "text-black",
    price: "text-black",
    badge: "",
    desc: "text-gray-800",
    check: "text-black",
    exceedPrice: "text-red-600",
  },
  PRO: {
    container: "border-[#2d6a4f] border-[1.5px] bg-white rounded-3xl z-10 md:-translate-y-2",
    iconColor: "text-[#2d6a4f]",
    title: "text-[#2d6a4f]",
    price: "text-[#2d6a4f]",
    badge: "bg-[#2d6a4f] text-white px-5 py-1.5 rounded-full font-bold uppercase tracking-wide text-xs shadow-md",
    desc: "text-[#2d6a4f]",
    check: "text-[#2d6a4f]",
    exceedPrice: "text-red-500",
  },
  ENTERPRISE: {
    container: "border-indigo-400 border bg-white rounded-3xl",
    iconColor: "text-indigo-800",
    title: "text-indigo-900",
    price: "text-indigo-900",
    badge: "",
    desc: "text-indigo-800",
    check: "text-indigo-800",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-4">
          {PLANS.map((p, index) => {
            const styles = PLAN_STYLES[p.id];
            
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                  "relative flex flex-col p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:shadow-xl",
                  styles.container
                )}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-max">
                     <span className={cn(styles.badge)}>
                       {t("landingPage.pricing.recommended")}
                     </span>
                  </div>
                )}
                
                <div className="flex justify-center mb-4">
                  <p.icon className={cn("w-10 h-10 sm:w-12 sm:h-12", styles.iconColor)} strokeWidth={1.5} />
                </div>
                
                <h4 className={cn("font-bold mb-1 text-center text-xl sm:text-2xl uppercase", styles.title)}>{p.name}</h4>
                <p className={cn("text-sm sm:text-base mb-4 text-center", styles.desc)}>{p.description}</p>
                
                <div className={cn("text-center mb-1 font-bold", styles.price)}>
                  <span className="text-xl sm:text-2xl leading-none">{p.price}</span>
                  {p.period && <span className="text-lg sm:text-xl ml-1">{p.period}</span>}
                </div>
                
                {p.customText && (
                   <p className={cn("text-sm sm:text-base text-center mb-1 font-medium", styles.title)}>{p.customText}</p>
                )}

                {p.limit && (
                   <p className={cn("text-sm sm:text-base text-center mb-1", styles.title)}>{p.limit}</p>
                )}

                <p className={cn("text-sm sm:text-base font-semibold mb-8 text-center", styles.exceedPrice)}>
                  {p.exceedPrice}
                </p>

                <div className="mt-auto w-full flex justify-center">
                  <div className="w-fit">
                    <div>
                      <h5 className={cn("font-bold text-sm sm:text-base mb-3", styles.title)}>{p.featuresTitle}</h5>
                      <div className="space-y-2 flex flex-col">
                        {p.includes.map((f, i) => (
                          <div key={i} className="flex items-start text-sm sm:text-base text-gray-700 gap-2.5">
                            <Check className={cn("w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-[2px]", styles.check)} strokeWidth={2.5} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6">
                      <h5 className={cn("font-bold text-sm sm:text-base mb-3", styles.title)}>{p.supportTitle}</h5>
                      <div className="space-y-2 flex flex-col">
                        {p.support.map((f, i) => (
                          <div key={i} className="flex items-start text-sm sm:text-base text-gray-700 gap-2.5">
                            <Check className={cn("w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-[2px]", styles.check)} strokeWidth={2.5} />
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

