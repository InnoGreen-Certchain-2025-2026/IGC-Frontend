import { useState } from "react";
import { useAppSelector } from "@/features/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
            <Label htmlFor="name">Họ và tên</Label>
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
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
          </div>

          {/* Date of birth */}
          <div className="space-y-1.5">
            <Label htmlFor="dob">Ngày sinh</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div className="pt-2">
            <Button type="submit">Cập nhật</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
