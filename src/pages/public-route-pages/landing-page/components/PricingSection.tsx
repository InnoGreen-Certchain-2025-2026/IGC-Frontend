import { motion } from "framer-motion";
import { ShieldCheck, Zap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "BASIC" as const,
    name: "Gói Basic",
    description: "Phù hợp trung tâm nhỏ",
    price: "299k",
    period: "1 tháng",
    limit: "2000 chứng chỉ 1 năm",
    includes: [
      "Cấp chứng chỉ PDF",
      "Xác thực bằng file hash",
      "Lưu trữ S3",
      "API cơ bản",
    ],
    support: [
      "Email support",
      "Tài liệu hướng dẫn",
    ],
    icon: Building2,
  },
  {
    id: "PRO" as const,
    name: "Gói Pro",
    description: "Phù hợp trường đại học",
    price: "1.999.999đ",
    period: "/ tháng",
    limit: "10, 000 chứng chỉ năm",
    includes: [
      "Bao gồm basic",
      "Ghi hash lên blockchain",
      "Quản trị cho admin",
      "Hỗ trợ full API",
    ],
    support: [
      "Support 24/07",
      "Hướng dẫn triển khai",
      "Thống kê cơ bản",
    ],
    icon: Zap,
    popular: true,
  },
  {
    id: "ENTERPRISE" as const,
    name: "Gói Enterprise",
    description: "Tổ chức lớn",
    price: "9.999.999đ",
    period: "tháng hoặc custom",
    limit: "Không giới hạn",
    includes: [
      "Bao gồm Pro",
      "Blockchain riêng",
      "Sever riêng",
    ],
    support: [
      "Hỗ trợ riêng",
      "Tư vấn kỹ thuật",
    ],
    icon: ShieldCheck,
  },
];

const PLAN_STYLES: Record<string, {
  border: string;
  iconBg: string;
  title: string;
  price: string;
  badge: string;
  desc: string;
}> = {
  BASIC: {
    border: "border-[#1E504A] border-t-8 border-x-2 border-b-2 hover:-translate-y-2 bg-white",
    iconBg: "bg-slate-100 text-slate-500",
    title: "text-[#1E504A]",
    price: "text-[#1E504A]",
    badge: "bg-slate-600 text-white",
    desc: "text-[#3c524c]",
  },
  PRO: {
    border: "border-[#1E504A] border-t-8 border-x-2 border-b-2 hover:-translate-y-3 bg-[#f2fcf9]",
    iconBg: "bg-[#1E504A] text-white",
    title: "text-[#1E504A]",
    price: "text-[#1E504A]",
    badge: "bg-[#214e41] text-[#f2ce3c] shadow-md shadow-emerald-500/20",
    desc: "text-[#3c524c]",
  },
  ENTERPRISE: {
    border: "border-[#1E504A] border-t-8 border-x-2 border-b-2 hover:-translate-y-2 bg-white",
    iconBg: "bg-indigo-100 text-indigo-500",
    title: "text-[#1E504A]",
    price: "text-[#1E504A]",
    badge: "bg-indigo-600 text-white",
    desc: "text-[#3c524c]",
  }
};

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
           <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#214e41] uppercase tracking-tight">Gói dịch vụ</h2>
           <div className="h-1.5 w-16 md:w-24 bg-[#f2ce3c] mx-auto mt-4 md:mt-6" />
           <p className="mt-6 text-lg text-slate-600">Đa dạng lựa chọn, phù hợp mọi quy mô tổ chức</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto md:items-end">
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
                  "relative flex flex-col p-8 md:p-10 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300",
                  styles.border
                )}
              >
                {p.popular && (
                  <span className={cn("absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none", styles.badge)}>
                    Khuyên dùng
                  </span>
                )}
                
                <h4 className={cn("font-extrabold mb-3 text-center text-3xl", styles.title)}>{p.name}</h4>
                <p className={cn("text-base italic mb-6 text-center px-4", styles.desc)}>{p.description}</p>
                
                <div className={cn("text-center mb-6 transition-colors", styles.price)}>
                  <span className="text-4xl font-black">{p.price}</span>
                  <span className="text-lg font-semibold ml-1 opacity-80">{p.period !== 'tháng hoặc custom' ? p.period : ' / tháng...'}</span>
                </div>
                
                <p className={cn("text-lg font-bold mb-8 text-center pb-8 border-b border-gray-200", styles.title)}>{p.limit}</p>

                <div className="space-y-6 mt-auto px-2">
                  <div>
                    <h5 className={cn("font-bold text-lg mb-4 text-center", styles.title)}>Bao gồm:</h5>
                    <div className="space-y-3 flex flex-col items-center">
                      {p.includes.map((f, i) => (
                        <div key={i} className="flex items-center text-base text-gray-600 text-center gap-2">
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <h5 className={cn("font-bold text-lg mb-4 text-center", styles.title)}>Hỗ trợ</h5>
                    <div className="space-y-3 flex flex-col items-center">
                      {p.support.map((f, i) => (
                        <div key={i} className="flex items-center text-base text-gray-600 text-center gap-2">
                          <span>{f}</span>
                        </div>
                      ))}
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
