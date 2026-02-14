import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { updatePasswordApi } from "@/services/authService";
import { toast } from "sonner";

/**
 * Security sub-page under Account.
 * Allows the user to change their password.
 */
export default function SecurityPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.oldPassword || !form.newPassword || !form.confirmedNewPassword) {
      toast.error("Vui lòng nhập đầy đủ tất cả thông tin.");
      return;
    }

    if (form.newPassword !== form.confirmedNewPassword) {
      toast.error("Mật khẩu mới và nhập lại mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      await updatePasswordApi(form);
      toast.success("Cập nhật mật khẩu thành công!");
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmedNewPassword: "",
      });
    } catch (error: any) {
      const message = error.response?.data?.errorMessage || "Cập nhật mật khẩu thất bại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Đổi mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current password */}
          <div className="space-y-1.5">
            <Label htmlFor="oldPassword">Mật khẩu hiện tại <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showCurrent ? "text" : "password"}
                value={form.oldPassword}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Mật khẩu mới <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmedNewPassword">Nhập lại mật khẩu mới <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="confirmedNewPassword"
                name="confirmedNewPassword"
                type={showConfirm ? "text" : "password"}
                value={form.confirmedNewPassword}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
