import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  ArrowLeft,
  Globe,
  Zap,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { executeLogin } from "@/features/auth/authThunk";
import { executeRegister } from "@/features/auth/authThunk";
import { clearError } from "@/features/auth/authSlice";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "sign-in";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.auth);

  // Validate mode
  const activeTab = mode === "sign-in" || mode === "sign-up" ? mode : "sign-in";

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regGender, setRegGender] = useState<"MALE" | "FEMALE" | "OTHER">(
    "MALE",
  );

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Register loading (separate from auth slice since register is void)
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleTabChange = (newMode: string) => {
    dispatch(clearError());
    setSearchParams({ mode: newMode });
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    try {
      await dispatch(
        executeLogin({ email: loginEmail, password: loginPassword }),
      ).unwrap();
      toast.success("Đăng nhập thành công!");
      navigate("/usr");
    } catch (err: unknown) {
      toast.error((err as string) || "Đăng nhập thất bại");
    }
  };

  const handleRegister = async () => {
    if (
      !regName ||
      !regEmail ||
      !regPassword ||
      !regPhone ||
      !regAddress ||
      !regGender
    ) {
      toast.error("Vui lòng nhập đầy đủ tất cả thông tin.");
      return;
    }
    setRegisterLoading(true);
    try {
      await dispatch(
        executeRegister({
          name: regName,
          email: regEmail,
          phoneNumber: regPhone,
          address: regAddress,
          dob: "2010-01-01",
          gender: regGender,
          password: regPassword,
        }),
      ).unwrap();
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      handleTabChange("sign-in");
      // Pre-fill login email
      setLoginEmail(regEmail);
      setLoginPassword("");
    } catch (err: unknown) {
      toast.error((err as string) || "Đăng ký thất bại");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col justify-between p-16 text-white overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-160 h-160 bg-primary-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-120 h-120 bg-accent-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 mb-24 group">
            <img
              src="/favicon/web-logo.png"
              alt="IGC Logo"
              className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col -space-y-1 border-l border-white/20 pl-4">
              <span className="text-3xl font-black tracking-tighter text-white font-display italic uppercase">
                InnoGreen
              </span>
              <span className="text-[8px] font-black tracking-[0.4em] uppercase text-primary-400">Certchain Platform</span>
            </div>
          </Link>

          <div className="space-y-10 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 text-primary-400 border border-white/10 text-[10px] font-black tracking-widest uppercase font-display">
              <ShieldCheck className="w-4 h-4" />
              <span>Next-Gen Verification</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter text-white">
              Kỷ Nguyên Mới Cho <br />
              <span className="text-white">Chứng Chỉ </span>
              <span className="text-accent-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase italic">Số</span>
            </h1>

            <p className="text-xl text-slate-200 leading-relaxed font-medium">
              Chào mừng bạn đến với hệ sinh thái xác minh chứng chỉ toàn cầu.
              Mọi dữ liệu của bạn đều được bảo mật và bất biến trên nền tảng
              Blockchain.
            </p>

            <div className="grid grid-cols-1 gap-10 pt-10">
              {[
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Mạng Lưới Toàn Cầu",
                  desc: "Xác minh mọi lúc, mọi nơi trên thế giới chỉ với một click chuột.",
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Tốc Độ & Bảo Mật",
                  desc: "Dữ liệu được mã hóa bất biến, xử lý tức thì trên công nghệ Blockchain.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-5">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-primary-400 shadow-xl shadow-black/20">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-white mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-slate-300 font-medium leading-relaxed max-w-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 pt-12">
          © 2026 InnoGreen Certchain • Immutable Digital Identity
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col mesh-bg relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/favicon/web-logo.png"
              alt="IGC Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
              InnoGreen
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Link>
        </div>

        {/* Back Button Desktop */}
        <div className="hidden lg:block absolute top-8 right-8 z-10">
           <Button variant="ghost" asChild className="rounded-full px-6 font-bold text-slate-400 hover:text-slate-900">
             <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Trang chủ</Link>
           </Button>
        </div>

        {/* Auth Form Area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto no-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] overflow-hidden">
              <CardHeader className="space-y-3 pt-12 pb-8 text-center px-10">
                <CardTitle className="text-4xl font-black text-slate-950 tracking-tight">
                  {activeTab === "sign-in" ? "Đăng Nhập" : "Đăng Ký"}
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium text-lg leading-snug">
                  {activeTab === "sign-in"
                    ? "Rất vui được gặp lại bạn!"
                    : "Khởi tạo danh tính số của bạn ngay."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-10 pb-10">
                <div className="grid grid-cols-2 gap-2 mb-10 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => handleTabChange("sign-in")}
                    className={`py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      activeTab === "sign-in"
                        ? "bg-white text-primary-600 shadow-xl shadow-slate-200/50"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Đăng Nhập
                  </button>
                  <button
                    onClick={() => handleTabChange("sign-up")}
                    className={`py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      activeTab === "sign-up"
                        ? "bg-white text-primary-600 shadow-xl shadow-slate-200/50"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Đăng Ký
                  </button>
                </div>

                {activeTab === "sign-in" ? (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1"
                      >
                        Email công việc <span className="text-accent-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@innogreen.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-lg font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pl-1">
                        <Label
                          htmlFor="password"
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                        >
                          Mật khẩu <span className="text-accent-500">*</span>
                        </Label>
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-accent-500 transition-colors">
                          Quên mật khẩu?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-lg font-medium pr-12 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-slate-950 hover:bg-black h-16 rounded-2xl text-lg font-black shadow-2xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Đang xử lý...
                        </>
                      ) : (
                        "Tiếp tục"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullname"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >
                        Họ và tên <span className="text-accent-500">*</span>
                      </Label>
                      <Input
                        id="fullname"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary-500 rounded-2xl font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-email"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >
                        Email <span className="text-accent-500">*</span>
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary-500 rounded-2xl font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="reg-phone"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                          >
                            Điện thoại <span className="text-accent-500">*</span>
                          </Label>
                          <Input
                            id="reg-phone"
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary-500 rounded-2xl font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="gender"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                          >
                            Giới tính <span className="text-accent-500">*</span>
                          </Label>
                          <Select
                            value={regGender}
                            onValueChange={(val) =>
                              setRegGender(val as "MALE" | "FEMALE" | "OTHER")
                            }
                          >
                            <SelectTrigger
                              id="gender"
                              className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl text-slate-700 font-medium"
                            >
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                              <SelectItem value="MALE">Nam</SelectItem>
                              <SelectItem value="FEMALE">Nữ</SelectItem>
                              <SelectItem value="OTHER">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-address"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >
                        Địa chỉ cư trú <span className="text-accent-500">*</span>
                      </Label>
                      <Input
                        id="reg-address"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary-500 rounded-2xl font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-password"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >
                        Mật khẩu bảo mật <span className="text-accent-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                          className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary-500 rounded-2xl font-medium pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showRegPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleRegister}
                      disabled={registerLoading}
                      className="w-full bg-slate-950 hover:bg-black h-16 rounded-2xl text-lg font-black shadow-2xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 mt-4"
                    >
                      {registerLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Đang xử lý...
                        </>
                      ) : (
                        "Tạo tài khoản"
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-6 pt-4 pb-12 px-10 border-t border-slate-50">
                <div className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest leading-relaxed px-4">
                  {activeTab === "sign-in" ? (
                    <>
                      Bạn chưa có tài khoản?{" "}
                      <button
                        onClick={() => handleTabChange("sign-up")}
                        className="text-primary-600 font-black hover:text-accent-500 transition-colors"
                      >
                        Đăng ký ngay
                      </button>
                    </>
                  ) : (
                    <>
                      Bạn đã có tài khoản?{" "}
                      <button
                        onClick={() => handleTabChange("sign-in")}
                        className="text-primary-600 font-black hover:text-accent-500 transition-colors"
                      >
                        Đăng nhập
                      </button>
                    </>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
