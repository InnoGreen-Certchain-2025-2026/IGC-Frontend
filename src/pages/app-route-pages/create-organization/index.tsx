import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateOrganizationRequest } from "@/types/organization/CreateOrganizationRequest";

const STEPS = [
  { title: "Thông tin", description: "Hồ sơ tổ chức", icon: Building },
  { title: "Gói dịch vụ", description: "Chọn quy mô", icon: CreditCard },
  { title: "Hoàn tất", description: "Kiểm tra & Tạo", icon: ShieldCheck },
];

const PLANS = [
  {
    id: "free",
    name: "Cá nhân (Miễn phí)",
    description: "Phù hợp cho cá nhân khởi đầu",
    price: "0đ",
    features: ["Tối đa 5 bằng cấp/tháng", "Xác thực cơ bản", "Hỗ trợ cộng đồng"],
    icon: Building2,
  },
  {
    id: "pro",
    name: "Chuyên nghiệp",
    description: "Dành cho các tổ chức giáo dục vừa",
    price: "990.000đ/tháng",
    features: ["Bằng cấp không giới hạn", "Tùy chỉnh thương hiệu", "Hỗ trợ 24/7"],
    icon: Zap,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Doanh nghiệp",
    description: "Giải pháp toàn diện cho tập đoàn",
    price: "Liên hệ",
    features: ["API tích hợp", "Quản lý nhiều chi nhánh", "Bảo mật nâng cao"],
    icon: ShieldCheck,
  },
];

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1", 10);

  const setStep = (newStep: number) => {
    setSearchParams({ step: newStep.toString() }, { replace: true });
  };

  const [formData, setFormData] = useState<CreateOrganizationRequest & { plan: string }>({
    name: "",
    code: "",
    domain: "",
    logoUrl: "",
    description: "",
    legalName: "",
    taxCode: "",
    legalAddress: "",
    representativeName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    plan: "free",
  });

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    legal: true,
    contact: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const progress = (step / STEPS.length) * 100;

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/user-dashboard/organizations");
    }
  };

  const handleConfirm = () => {
    console.log("Confirming organization creation:", formData);
    // Mock success and redirect
    navigate("/user-dashboard/organizations");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Progress Header ── */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tạo tổ chức mới</h2>
            <p className="text-gray-500">Hoàn thành các bước dưới đây để thiết lập tổ chức của bạn.</p>
          </div>
          <span className="text-sm font-medium text-gray-500">
            Bước {step} trên {STEPS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="grid grid-cols-3 gap-4 pt-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i + 1;
            const isCompleted = step > i + 1;
            return (
              <div key={i} className="space-y-2">
                <div className={cn(
                  "h-1.5 w-full rounded-full transition-all duration-500",
                  isCompleted ? "bg-blue-600" : isActive ? "bg-blue-400" : "bg-gray-100"
                )} />
                <div className={cn(
                  "flex flex-col items-center md:items-start gap-1 transition-colors",
                  isActive || isCompleted ? "text-blue-600" : "text-gray-400"
                )}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={cn(isActive && "animate-pulse")} />
                    <p className="hidden md:block uppercase text-[0.65rem] font-bold tracking-widest">{s.title}</p>
                  </div>
                  <p className="hidden md:block text-[0.75rem] font-medium leading-none opacity-80">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="min-h-[400px]">
          {/* Step 1: Consolidated Info with Collapsible Cards */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* General Info Card */}
              <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-gray-100">
                <button 
                  onClick={() => toggleSection('general')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Building size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900">Thông tin chung</h3>
                  </div>
                  {expandedSections.general ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                {expandedSections.general && (
                  <div className="p-6 space-y-6 border-t animate-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tên tổ chức <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          placeholder="Ví dụ: Công ty Công nghệ InnoGreen"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Mã tổ chức <span className="text-red-500">*</span></Label>
                        <Input
                          id="code"
                          placeholder="Ví dụ: INNOGREEN_CORP"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        />
                        <p className="text-[0.7rem] text-gray-500 italic">Chỉ gồm A-Z, 0-9, _ và -</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="domain">Domain (Tùy chọn)</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <Input
                            id="domain"
                            placeholder="innogreen.com"
                            className="pl-10"
                            value={formData.domain}
                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">URL Logo (Tùy chọn)</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <Input
                            id="logoUrl"
                            placeholder="https://..."
                            className="pl-10"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
                        <textarea
                          id="description"
                          className="w-full min-h-[80px] text-sm p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Giới thiệu ngắn gọn về tổ chức..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Legal Info Card */}
              <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-gray-100">
                <button 
                  onClick={() => toggleSection('legal')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <FileText size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900">Thông tin pháp lý</h3>
                  </div>
                  {expandedSections.legal ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                {expandedSections.legal && (
                  <div className="p-6 space-y-6 border-t animate-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="legalName">Tên pháp lý đầy đủ <span className="text-red-500">*</span></Label>
                        <Input
                          id="legalName"
                          placeholder="Tên trên giấy đăng ký kinh doanh"
                          value={formData.legalName}
                          onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxCode">Mã số thuế <span className="text-red-500">*</span></Label>
                        <Input
                          id="taxCode"
                          placeholder="10 hoặc 13 chữ số"
                          value={formData.taxCode}
                          onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="representative">Người đại diện (Tùy chọn)</Label>
                        <Input
                          id="representative"
                          placeholder="Họ và tên"
                          value={formData.representativeName}
                          onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="legalAddress">Địa chỉ pháp lý <span className="text-red-500">*</span></Label>
                        <Input
                          id="legalAddress"
                          placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                          value={formData.legalAddress}
                          onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info Card */}
              <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-gray-100">
                <button 
                  onClick={() => toggleSection('contact')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900">Thông tin liên hệ</h3>
                  </div>
                  {expandedSections.contact ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                {expandedSections.contact && (
                  <div className="p-6 space-y-6 border-t animate-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="contactName">Tên người liên hệ <span className="text-red-500">*</span></Label>
                        <Input
                          id="contactName"
                          placeholder="Họ và tên người quản lý"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email liên hệ <span className="text-red-500">*</span></Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="example@company.com"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Số điện thoại <span className="text-red-500">*</span></Label>
                        <Input
                          id="contactPhone"
                          placeholder="+84..."
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-2 duration-300">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setFormData({ ...formData, plan: p.id })}
                  className={cn(
                    "relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md",
                    formData.plan === p.id 
                      ? "border-blue-600 bg-blue-50/30" 
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[0.65rem] font-bold uppercase tracking-wider rounded-full">
                      Khuyên dùng
                    </span>
                  )}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
                    formData.plan === p.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    <p.icon size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{p.name}</h4>
                  <p className="text-xs text-gray-500 mb-4">{p.description}</p>
                  <p className="text-lg font-bold text-gray-900 mb-4">{p.price}</p>
                  
                  <div className="space-y-2 mt-auto">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[0.75rem] text-gray-600">
                        <Check size={12} className="text-green-500 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
                      <p className="font-bold text-blue-600">{PLANS.find(p => p.id === formData.plan)?.name}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Email:</p>
                      <p className="font-bold">{formData.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex gap-3">
                <Info className="h-5 w-5 flex-shrink-0" />
                <p>Vui lòng kiểm tra kỹ các thông tin pháp lý. Sau khi tạo, một số thông tin quan trọng sẽ cần quy trình xác minh để thay đổi.</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 leading-relaxed flex gap-3">
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                <p>Bằng việc nhấn <strong>Xác nhận</strong>, bạn đồng ý với các Điều khoản dịch vụ và Chính sách quyền riêng tư của IGC Platform.</p>
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
        >
          <ChevronLeft size={18} />
          {step === 1 ? "Quay lại danh sách" : "Quay lại"}
        </Button>

        <div className="flex gap-3">
          {step < STEPS.length ? (
            <Button
              onClick={handleNext}
              className="gap-2 min-w-[120px] bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Tiếp tục
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              className="gap-2 min-w-[140px] bg-green-600 hover:bg-green-700 shadow-md"
            >
              <Check size={18} />
              Xác nhận tạo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
