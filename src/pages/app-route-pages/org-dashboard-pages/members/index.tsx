import { useCallback, useState } from "react";
import { useAppSelector } from "@/features/hooks";
import {
  getOrganizationMembersApi,
  promoteToModeratorApi,
  demoteToMemberApi,
  kickMemberApi,
} from "@/services/organizationMemberService";
import type { OrganizationMemberResponse } from "@/types/organization/OrganizationMemberResponse";
import { usePagination } from "@/hooks/usePagination";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  UserMinus,
  Loader2,
  Crown,
  Shield,
  User,
  Search,
} from "lucide-react";
import { getAvatarFallback, getS3Url } from "@/lib/utils";
import { toast } from "sonner";

/* ── Role config ── */

const ROLE_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  OWNER: {
    label: "Chủ sở hữu",
    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: Crown,
  },
  MODERATOR: {
    label: "Quản trị viên",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    icon: Shield,
  },
  MEMBER: {
    label: "Thành viên",
    color: "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
    icon: User,
  },
};

/**
 * Organization members page.
 * Lists members with role badges, search, pagination, and management actions.
 */
export default function OrgMembersPage() {
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );
  const orgId = selectedOrg?.id;
  const myRole = selectedOrg?.role;

  const [searchQuery, setSearchQuery] = useState("");

  const fetchMembers = useCallback(
    (page: number, size: number) => {
      if (!orgId) {
        return Promise.resolve({
          data: {
            content: [],
            totalPages: 0,
            totalElements: 0,
            number: 0,
            size,
          },
        } as never);
      }
      return getOrganizationMembersApi(orgId, page, size);
    },
    [orgId],
  );

  const {
    data: members,
    page,
    totalPages,
    totalElements,
    loading,
    setPage,
    refresh,
  } = usePagination<OrganizationMemberResponse>(fetchMembers, {
    initialSize: 10,
  });

  /* ── Actions ── */

  const handlePromote = async (userId: number, name: string) => {
    if (!orgId) return;
    try {
      await promoteToModeratorApi(orgId, userId);
      toast.success(`Đã thăng ${name} lên Quản trị viên`);
      refresh();
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleDemote = async (userId: number, name: string) => {
    if (!orgId) return;
    try {
      await demoteToMemberApi(orgId, userId);
      toast.success(`Đã hạ ${name} xuống Thành viên`);
      refresh();
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleKick = async (userId: number, name: string) => {
    if (!orgId) return;
    if (!confirm(`Bạn có chắc muốn xóa ${name} khỏi tổ chức?`)) return;
    try {
      await kickMemberApi(orgId, userId);
      toast.success(`Đã xóa ${name} khỏi tổ chức`);
      refresh();
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  /* ── Filter ── */

  const filteredMembers = searchQuery
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : members;

  const canManage = myRole === "OWNER" || myRole === "MODERATOR";

  return (
    <div className="space-y-6 pt-2">
      {/* Search + count */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
        {!loading && (
          <span className="text-sm text-gray-400 shrink-0">
            {totalElements} thành viên
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && members.length === 0 && (
        <EmptyState
          icon={Users}
          title="Chưa có thành viên nào"
          description="Mời thành viên vào tổ chức để bắt đầu cộng tác."
          actionLabel={canManage ? "Mời thành viên" : undefined}
          onAction={canManage ? () => alert("TODO: Mời thành viên") : undefined}
        />
      )}

      {/* Members table */}
      {!loading && filteredMembers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="pl-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Thành viên
                </TableHead>
                <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </TableHead>
                <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Vai trò
                </TableHead>
                {canManage && (
                  <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right pr-5 w-[80px]">
                    Thao tác
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <MemberRow
                  key={member.userId}
                  member={member}
                  myRole={myRole}
                  canManage={canManage}
                  onPromote={handlePromote}
                  onDemote={handleDemote}
                  onKick={handleKick}
                />
              ))}
            </TableBody>
          </Table>

          {/* Table footer with pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/40">
            <p className="text-xs text-gray-400">
              Trang {page + 1} / {Math.max(totalPages, 1)}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(Math.max(0, page - 1))}
                className="h-8 px-3 text-xs"
              >
                Trước
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let pageNum = i;
                if (totalPages > 5) {
                  const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                  pageNum = start + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                className="h-8 px-3 text-xs"
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filtered empty */}
      {!loading && members.length > 0 && filteredMembers.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Không tìm thấy thành viên nào khớp với &ldquo;{searchQuery}&rdquo;
        </div>
      )}
    </div>
  );
}

/* ── MemberRow ── */

function MemberRow({
  member,
  myRole,
  canManage,
  onPromote,
  onDemote,
  onKick,
}: {
  member: OrganizationMemberResponse;
  myRole?: string;
  canManage: boolean;
  onPromote: (userId: number, name: string) => void;
  onDemote: (userId: number, name: string) => void;
  onKick: (userId: number, name: string) => void;
}) {
  const roleInfo = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.MEMBER;
  const RoleIcon = roleInfo.icon;

  const isOwner = member.role === "OWNER";
  const isModerator = member.role === "MODERATOR";
  const isMember = member.role === "MEMBER";
  const iAmOwner = myRole === "OWNER";

  const showActions =
    canManage && !isOwner && (iAmOwner || (!isModerator && isMember));

  return (
    <TableRow className="group">
      {/* User info */}
      <TableCell className="pl-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
            <AvatarImage
              src={getS3Url(member.avatarUrl)}
              alt={member.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 text-xs font-semibold">
              {getAvatarFallback(member.name)}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-gray-900">{member.name}</p>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="py-3.5">
        <span className="text-gray-500">{member.email}</span>
      </TableCell>

      {/* Role badge */}
      <TableCell className="py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}
        >
          <RoleIcon className="h-3 w-3" />
          {roleInfo.label}
        </span>
      </TableCell>

      {/* Actions */}
      {canManage && (
        <TableCell className="py-3.5 pr-5 text-right">
          {showActions ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {isMember && iAmOwner && (
                  <DropdownMenuItem
                    onClick={() => onPromote(member.userId, member.name)}
                    className="gap-2.5 py-2"
                  >
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    Thăng lên Quản trị viên
                  </DropdownMenuItem>
                )}
                {isModerator && iAmOwner && (
                  <DropdownMenuItem
                    onClick={() => onDemote(member.userId, member.name)}
                    className="gap-2.5 py-2"
                  >
                    <ShieldOff className="h-4 w-4 text-orange-500" />
                    Hạ xuống Thành viên
                  </DropdownMenuItem>
                )}
                {((isMember && iAmOwner) || (isModerator && iAmOwner)) && (
                  <DropdownMenuSeparator />
                )}
                <DropdownMenuItem
                  onClick={() => onKick(member.userId, member.name)}
                  className="gap-2.5 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <UserMinus className="h-4 w-4" />
                  Xóa khỏi tổ chức
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-gray-200">—</span>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}
