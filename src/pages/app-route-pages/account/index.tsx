import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/features/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback, getS3Url } from "@/lib/utils";

/**
 * User account / profile page.
 * Displays the current user's profile information.
 */
export default function AccountPage() {
  const { name, email, avatarUrl } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-2xl">
      <p className="text-gray-500 mb-6">Xem và quản lý thông tin tài khoản.</p>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            {avatarUrl && (
              <AvatarImage src={getS3Url(avatarUrl)} alt={name ?? ""} />
            )}
            <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
              {getAvatarFallback(name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Họ và tên
              </p>
              <p className="font-medium text-gray-900">
                {name ?? "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Email
              </p>
              <p className="font-medium text-gray-900">
                {email ?? "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
