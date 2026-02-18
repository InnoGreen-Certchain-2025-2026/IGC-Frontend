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
  const [regDob, setRegDob] = useState("2010-01-01");
  const [regGender, setRegGender] = useState("MALE");

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
      navigate("/user-dashboard");
    } catch (err: any) {
      toast.error(err || "Đăng nhập thất bại");
    }
  };

  const handleRegister = async () => {
    if (
      !regName ||
      !regEmail ||
      !regPassword ||
      !regPhone ||
      !regAddress ||
      !regDob ||
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
          dob: regDob,
          gender: regGender as any,
          password: regPassword,
        }),
      ).unwrap();
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      handleTabChange("sign-in");
      // Pre-fill login email
      setLoginEmail(regEmail);
      setLoginPassword("");
    } catch (err: any) {
      toast.error(err || "Đăng ký thất bại");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#002B5B] flex-col justify-between p-12 text-white overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link
            to="/landing-page"
            className="flex items-center space-x-3 mb-16 group"
          >
            <img
              src="/favicon/web-logo.png"
              alt="IGC Logo"
              className="h-12 w-12 object-contain shadow-xl shadow-blue-900/50 group-hover:scale-105 transition-transform rounded-xl"
            />
            <span className="text-3xl font-black tracking-tighter text-white border-l-2 border-white/20 pl-4">
              IGC
            </span>
          </Link>

          <div className="space-y-8 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Blockchain Verified</span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
              Kỷ Nguyên Mới Cho <br />
              <span className="text-blue-400">Chứng Chỉ Số</span>
            </h1>

            <p className="text-xl text-blue-100/80 leading-relaxed font-medium">
              Chào mừng bạn đến với hệ sinh thái xác minh chứng chỉ toàn cầu.
              Mọi dữ liệu của bạn đều được bảo mật và bất biến trên nền tảng
              Blockchain.
            </p>

            <div className="grid grid-cols-1 gap-6 pt-8">
              {[
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Tính Toàn Cầu",
                  desc: "Xác minh mọi lúc, mọi nơi trên thế giới.",
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Tốc Độ Tức Thì",
                  desc: "Nhận kết quả xác minh chỉ trong vài giây.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-800/50 flex items-center justify-center text-blue-400">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-blue-200/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-blue-300/50 pt-12">
          © 2026 InnoGreen Certchain. All rights reserved.
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        {/* Mobile Logo & Back Button */}
        <div className="lg:hidden p-6 flex items-center justify-between bg-white border-b border-gray-100">
          <Link to="/landing-page" className="flex items-center space-x-2">
            <img
              src="/favicon/web-logo.png"
              alt="IGC Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-black tracking-tighter text-blue-900">
              IGC
            </span>
          </Link>
          <Link
            to="/landing-page"
            className="text-sm font-medium text-gray-500 flex items-center hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Trang chủ
          </Link>
        </div>

        {/* Auth Form Container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md border-none shadow-2xl shadow-blue-500/5 bg-white overflow-hidden rounded-2xl">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
            <CardHeader className="space-y-2 pt-8 text-center">
              <CardTitle className="text-3xl font-black text-blue-900 tracking-tight">
                {activeTab === "sign-in" ? "Đăng Nhập" : "Đăng Ký"}
              </CardTitle>
              <CardDescription className="text-gray-500 font-medium">
                {activeTab === "sign-in"
                  ? "Rất vui được gặp lại bạn!"
                  : "Bắt đầu hành trình chứng chỉ số của bạn ngay."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-8 p-1.5 bg-gray-100 rounded-xl">
                <button
                  onClick={() => handleTabChange("sign-in")}
                  className={`py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    activeTab === "sign-in"
                      ? "bg-white text-blue-600 shadow-md transform scale-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => handleTabChange("sign-up")}
                  className={`py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    activeTab === "sign-up"
                      ? "bg-white text-blue-600 shadow-md transform scale-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Đăng Ký
                </button>
              </div>

              {activeTab === "sign-in" ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      Email công việc <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-xs font-bold uppercase tracking-wider text-gray-400"
                      >
                        Mật khẩu <span className="text-red-500">*</span>
                      </Label>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-xl text-lg font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang
                        xử lý...
                      </>
                    ) : (
                      "Tiếp tục"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullname"
                      className="text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullname"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-email"
                      className="text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-phone"
                      className="text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-address"
                      className="text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      Địa chỉ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reg-address"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="dob"
                        className="text-xs font-bold uppercase tracking-wider text-gray-400"
                      >
                        Ngày sinh <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className="text-xs font-bold uppercase tracking-wider text-gray-400"
                      >
                        Giới tính <span className="text-red-500">*</span>
                      </Label>
                      <Select value={regGender} onValueChange={setRegGender}>
                        <SelectTrigger
                          id="gender"
                          className="h-11 border-gray-200 focus:border-blue-500 rounded-xl"
                        >
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Nam</SelectItem>
                          <SelectItem value="FEMALE">Nữ</SelectItem>
                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-password"
                      className="text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                        className="h-11 border-gray-200 focus:border-blue-500 rounded-xl pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-xl text-lg font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] mt-2 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {registerLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang
                        xử lý...
                      </>
                    ) : (
                      "Tạo tài khoản"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4 pb-8">
              <div className="text-sm font-medium text-center text-gray-400">
                {activeTab === "sign-in" ? (
                  <>
                    Bạn chưa có tài khoản?{" "}
                    <button
                      onClick={() => handleTabChange("sign-up")}
                      className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                    >
                      Đăng ký miễn phí
                    </button>
                  </>
                ) : (
                  <>
                    Bạn đã có tài khoản?{" "}
                    <button
                      onClick={() => handleTabChange("sign-in")}
                      className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                    >
                      Đăng nhập ngay
                    </button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
