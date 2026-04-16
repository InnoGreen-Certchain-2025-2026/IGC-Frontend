import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  ShieldCheck,
  Zap,
  Globe,
  FileText,
  User,
  Info,
  CreditCard,
  Building,
  Camera,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CreateOrganizationRequest } from "@/types/organization/CreateOrganizationRequest";
import { createOrganizationApi } from "@/services/organizationService";
import ImageCropperComponent from "@/components/custom/ImageCropperComponent";
import type { AxiosError } from "axios";

const STEPS = [
  { title: "Thông tin", description: "Hồ sơ tổ chức", icon: Building },
  { title: "Gói dịch vụ", description: "Chọn quy mô", icon: CreditCard },
  { title: "Hoàn tất", description: "Kiểm tra & Tạo", icon: ShieldCheck },
];

const PLANS = [
  {
    id: "BASIC" as const,
    name: "Gói Basic",
    description: "Phù hợp trung tâm nhỏ",
    price: "300k",
    period: "1 tháng",
    limit: "3000 chứng chỉ 1 năm",
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
    price: "2 triệu",
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
    price: "10 triệu",
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
  borderActive: string;
  iconBg: string;
  iconBgActive: string;
  title: string;
  price: string;
  badge: string;
  desc: string;
}> = {
  BASIC: {
    border: "hover:border-slate-400 hover:shadow-slate-200 hover:-translate-y-1 border-gray-100",
    borderActive: "border-slate-500 bg-slate-50/70 shadow-slate-200 ring-4 ring-slate-500/10 -translate-y-1",
    iconBg: "bg-slate-100 text-slate-500",
    iconBgActive: "bg-slate-600 text-white",
    title: "text-slate-800",
    price: "text-slate-800",
    badge: "bg-slate-600 text-white",
    desc: "text-slate-500",
  },
  PRO: {
    border: "hover:border-emerald-400 hover:shadow-emerald-200 hover:-translate-y-2 border-emerald-100",
    borderActive: "border-emerald-500 bg-emerald-50/90 shadow-emerald-200 shadow-xl ring-4 ring-emerald-500/20 -translate-y-2",
    iconBg: "bg-emerald-100 text-emerald-500",
    iconBgActive: "bg-emerald-500 text-white",
    title: "text-emerald-700",
    price: "text-emerald-700",
    badge: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
    desc: "text-emerald-600/80",
  },
  ENTERPRISE: {
    border: "hover:border-indigo-400 hover:shadow-indigo-200 hover:-translate-y-1 border-indigo-100",
    borderActive: "border-indigo-500 bg-indigo-50/70 shadow-indigo-200 ring-4 ring-indigo-500/10 -translate-y-1",
    iconBg: "bg-indigo-100 text-indigo-500",
    iconBgActive: "bg-indigo-600 text-white",
    title: "text-indigo-800",
    price: "text-indigo-800",
    badge: "bg-indigo-600 text-white",
    desc: "text-indigo-500/80",
  }
};

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1", 10);

  const setStep = (newStep: number) => {
    setSearchParams({ step: newStep.toString() }, { replace: true });
  };

  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: "",
    code: "",
    domain: "",
    description: "",
    legalName: "",
    taxCode: "",
    legalAddress: "",
    representativeName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    servicePlan: "BASIC",
  });

  // Logo file state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    legal: true,
    contact: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/usr/organizations");
    }
  };

  /* ── Logo upload handlers ── */
  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropperSrc(objectUrl);
    setCropperOpen(true);

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleCropperClose = () => {
    setCropperOpen(false);
    if (cropperSrc) {
      URL.revokeObjectURL(cropperSrc);
      setCropperSrc("");
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setCropperOpen(false);
    if (cropperSrc) {
      URL.revokeObjectURL(cropperSrc);
      setCropperSrc("");
    }

    setLogoFile(croppedFile);
    // Create preview URL
    const previewUrl = URL.createObjectURL(croppedFile);
    // Revoke old preview
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(previewUrl);
  };

  /* ── Submit ── */
  const handleConfirm = async () => {
    if (!logoFile) {
      toast.error("Vui lòng tải lên logo cho tổ chức");
      return;
    }

    setSubmitting(true);
    try {
      await createOrganizationApi(formData, logoFile);
      toast.success("Tạo tổ chức thành công!");
      navigate("/usr/organizations");
    } catch (error) {
      const axiosError = error as AxiosError<{ errorMessage?: string }>;
      const message =
        axiosError.response?.data?.errorMessage || "Tạo tổ chức thất bại";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Progress Header ── */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Tạo tổ chức mới
            </h2>
            <p className="text-gray-500">
              Hoàn thành các bước dưới đây để thiết lập tổ chức của bạn.
            </p>
          </div>
          <span className="text-sm font-medium text-gray-500">
            Bước {step} trên {STEPS.length}
          </span>
        </div>
        {/* <Progress value={progress} className="h-2" /> */}

        <div className="grid grid-cols-3 gap-4 pt-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i + 1;
            const isCompleted = step > i + 1;
            return (
              <div key={i} className="space-y-2">
                <div
                  className={cn(
                    "h-1.5 w-full rounded-full transition-all duration-500",
                    isCompleted
                      ? "bg-primary"
                      : isActive
                        ? "bg-primary/80"
                        : "bg-gray-100",
                  )}
                />
                <div
                  className={cn(
                    "flex flex-col items-center md:items-start gap-1 transition-colors",
                    isActive || isCompleted ? "text-primary" : "text-gray-400",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={14}
                      className={cn(isActive && "animate-pulse")}
                    />
                    <p className="hidden md:block uppercase text-[0.65rem] font-bold tracking-widest">
                      {s.title}
                    </p>
                  </div>
                  <p className="hidden md:block text-[0.75rem] font-medium leading-none opacity-80">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="min-h-100">
        {/* Step 1: Consolidated Info with Collapsible Cards */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* General Info Card */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-gray-100">
              <button
                onClick={() => toggleSection("general")}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                    <Building size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">Thông tin chung</h3>
                </div>
                {expandedSections.general ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              {expandedSections.general && (
                <div className="p-6 space-y-6 border-t animate-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Tên tổ chức <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ví dụ: Công ty Công nghệ InnoGreen"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">
                        Mã tổ chức <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="code"
                        placeholder="Ví dụ: INNOGREEN_CORP"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                      />
                      <p className="text-[0.7rem] text-gray-500 italic">
                        Chỉ gồm A-Z, 0-9, _ và -
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain (Tùy chọn)</Label>
                      <div className="relative">
                        <Globe
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <Input
                          id="domain"
                          placeholder="innogreen.com"
                          className="pl-10"
                          value={formData.domain}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              domain: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label>
                        Logo tổ chức <span className="text-red-500">*</span>
                      </Label>
                      <div
                        onClick={handleLogoClick}
                        className="group relative flex items-center gap-4 p-4 border-2 border-dashed border-primary-100 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50/40 transition-all"
                      >
                        <div className="h-14 w-14 rounded-lg bg-primary-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-primary-100 transition-colors">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                            {logoFile ? logoFile.name : "Nhấn để tải logo"}
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG — tối đa 5MB
                          </p>
                        </div>
                        <Camera className="ml-auto h-5 w-5 text-gray-300 group-hover:text-primary/80 transition-colors" />
                      </div>
                      <input
                        type="file"
                        ref={logoInputRef}
                        className="hidden"
                        accept="image/*"
                        title="Tải logo tổ chức"
                        onChange={handleLogoFileChange}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
                      <textarea
                        id="description"
                        className="w-full min-h-20 text-sm p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Giới thiệu ngắn gọn về tổ chức..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legal Info Card */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-gray-100">
              <button
                onClick={() => toggleSection("legal")}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                    <FileText size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">Thông tin pháp lý</h3>
                </div>
                {expandedSections.legal ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              {expandedSections.legal && (
                <div className="p-6 space-y-6 border-t animate-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="legalName">
                        Tên pháp lý đầy đủ{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="legalName"
                        placeholder="Tên trên giấy đăng ký kinh doanh"
                        value={formData.legalName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legalName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxCode">
                        Mã số thuế <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="taxCode"
                        placeholder="10 hoặc 13 chữ số"
                        value={formData.taxCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            taxCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="representative">
                        Người đại diện (Tùy chọn)
                      </Label>
                      <Input
                        id="representative"
                        placeholder="Họ và tên"
                        value={formData.representativeName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            representativeName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="legalAddress">
                        Địa chỉ pháp lý <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="legalAddress"
                        placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                        value={formData.legalAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legalAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info Card */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-gray-100">
              <button
                onClick={() => toggleSection("contact")}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                    <User size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">Thông tin liên hệ</h3>
                </div>
                {expandedSections.contact ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              {expandedSections.contact && (
                <div className="p-6 space-y-6 border-t animate-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contactName">
                        Tên người liên hệ{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactName"
                        placeholder="Họ và tên người quản lý"
                        value={formData.contactName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">
                        Email liên hệ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="example@company.com"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">
                        Số điện thoại <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactPhone"
                        placeholder="+84..."
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Service Plans */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-2 duration-300 md:items-end">
            {PLANS.map((p) => {
              const styles = PLAN_STYLES[p.id];
              const isSelected = formData.servicePlan === p.id;
              
              return (
              <div
                key={p.id}
                onClick={() => setFormData({ ...formData, servicePlan: p.id })}
                className={cn(
                  "relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                  isSelected
                    ? styles.borderActive
                    : cn("bg-white", styles.border)
                )}
              >
                {p.popular && (
                  <span className={cn("absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-full", styles.badge)}>
                    Khuyên dùng
                  </span>
                )}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors mx-auto shadow-sm",
                    isSelected ? styles.iconBgActive : styles.iconBg,
                  )}
                >
                  <p.icon size={24} />
                </div>
                <h4 className={cn("font-extrabold mb-2 text-center text-xl", styles.title)}>{p.name}</h4>
                <p className={cn("text-[0.85rem] italic mb-4 text-center px-4", styles.desc)}>{p.description}</p>
                
                <div className={cn("text-center mb-4 transition-colors", styles.price)}>
                  <span className="text-2xl font-black">{p.price}</span>
                  <span className="text-[0.95rem] font-semibold ml-1 opacity-80">{p.period}</span>
                </div>
                
                <p className={cn("text-[0.95rem] font-bold mb-6 text-center pb-6 border-b border-gray-100", styles.title)}>{p.limit}</p>

                <div className="space-y-4 mt-auto px-2">
                  <div>
                    <h5 className={cn("font-bold text-[0.95rem] mb-3 text-center", styles.title)}>Bao gồm:</h5>
                    <div className="space-y-2.5 flex flex-col items-center">
                      {p.includes.map((f, i) => (
                        <div key={i} className="flex items-center text-[0.9rem] text-gray-600 text-center gap-2">
                          <Check size={14} className={isSelected ? styles.title : "text-gray-300"} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h5 className={cn("font-bold text-[0.95rem] mb-3 mt-4 text-center", styles.title)}>Hỗ trợ</h5>
                    <div className="space-y-2.5 flex flex-col items-center">
                      {p.support.map((f, i) => (
                        <div key={i} className="flex items-center text-[0.9rem] text-gray-600 text-center gap-2">
                          <Check size={14} className={isSelected ? styles.title : "text-gray-300"} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <Building size={16} /> Thông tin tổ chức
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Tên:</p>
                    <p className="font-bold">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Mã:</p>
                    <p className="font-bold">{formData.code}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Pháp lý:</p>
                    <p className="font-bold">{formData.legalName}</p>
                  </div>
                  {logoPreview && (
                    <div className="col-span-2 flex items-center gap-3">
                      <p className="text-gray-500">Logo:</p>
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="h-10 w-10 rounded-lg object-cover border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <User size={16} /> Liên hệ & Gói
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Người liên hệ:</p>
                    <p className="font-bold">{formData.contactName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gói:</p>
                    <p className="font-bold text-primary-700">
                      {PLANS.find((p) => p.id === formData.servicePlan)?.name}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Email:</p>
                    <p className="font-bold">{formData.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex gap-3">
              <Info className="h-5 w-5 shrink-0" />
              <p>
                Vui lòng kiểm tra kỹ các thông tin pháp lý. Sau khi tạo, một số
                thông tin quan trọng sẽ cần quy trình xác minh để thay đổi.
              </p>
            </div>

            <div className="p-4 bg-primary-50/40 border border-primary-100 rounded-lg text-sm text-primary-800 leading-relaxed flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <p>
                Bằng việc nhấn <strong>Xác nhận</strong>, bạn đồng ý với các
                Điều khoản dịch vụ và Chính sách quyền riêng tư của IGC
                Platform.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2 text-gray-600 hover:text-gray-900"
          disabled={submitting}
        >
          <ChevronLeft size={18} />
          {step === 1 ? "Quay lại danh sách" : "Quay lại"}
        </Button>

        <div className="flex gap-3">
          {step < STEPS.length ? (
            <Button
              onClick={handleNext}
              className="gap-2 min-w-30 bg-primary-600 hover:bg-primary-700 shadow-sm"
            >
              Tiếp tục
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={submitting}
              className="gap-2 min-w-35 bg-primary-600 hover:bg-primary-700 shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Xác nhận tạo
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* ── Image Cropper Modal ── */}
      <ImageCropperComponent
        imageSrc={cropperSrc}
        open={cropperOpen}
        onClose={handleCropperClose}
        onCropComplete={handleCropComplete}
        outputSize={300}
      />
    </div>
  );
}
