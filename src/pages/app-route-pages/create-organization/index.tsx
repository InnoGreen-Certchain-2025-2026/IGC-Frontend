import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Building2, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Thông tin cơ bản", description: "Tên tổ chức" },
  { title: "Gói dịch vụ", description: "Chọn quy mô" },
  { title: "Xác nhận", description: "Kiểm tra lại" },
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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    plan: "free",
  });

  const progress = (step / STEPS.length) * 100;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/user-dashboard/organizations");
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
        
        <div className="grid grid-cols-3 gap-4 pt-2">
          {STEPS.map((s, i) => (
            <div key={i} className={cn(
              "text-xs font-medium border-t-2 pt-2 transition-colors",
              step > i ? "border-blue-600 text-blue-600" : "border-gray-200 text-gray-400"
            )}>
              <p className="uppercase tracking-wider">{s.title}</p>
              <p className="font-semibold text-[0.85rem] mt-0.5">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Step Content ── */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="pt-8 pb-8 px-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="orgName" className="text-base">Tên tổ chức</Label>
                <Input
                  id="orgName"
                  placeholder="Ví dụ: Đại học Bách Khoa, InnoGreen Academy..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-lg"
                />
                <p className="text-sm text-gray-500">
                  Tên này sẽ hiển thị trên tất cả các bằng cấp mà bạn phát hành.
                </p>
              </div>
            </div>
          )}

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

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Tóm tắt thông tin</h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <div>
                    <dt className="text-sm text-gray-500">Tên tổ chức</dt>
                    <dd className="text-lg font-bold text-gray-900">{formData.name || "Chưa nhập tên"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Gói dịch vụ đã chọn</dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {PLANS.find(p => p.id === formData.plan)?.name}
                    </dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-sm text-gray-500 mb-1">Trạng thái</dt>
                    <dd className="flex items-center gap-2 text-amber-600 font-medium italic">
                      <Zap size={16} /> Đang chờ xác nhận thiết lập
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 leading-relaxed flex gap-3">
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                <p>Bằng việc nhấn <strong>Xác nhận</strong>, bạn đồng ý với các Điều khoản dịch vụ và Chính sách quyền riêng tư của IGC Platform dành cho tổ chức.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={step === 1 && !formData.name.trim()}
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
