import { useCallback, useState } from "react";
import { useAppSelector } from "@/features/hooks";
import {
  getInvitesByOrganizationApi,
  inviteUserToOrganizationApi,
  cancelOrganizationInviteApi,
} from "@/services/organizationInviteService";
import type { OrganizationInviteResponse } from "@/types/organization/OrganizationInviteResponse";
import type { OrganizationRole } from "@/types/organization/OrganizationRole";
import { usePagination } from "@/hooks/usePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";
import {
  MailPlus,
  MoreHorizontal,
  XCircle,
  Loader2,
  Search,
  Clock,
  CheckCircle2,
  XOctagon,
  Ban,
  Send,
} from "lucide-react";
import { toast } from "sonner";

/* ── Status config ── */

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: {
    label: "Chờ phản hồi",
    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: Clock,
  },
  ACCEPTED: {
    label: "Đã chấp nhận",
    color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Đã từ chối",
    color: "bg-red-50 text-red-600 ring-1 ring-red-200",
    icon: XOctagon,
  },
  CANCELLED: {
    label: "Đã huỷ",
    color: "bg-gray-50 text-gray-500 ring-1 ring-gray-200",
    icon: Ban,
  },
  EXPIRED: {
    label: "Hết hạn",
    color: "bg-gray-50 text-gray-400 ring-1 ring-gray-200",
    icon: Clock,
  },
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Chủ sở hữu",
  MODERATOR: "Quản trị viên",
  MEMBER: "Thành viên",
};

/**
 * Organization invites page.
 */
export default function OrgInvitesPage() {
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );
  const orgId = selectedOrg?.id;
  const myRole = selectedOrg?.role;

  const [searchQuery, setSearchQuery] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const fetchInvites = useCallback(
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
      return getInvitesByOrganizationApi(orgId, page, size);
    },
    [orgId],
  );

  const {
    data: invites,
    page,
    totalPages,
    totalElements,
    loading,
    setPage,
    refresh,
  } = usePagination<OrganizationInviteResponse>(fetchInvites, {
    initialSize: 10,
  });

  /* ── Actions ── */

  const handleCancel = async (token: string) => {
    if (!confirm("Bạn có chắc muốn huỷ lời mời này?")) return;
    try {
      await cancelOrganizationInviteApi(token);
      toast.success("Đã huỷ lời mời");
      refresh();
    } catch {
      toast.error("Huỷ lời mời thất bại");
    }
  };

  /* ── Filter ── */

  const filteredInvites = searchQuery
    ? invites.filter(
        (inv) =>
          inv.inviteeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.inviterName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : invites;

  const canManage = myRole === "OWNER" || myRole === "MODERATOR";

  return (
    <div className="space-y-6 pt-2">
      {/* Search + count + Send button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo email hoặc người mời..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
        {!loading && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 shrink-0">
              {totalElements} lời mời
            </span>
            {canManage && (
              <Button
                size="sm"
                className="gap-2 shrink-0"
                onClick={() => setInviteDialogOpen(true)}
              >
                <Send className="h-4 w-4" />
                Gửi lời mời
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && invites.length === 0 && (
        <EmptyState
          icon={MailPlus}
          title="Chưa có lời mời nào"
          description="Gửi lời mời để mời thành viên mới vào tổ chức."
          actionLabel={canManage ? "Gửi lời mời" : undefined}
          onAction={canManage ? () => setInviteDialogOpen(true) : undefined}
        />
      )}

      {/* Invites table */}
      {!loading && filteredInvites.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="pl-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email người được mời
                </TableHead>
                <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Vai trò
                </TableHead>
                <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Người mời
                </TableHead>
                <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Trạng thái
                </TableHead>
                <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Ngày tạo
                </TableHead>
                {canManage && (
                  <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right pr-5 w-[80px]">
                    Thao tác
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvites.map((invite) => {
                const statusInfo =
                  STATUS_CONFIG[invite.status] ?? STATUS_CONFIG.PENDING;
                const StatusIcon = statusInfo.icon;
                const isPending = invite.status === "PENDING";

                return (
                  <TableRow key={invite.id} className="group">
                    <TableCell className="pl-5 py-3.5 font-medium text-gray-900">
                      {invite.inviteeEmail}
                    </TableCell>
                    <TableCell className="py-3.5 text-gray-600">
                      {ROLE_LABELS[invite.invitedRole] ?? invite.invitedRole}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="min-w-0">
                        <p className="text-gray-800 text-sm">
                          {invite.inviterName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {invite.inviterEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-gray-500 text-sm">
                      {formatDate(invite.createdAt)}
                    </TableCell>
                    {canManage && (
                      <TableCell className="py-3.5 pr-5 text-right">
                        {isPending ? (
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
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => handleCancel(invite.inviteToken)}
                                className="gap-2.5 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Huỷ lời mời
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
              })}
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
      {!loading && invites.length > 0 && filteredInvites.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Không tìm thấy lời mời nào khớp với &ldquo;{searchQuery}&rdquo;
        </div>
      )}

      {/* ── Invite dialog ── */}
      {canManage && (
        <InviteDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          orgId={orgId!}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}

/* ── Invite dialog ── */

function InviteDialog({
  open,
  onClose,
  orgId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  orgId: number;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrganizationRole>("MEMBER");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    setSubmitting(true);
    try {
      await inviteUserToOrganizationApi(orgId, {
        inviteeEmail: email.trim(),
        invitedRole: role,
        inviteMessage: message.trim() || undefined,
      });
      toast.success(`Đã gửi lời mời đến ${email.trim()}`);
      setEmail("");
      setRole("MEMBER");
      setMessage("");
      onClose();
      onSuccess();
    } catch {
      toast.error("Gửi lời mời thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mời thành viên mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="invite-email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="invite-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label
              htmlFor="invite-role"
              className="text-sm font-medium text-gray-700"
            >
              Vai trò
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as OrganizationRole)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            >
              <option value="MEMBER">Thành viên</option>
              <option value="MODERATOR">Quản trị viên</option>
            </select>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label
              htmlFor="invite-message"
              className="text-sm font-medium text-gray-700"
            >
              Lời nhắn{" "}
              <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
            </label>
            <textarea
              id="invite-message"
              rows={3}
              placeholder="Nhập lời nhắn gửi kèm lời mời..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Gửi lời mời
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Helpers ── */

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
