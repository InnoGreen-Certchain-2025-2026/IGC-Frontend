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
import { useTranslation } from "react-i18next";
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
import { executeRegister, executeLogin } from "@/features/auth/authThunk";
import { clearError, setTokens } from "@/features/auth/authSlice";
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { getCognitoUser, userPool } from "@/services/cognitoService";
import { QRCodeSVG } from "qrcode.react";
import axiosInstance from "@/lib/axiosInstance";

export default function AuthPage() {
  const { t, i18n } = useTranslation();
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
  const [regCitizenIdNumber, setRegCitizenIdNumber] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regGender, setRegGender] = useState<"MALE" | "FEMALE" | "OTHER">(
    "MALE",
  );

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Register loading (separate from auth slice since register is void)
  const [registerLoading, setRegisterLoading] = useState(false);

  // Cognito MFA State
  const [mfaStep, setMfaStep] = useState<"NONE" | "SETUP" | "VERIFY" | "CONFIRM_SIGNUP">("NONE");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaQrCode, setMfaQrCode] = useState("");
  const [cognitoUserRef, setCognitoUserRef] = useState<CognitoUser | null>(null);
  const [pendingRegData, setPendingRegData] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    citizenIdNumber: string;
    dob: string;
    gender: "MALE" | "FEMALE" | "OTHER";
  } | null>(null);

  const handleTabChange = (newMode: string) => {
    dispatch(clearError());
    setSearchParams({ mode: newMode });
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error(t("auth.form.alerts.emailRequired"));
      return;
    }

    const normalizedEmail = loginEmail.toLowerCase();
    const cognitoUser = getCognitoUser(normalizedEmail);
    const authDetails = new AuthenticationDetails({
      Username: normalizedEmail,
      Password: loginPassword,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (result) => {
        const payload = result.getIdToken().payload;
        try {
          const syncRes = await axiosInstance.post("/auth/sync", {
            cognitoSub: payload.sub,
            email: normalizedEmail,
            name: payload.name || normalizedEmail,
          });
          const { accessToken, userSessionResponse } = syncRes.data.data;
          dispatch(setTokens({ accessToken, userSessionResponse }));
          setLoginEmail("");
          setLoginPassword("");
          toast.success("Đăng nhập thành công!");
          navigate("/usr");
        } catch {
          toast.error("Lỗi đồng bộ dữ liệu tài khoản.");
        }
      },
      onFailure: async (err) => {
        if (err.code === "UserNotConfirmedException") {
          toast.warning("Tài khoản chưa được xác nhận, vui lòng kiểm tra email.");
          return;
        }
        // Fallback to local auth
        try {
          await dispatch(executeLogin({ email: normalizedEmail, password: loginPassword })).unwrap();
          setLoginEmail("");
          setLoginPassword("");
          toast.success("Đăng nhập thành công!");
          navigate("/usr");
        } catch (localErr: unknown) {
          toast.error((localErr as string) || "Đăng nhập thất bại");
        }
      },
      mfaSetup: () => {
        // User never set up TOTP — associate software token
        cognitoUser.associateSoftwareToken({
          associateSecretCode: (secretCode) => {
            setMfaQrCode(`otpauth://totp/InnoGreen:${normalizedEmail}?secret=${secretCode}&issuer=InnoGreen`);
            setMfaStep("SETUP");
            setCognitoUserRef(cognitoUser);
          },
          onFailure: (err) => toast.error("Lỗi thiết lập MFA: " + err.message),
        });
      },
      totpRequired: () => {
        setMfaStep("VERIFY");
        setCognitoUserRef(cognitoUser);
      },
    });
  };

  const handleVerifyMfaSetup = () => {
    if (!cognitoUserRef || !mfaCode) return;
    cognitoUserRef.verifySoftwareToken(mfaCode, "SoftwareToken", {
      onSuccess: async () => {
        // If this came from registration, create the local DB user and go to login
        if (pendingRegData) {
          try {
            await dispatch(
              executeRegister({
                name: pendingRegData.name,
                email: pendingRegData.email,
                citizenIdNumber: pendingRegData.citizenIdNumber,
                phoneNumber: pendingRegData.phone,
                address: pendingRegData.address,
                dob: pendingRegData.dob,
                gender: pendingRegData.gender,
                password: pendingRegData.password,
              }),
            ).unwrap();
            const email = pendingRegData.email;
            setPendingRegData(null);
            setMfaStep("NONE");
            setMfaCode("");
            setMfaQrCode("");
            setRegName(""); setRegEmail(""); setRegPassword(""); setRegPhone("");
            setRegAddress(""); setRegCitizenIdNumber(""); setRegDob("");
            toast.success("Đăng ký và thiết lập 2FA thành công! Vui lòng đăng nhập.");
            navigate("/auth?mode=sign-in");
            setLoginEmail(email);
          } catch {
            toast.error("Lỗi tạo tài khoản nội bộ, vui lòng liên hệ hỗ trợ.");
            setPendingRegData(null);
            setMfaStep("NONE");
            setMfaCode("");
          }
        } else {
          toast.success("Thiết lập 2FA thành công! Vui lòng đăng nhập lại.");
          setMfaStep("NONE");
          setMfaCode("");
          navigate("/auth?mode=sign-in");
        }
      },
      onFailure: (err) => toast.error("Mã không đúng: " + err.message),
    });
  };

  const handleVerifyMfaLogin = () => {
    if (!cognitoUserRef || !mfaCode) return;
    cognitoUserRef.sendMFACode(mfaCode, {
      onSuccess: async (result) => {
        const payload = result.getIdToken().payload;
        try {
          const syncRes = await axiosInstance.post("/auth/sync", {
            cognitoSub: payload.sub,
            email: loginEmail.toLowerCase(),
            name: payload.name || loginEmail.toLowerCase(),
          });
          const { accessToken, userSessionResponse } = syncRes.data.data;
          dispatch(setTokens({ accessToken, userSessionResponse }));
          setMfaCode("");
          setMfaStep("NONE");
          setLoginEmail("");
          setLoginPassword("");
          toast.success("Đăng nhập thành công!");
          navigate("/usr");
        } catch {
          toast.error("Lỗi đồng bộ dữ liệu tài khoản.");
        }
      },
      onFailure: (err) => toast.error("Sai mã OTP: " + err.message),
    }, "SOFTWARE_TOKEN_MFA");
  };

  const handleConfirmSignup = () => {
    if (!cognitoUserRef || !mfaCode || !pendingRegData) return;
    cognitoUserRef.confirmRegistration(mfaCode, true, (err) => {
      if (err) {
        toast.error("Mã xác nhận không đúng: " + err.message);
        return;
      }
      // Email confirmed — auto sign-in to trigger TOTP setup
      setMfaCode("");
      const user = getCognitoUser(pendingRegData.email);
      const authDetails = new AuthenticationDetails({
        Username: pendingRegData.email,
        Password: pendingRegData.password,
      });
      user.authenticateUser(authDetails, {
        mfaSetup: () => {
          user.associateSoftwareToken({
            associateSecretCode: (secretCode) => {
              setMfaQrCode(`otpauth://totp/InnoGreen:${pendingRegData.email}?secret=${secretCode}&issuer=InnoGreen`);
              setMfaStep("SETUP");
              setCognitoUserRef(user);
              toast.info("Quét mã QR bằng Google Authenticator để hoàn tất đăng ký.");
            },
            onFailure: (e) => toast.error("Lỗi thiết lập 2FA: " + e.message),
          });
        },
        onSuccess: () => {
          // MFA already configured (edge case) — go straight to login
          toast.success("Xác nhận email thành công! Vui lòng đăng nhập.");
          setMfaStep("NONE");
          setPendingRegData(null);
          handleTabChange("sign-in");
        },
        onFailure: (e) => toast.error("Lỗi xác thực: " + e.message),
      });
    });
  };

  const handleRegister = async () => {
    if (
      !regName ||
      !regEmail ||
      !regPassword ||
      !regPhone ||
      !regAddress ||
      !regGender ||
      !regCitizenIdNumber ||
      !regDob
    ) {
      toast.error(t("auth.form.alerts.fillAll"));
      return;
    }
    if (regCitizenIdNumber.length !== 12) {
      toast.error(t("auth.form.alerts.cccdError"));
      return;
    }
    setRegisterLoading(true);

    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: regEmail }),
      new CognitoUserAttribute({ Name: "name", Value: regName }),
    ];

    userPool.signUp(regEmail, regPassword, attributeList, [], (err, result) => {
      setRegisterLoading(false);
      if (err) {
        toast.error("Đăng ký thất bại: " + err.message);
        return;
      }
      // Save all form data for after OTP confirmation + TOTP setup
      setPendingRegData({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        address: regAddress,
        citizenIdNumber: regCitizenIdNumber,
        dob: regDob,
        gender: regGender,
      });
      setCognitoUserRef(result!.user);
      setMfaStep("CONFIRM_SIGNUP");
      toast.info("Mã xác nhận đã được gửi đến email của bạn.");
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden selection:bg-[#214e41] selection:text-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#214e41] flex-col justify-between p-16 text-white overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-160 h-160 bg-[#f2ce3c]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-120 h-120 bg-[#336b59]/20 rounded-full blur-[100px]" />

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
              <span className="text-[8px] font-black tracking-[0.4em] uppercase text-[#f2ce3c]">Certchain Platform</span>
            </div>
          </Link>

          <div className="space-y-10 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 text-[#f2ce3c] border border-white/10 text-[10px] font-black tracking-widest uppercase font-display">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("auth.sidebar.badge")}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter text-white">
              {t("auth.sidebar.titleLine1")} <br />
              <span className="text-white">{t("auth.sidebar.titleLine2")}</span>
              <span className="text-[#f2ce3c] drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase italic">{t("auth.sidebar.titleLine3")}</span>
            </h1>

            <p className="text-xl text-slate-200 leading-relaxed font-medium">{t("auth.sidebar.subtitle")}</p>

            <div className="grid grid-cols-1 gap-10 pt-10">
              {[
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: t("auth.sidebar.features.0.title"),
                  desc: t("auth.sidebar.features.0.desc"),
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: t("auth.sidebar.features.1.title"),
                  desc: t("auth.sidebar.features.1.desc"),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-5">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[#f2ce3c] shadow-xl shadow-black/20">
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
          {t("auth.sidebar.footer")}
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
            className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center hover:text-[#214e41] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Link>
        </div>

        {/* Back Button Desktop */}
        <div className="hidden lg:flex items-center absolute top-8 right-8 z-10">
          {/* Language Toggle */}
          <button 
            type="button"
            onClick={() => i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi")}
            className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-slate-50 hover:bg-slate-200 border border-slate-200 rounded-2xl transition-colors font-bold text-sm text-slate-800 shadow-sm mr-4"
          >
            {i18n.language === "vi" ? (
               <>
                 <img src="https://flagcdn.com/w40/vn.png" alt="Việt Nam" className="w-5 h-auto rounded-sm" />
                 <span>VI</span>
               </>
            ) : (
               <>
                 <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-5 h-auto rounded-sm" />
                 <span>EN</span>
               </>
            )}
          </button>

           <Button variant="ghost" asChild className="rounded-full px-6 font-bold text-slate-400 hover:text-slate-900">
             <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> {t("auth.form.home")}</Link>
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
                <CardTitle className="text-4xl font-black text-slate-950 tracking-tight"> {activeTab === "sign-in" ? t("auth.form.tabs.signIn") : t("auth.form.tabs.signUp")} </CardTitle>
                <CardDescription className="text-slate-500 font-medium text-lg leading-snug">
                  {activeTab === "sign-in"
                    ? t("auth.form.signInDesc")
                    : t("auth.form.signUpDesc")}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-10 pb-10">
                <div className="grid grid-cols-2 gap-2 mb-10 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => handleTabChange("sign-in")}
                    className={`py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      activeTab === "sign-in"
                        ? "bg-white text-[#214e41] shadow-xl shadow-slate-200/50"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                  >{t("auth.form.tabs.signIn")}</button>
                  <button
                    onClick={() => handleTabChange("sign-up")}
                    className={`py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      activeTab === "sign-up"
                        ? "bg-white text-[#214e41] shadow-xl shadow-slate-200/50"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                  >{t("auth.form.tabs.signUp")}</button>
                </div>

                {activeTab === "sign-in" || mfaStep === "CONFIRM_SIGNUP" || mfaStep === "SETUP" ? (
                  mfaStep === "CONFIRM_SIGNUP" ? (
                    <div className="space-y-6 text-center">
                      <h3 className="text-xl font-bold"> {t("auth.form.mfa.confirmEmail")} </h3>
                      <p className="text-sm text-slate-500">{t("auth.form.mfa.confirmEmailDesc")}<span className="font-bold text-slate-800">{pendingRegData?.email}</span>{t("auth.form.mfa.confirmEmailDesc2")}</p>
                      <Input
                        placeholder={t("auth.form.mfa.enterOtp")}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        className="text-center tracking-[0.5em] font-black text-xl h-14"
                        maxLength={6}
                      />
                      <Button onClick={handleConfirmSignup} className="w-full bg-[#214e41] hover:bg-black h-16 rounded-2xl text-lg font-black shadow-lg">{t("auth.form.mfa.confirmBtn")}</Button>
                      <button onClick={() => { setMfaStep("NONE"); setMfaCode(""); setPendingRegData(null); }} className="text-sm text-[#214e41] font-bold mt-4">{t("auth.form.mfa.cancelBtn")}</button>
                    </div>
                  ) : mfaStep === "SETUP" ? (
                    <div className="space-y-6 text-center">
                      <h3 className="text-xl font-bold">{t("auth.form.mfa.setupTitle")}</h3>
                      <p className="text-sm text-slate-500">{t("auth.form.mfa.setupDesc")}</p>
                      <div className="flex justify-center p-4">
                         {mfaQrCode && <QRCodeSVG value={mfaQrCode} size={200} />}
                      </div>
                      <Input
                        placeholder={t("auth.form.mfa.enterAppCode")}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        className="text-center tracking-[0.5em] font-black text-xl h-14"
                        maxLength={6}
                      />
                      <Button onClick={handleVerifyMfaSetup} className="w-full bg-[#214e41] hover:bg-black h-16 rounded-2xl text-lg font-black shadow-lg">{t("auth.form.mfa.setupBtn")}</Button>
                      <button onClick={() => setMfaStep("NONE")} className="text-sm text-[#214e41] font-bold mt-4">Quay lại</button>
                    </div>
                  ) : mfaStep === "VERIFY" ? (
                    <div className="space-y-6 text-center">
                      <h3 className="text-xl font-bold">{t("auth.form.mfa.verifyTitle")}</h3>
                      <p className="text-sm text-slate-500">{t("auth.form.mfa.verifyDesc")}</p>
                      <Input
                        placeholder="••••••"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        className="text-center tracking-[0.5em] font-black text-xl h-14"
                        maxLength={6}
                      />
                      <Button onClick={handleVerifyMfaLogin} className="w-full bg-[#214e41] hover:bg-black h-16 rounded-2xl text-lg font-black shadow-lg">{t("auth.form.mfa.confirmBtn")}</Button>
                      <button onClick={() => setMfaStep("NONE")} className="text-sm text-[#214e41] font-bold mt-4">{t("auth.form.mfa.cancelBtn")}</button>
                    </div>
                  ) : (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1"
                      >{t("auth.form.fields.email")} <span className="text-[#f2ce3c]">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("auth.form.fields.placeholders.email")}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] focus:ring-4 focus:ring-[#214e41]/10 rounded-2xl text-lg font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pl-1">
                        <Label
                          htmlFor="password"
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                        >{t("auth.form.fields.password")} <span className="text-[#f2ce3c]">*</span>
                        </Label>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#214e41] hover:text-[#f2ce3c] transition-colors">{t("auth.form.fields.forgotPwd")}</button>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] focus:ring-4 focus:ring-[#214e41]/10 rounded-2xl text-lg font-medium pr-12 transition-all"
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
                      className="w-full bg-[#214e41] hover:bg-black h-16 rounded-2xl text-lg font-black shadow-2xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" /> {t("auth.form.buttons.processing")} </>
                      ) : (
                        t("auth.form.buttons.continue")
                      )}
                    </Button>
                  </div>
                  )
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullname"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >{t("auth.form.fields.fullname")} <span className="text-[#f2ce3c]">*</span>
                      </Label>
                      <Input
                        id="fullname"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] rounded-2xl font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-email"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >{t("auth.form.fields.regEmail")} <span className="text-[#f2ce3c]">*</span>
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] rounded-2xl font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pr-1">
                        <Label
                          htmlFor="reg-citizen-id"
                          className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                        >{t("auth.form.fields.citizenId")} <span className="text-[#f2ce3c]">*</span>
                        </Label>
                        <span className={`text-[10px] font-black tracking-widest ${regCitizenIdNumber.length === 12 ? 'text-green-500' : 'text-slate-400'}`}>
                          {regCitizenIdNumber.length}/12
                        </span>
                      </div>
                      <Input
                        id="reg-citizen-id"
                        type="text"
                        placeholder={t("auth.form.fields.placeholders.citizenId")}
                        value={regCitizenIdNumber}
                        onChange={(e) => setRegCitizenIdNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] rounded-2xl font-medium tracking-widest"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="reg-phone"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                          >{t("auth.form.fields.phone")} <span className="text-[#f2ce3c]">*</span>
                          </Label>
                          <Input
                            id="reg-phone"
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                            className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] rounded-2xl font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="reg-dob"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                          >{t("auth.form.fields.dob")} <span className="text-[#f2ce3c]">*</span>
                          </Label>
                          <Input
                            id="reg-dob"
                            type="date"
                            value={regDob}
                            onChange={(e) => setRegDob(e.target.value)}
                            className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] rounded-2xl font-medium"
                          />
                        </div>
                    </div>

                    <div className="space-y-2">
                       <Label
                         htmlFor="gender"
                         className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                       >{t("auth.form.fields.gender")} <span className="text-[#f2ce3c]">*</span>
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
                           <SelectValue placeholder={t("auth.form.fields.placeholders.gender")} />
                         </SelectTrigger>
                         <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                           <SelectItem value="MALE">{t("auth.form.fields.genderOpts.male")}</SelectItem>
                           <SelectItem value="FEMALE">{t("auth.form.fields.genderOpts.female")}</SelectItem>
                           <SelectItem value="OTHER">{t("auth.form.fields.genderOpts.other")}</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-address"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >{t("auth.form.fields.address")} <span className="text-[#f2ce3c]">*</span>
                      </Label>
                      <Input
                        id="reg-address"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] rounded-2xl font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-password"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1"
                      >{t("auth.form.fields.securePassword")} <span className="text-[#f2ce3c]">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                          className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#214e41] rounded-2xl font-medium pr-12"
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
                      className="w-full bg-[#214e41] hover:bg-black h-16 rounded-2xl text-lg font-black shadow-2xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 mt-4"
                    >
                      {registerLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" /> {t("auth.form.buttons.processing")} </>
                      ) : (
                        t("auth.form.buttons.createAccount")
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-6 pt-4 pb-12 px-10 border-t border-slate-50">
                <div className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest leading-relaxed px-4">
                  {activeTab === "sign-in" ? (
                    <>
                      {t("auth.form.footer.noAccount")}{" "}
                    <button
                        onClick={() => handleTabChange("sign-up")}
                        className="text-[#214e41] font-black hover:text-[#f2ce3c] transition-colors"
                      >{t("auth.form.footer.registerNow")}</button>
                    </>
                  ) : (
                    <>
                      {t("auth.form.footer.hasAccount")}{" "}
                    <button
                        onClick={() => handleTabChange("sign-in")}
                        className="text-[#214e41] font-black hover:text-[#f2ce3c] transition-colors"
                      >{t("auth.form.footer.loginNow")}</button>
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
