import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserProfileApi, updateUserProfileApi } from "@/services/userService";
import { toast } from "sonner";
import { useAppDispatch } from "@/features/hooks";
import { fetchMe } from "@/features/user/userThunk";
import { Loader2 } from "lucide-react";

/**
 * Profile sub-page under Account.
 * Allows the user to view / update name, phoneNumber, address, and date of birth.
 */
export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const [updateLoading, setUpdateLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    dob: "",
    gender: "MALE",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileApi();
        if (response.data) {
          const { name, phoneNumber, address, dob, gender } = response.data;
          setForm({
            name: name ?? "",
            phoneNumber: phoneNumber ?? "",
            address: address ?? "",
            dob: dob ?? "",
            gender: gender ?? "OTHER",
          });
        }
      } catch (error: any) {
        toast.error("Không thể tải thông tin cá nhân");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenderChange = (value: string) => {
    setForm((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await updateUserProfileApi(form as any);
      toast.success("Cập nhật hồ sơ thành công!");
      // Refresh global user state
      dispatch(fetchMe());
    } catch (error: any) {
      const message = error.response?.data?.errorMessage || "Cập nhật hồ sơ thất bại";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber">Số điện thoại <span className="text-red-500">*</span></Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address">Địa chỉ <span className="text-red-500">*</span></Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
          </div>

          {/* Date of birth */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dob">Ngày sinh <span className="text-red-500">*</span></Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label htmlFor="gender">Giới tính <span className="text-red-500">*</span></Label>
              <Select value={form.gender} onValueChange={handleGenderChange}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={updateLoading} className="min-w-[120px]">
              {updateLoading ? (
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
