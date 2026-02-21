import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { logout } from "@/features/auth/authSlice";
import { logoutApi } from "@/services/authService";
import { getAvatarFallback, getS3Url } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";

/**
 * User menu dropdown displayed in the dashboard header.
 * Shows the user's avatar (or initials fallback) with a dropdown
 * containing account and logout actions.
 */
export default function UserMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { name, email, avatarUrl } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // still clear local state even if API fails
    }
    dispatch(logout());
    navigate("/auth", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-[10px] border border-gray-200 bg-white cursor-pointer transition-all duration-150 hover:bg-gray-100 hover:border-gray-300">
          <Avatar className="h-8 w-8">
            {avatarUrl && (
              <AvatarImage src={getS3Url(avatarUrl)} alt={name ?? ""} />
            )}
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
              {getAvatarFallback(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[0.82rem] font-semibold text-gray-900">
              {name ?? "Người dùng"}
            </span>
            <span className="text-[0.7rem] text-gray-500">{email ?? ""}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{name ?? "Người dùng"}</p>
          <p className="text-xs text-muted-foreground">{email ?? ""}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/usr/account")}>
          <User className="mr-2 h-4 w-4" />
          Tài khoản
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
