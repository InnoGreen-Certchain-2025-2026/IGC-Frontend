import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  User,
  Building2,
  FileText,
  CheckCircle2,
  Loader2,
  QrCode,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { submitContactFormApi } from "@/services/contactService";

interface ContactFormData {
  fullName: string;
  email: string;
  company: string;
  description: string;
}

const initialForm: ContactFormData = {
  fullName: "",
  email: "",
  company: "",
  description: "",
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ContactSection() {
  const { t } = useTranslation();
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitContactFormApi(form);
      setStatus("success");
      setTimeout(() => {
        setForm(initialForm);
        setStatus("idle");
      }, 3000);
    } catch {
      setStatus("error");
    }
  };

  const fields = [
    {
      name: "fullName" as const,
      label: t("landingPage.contact.form.fullName", "Họ và tên"),
      type: "input" as const,
      inputType: "text",
      placeholder: t("landingPage.contact.form.fullNamePlaceholder", "Nguyễn Văn A"),
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "email" as const,
      label: t("landingPage.contact.form.email", "Email"),
      type: "input" as const,
      inputType: "email",
      placeholder: t("landingPage.contact.form.emailPlaceholder", "email@company.com"),
      icon: <Mail className="h-4 w-4" />,
    },
    {
      name: "company" as const,
      label: t("landingPage.contact.form.company", "Công ty"),
      type: "input" as const,
      inputType: "text",
      placeholder: t("landingPage.contact.form.companyPlaceholder", "Tên công ty / tổ chức"),
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      name: "description" as const,
      label: t("landingPage.contact.form.description", "Nội dung"),
      type: "textarea" as const,
      inputType: "text",
      placeholder: t("landingPage.contact.form.descriptionPlaceholder", "Bạn muốn trao đổi về điều gì?"),
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const contactItems = [
    {
      icon: <MapPin className="h-5 w-5" />,
      label: t("landingPage.contact.address", "Trường Đại học Công nghiệp Tp.HCM, P. Hạnh Thông, Tp.HCM"),
      highlight: false,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "igcertchain@gmail.com",
      highlight: false,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "079-968-1949",
      highlight: true,
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#214e41] border-t-4 border-b-8 border-[#f2ce3c]"
    >
      {/* Background logo watermark */}
      <div className="absolute -right-32 -top-32 opacity-[0.04] pointer-events-none select-none">
        <img
          src="/logo/logo_icon.png"
          alt=""
          className="w-[520px] h-[520px] object-contain"
        />
      </div>

      {/* ── TOP BAND: title + sub ── */}
      <div className="container mx-auto px-4 pt-20 pb-12 md:pt-28 md:pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#f2ce3c]/10 border border-[#f2ce3c]/30 text-[#f2ce3c] text-xs font-bold tracking-[0.25em] uppercase mb-6">
            {t("landingPage.contact.badge", "Liên hệ")}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white leading-tight">
            {t("landingPage.contact.title", "Hãy cùng")}{" "}
            <span className="text-[#f2ce3c]">
              {t("landingPage.contact.titleHighlight", "kết nối")}
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-lg font-medium max-w-xl mx-auto">
            {t(
              "landingPage.contact.sub",
              "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn."
            )}
          </p>
          <div className="w-16 h-1 bg-[#f2ce3c] mx-auto mt-6" />
        </motion.div>
      </div>

      {/* ── MAIN CARD: white, lifted, 3-column ── */}
      <div className="container mx-auto px-4 pb-20 md:pb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
          className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-6xl mx-auto overflow-hidden"
        >
          {/* Corner accent */}
          <div
            className="absolute top-0 right-0 w-28 h-28 bg-[#214e41] hidden"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1.4fr] gap-0">

            {/* ── LEFT: contact info + QR ── */}
            <div className="p-8 sm:p-10 md:p-12 flex flex-col gap-8 justify-between">
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase text-[#214e41] tracking-tight">
                  {t("landingPage.contact.infoTitle", "Thông tin liên hệ")}
                </h3>
                <div className="w-12 h-1 bg-[#f2ce3c]" />

                <div className="space-y-5">
                  {contactItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, ease: EASE, delay: 0.15 + i * 0.08 }}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div
                        className={`h-12 w-12 flex items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                          item.highlight
                            ? "bg-[#f2ce3c] group-hover:bg-[#214e41]"
                            : "bg-slate-100 group-hover:bg-[#f2ce3c]"
                        }`}
                      >
                        <span
                          className={`transition-colors duration-300 ${
                            item.highlight
                              ? "text-[#214e41] group-hover:text-[#f2ce3c]"
                              : "text-[#214e41]"
                          }`}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <span
                        className={`font-semibold text-slate-700 group-hover:text-[#214e41] transition-colors duration-200 leading-snug ${
                          item.highlight ? "text-xl font-black text-[#214e41] tracking-wider" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <a
                  href="https://www.igcert.click"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#4f9b5a] hover:text-[#214e41] transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  www.igcert.click
                </a>
              </div>

              {/* QR code from CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
                className="w-36 h-36 sm:w-44 sm:h-44 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-4 border-[#214e41] shadow-lg p-4 group hover:border-[#f2ce3c] transition-colors cursor-pointer"
              >
                <QrCode className="w-full h-full text-[#214e41] group-hover:text-[#4f9b5a] transition-colors" />
                <p className="font-bold text-[#214e41] mt-2 tracking-widest text-xs">
                  {t("landingPage.contact.scan", "QUÉT MÃ")}
                </p>
              </motion.div>
            </div>

            {/* ── VERTICAL DIVIDER ── */}
            <div className="hidden lg:block bg-slate-100" />

            {/* ── RIGHT: form ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              className="p-8 sm:p-10 md:p-12 bg-slate-50/60"
            >
              {status === "success" ? (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col items-center justify-center h-full min-h-[360px] text-center gap-5"
                >
                  <div className="h-20 w-20 rounded-full bg-[#214e41] flex items-center justify-center shadow-lg shadow-[#214e41]/30">
                    <CheckCircle2 className="h-10 w-10 text-[#f2ce3c]" />
                  </div>
                  <h3 className="text-2xl font-black uppercase text-[#214e41]">
                    {t("landingPage.contact.form.successTitle", "Gửi thành công!")}
                  </h3>
                  <p className="text-slate-500 font-medium max-w-xs">
                    {t(
                      "landingPage.contact.form.successDesc",
                      "Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất."
                    )}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-2">
                    <h3 className="text-xl font-black uppercase text-[#214e41]">
                      {t("landingPage.contact.form.title", "Gửi thông tin")}
                    </h3>
                    <div className="w-12 h-1 bg-[#f2ce3c] mt-3" />
                  </div>

                  {fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label
                        htmlFor={`contact-${field.name}`}
                        className="block text-xs font-bold uppercase tracking-widest text-slate-400"
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        <span
                          className={`absolute left-4 transition-colors duration-200 ${
                            field.type === "textarea" ? "top-3.5" : "top-1/2 -translate-y-1/2"
                          } ${focused === field.name ? "text-[#214e41]" : "text-slate-400"}`}
                        >
                          {field.icon}
                        </span>

                        {field.type === "textarea" ? (
                          <textarea
                            id={`contact-${field.name}`}
                            name={field.name}
                            rows={4}
                            value={form[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocused(field.name)}
                            onBlur={() => setFocused(null)}
                            placeholder={field.placeholder}
                            required
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 text-sm font-medium resize-none transition-all duration-200 outline-none focus:border-[#214e41] focus:shadow-[0_0_0_3px_rgba(33,78,65,0.1)]"
                          />
                        ) : (
                          <input
                            id={`contact-${field.name}`}
                            name={field.name}
                            type={field.inputType}
                            value={form[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocused(field.name)}
                            onBlur={() => setFocused(null)}
                            placeholder={field.placeholder}
                            required
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 text-sm font-medium transition-all duration-200 outline-none focus:border-[#214e41] focus:shadow-[0_0_0_3px_rgba(33,78,65,0.1)]"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-12 bg-[#214e41] hover:bg-[#183930] text-white font-bold text-sm uppercase tracking-[0.15em] rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#214e41]/30 hover:-translate-y-0.5 flex items-center justify-center gap-3 mt-2 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("landingPage.contact.form.sending", "Đang gửi...")}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t("landingPage.contact.form.submit", "Gửi liên hệ")}
                      </>
                    )}
                  </Button>

                  {status === "error" && (
                    <p className="text-sm font-semibold text-red-600 text-center">
                      {t(
                        "landingPage.contact.form.error",
                        "Gửi thất bại. Vui lòng thử lại sau."
                      )}
                    </p>
                  )}
                </form>
              )}
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
