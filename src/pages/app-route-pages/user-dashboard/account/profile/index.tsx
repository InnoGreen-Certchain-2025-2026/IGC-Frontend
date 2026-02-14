import { useState } from "react";
import { useAppSelector } from "@/features/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Profile sub-page under Account.
 * Allows the user to view / update name, address, and date of birth.
 */
export default function ProfilePage() {
  const { name } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: name ?? "",
    address: "",
    dob: "",
    gender: "OTHER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenderChange = (value: string) => {
    setForm((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: dispatch update profile thunk
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
            <Button type="submit">Cập nhật</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
