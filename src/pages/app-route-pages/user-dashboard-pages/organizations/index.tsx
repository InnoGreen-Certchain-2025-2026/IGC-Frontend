import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Building2,
  MailOpen,
  Globe,
  Loader2,
  Check,
  X,
  Calendar,
  User,
} from "lucide-react";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";
import { usePagination } from "@/hooks/usePagination";
import { getUserOrganizationsApi } from "@/services/organizationService";
import {
  getInvitesByUserApi,
  acceptOrganizationInviteApi,
  declineOrganizationInviteApi,
} from "@/services/organizationInviteService";
import type { OrganizationSummaryResponse } from "@/types/organization/OrganizationSummaryResponse";
import type { OrganizationInviteResponse } from "@/types/organization/OrganizationInviteResponse";
import PaginationBar from "@/components/custom/pagination/PaginationBar";
import { getS3Url } from "@/lib/utils";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { selectOrganization } from "@/features/organization/organizationSlice";
import { toast } from "sonner";
import { fetchMe } from "@/features/user/userThunk";

/**
 * Organizations management page.
 * Features tabs for "My Organizations" and "Invitations".
 */
export default function OrganizationsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.id);

  /* Diagnostic Log — Check if userId is present */
  console.log("[OrganizationsPage] userId:", userId);

  /* ── My Organizations ── */
  const fetchOrgs = useCallback(
    (page: number, size: number) => getUserOrganizationsApi(page, size),
    [],
  );

  const {
    data: organizations,
    page: orgPage,
    totalPages: orgTotalPages,
    totalElements: orgTotalElements,
    loading: orgLoading,
    setPage: setOrgPage,
    refresh: refreshOrgs,
  } = usePagination<OrganizationSummaryResponse>(fetchOrgs, {
    initialSize: 6,
  });

  /* ── Invitations ── */
  const fetchInvites = useCallback(
    (page: number, size: number) => {
      if (!userId) return Promise.reject("No User ID");
      return getInvitesByUserApi(Number(userId), page, size);
    },
    [userId],
  );

  const {
    data: invites,
    page: invitePage,
    totalPages: inviteTotalPages,
    totalElements: inviteTotalElements,
    loading: inviteLoading,
    error: inviteError,
    setPage: setInvitePage,
    refresh: refreshInvites,
  } = usePagination<OrganizationInviteResponse>(fetchInvites, {
    initialSize: 6,
    enabled: !!userId,
  });

  const handleAccept = async (token: string) => {
    try {
      await acceptOrganizationInviteApi(token);
      toast.success("Đã chấp nhận lời mời tham gia tổ chức");
      refreshInvites();
      refreshOrgs();
      // Also refresh "me" to update global org context if needed
      dispatch(fetchMe());
    } catch {
      toast.error("Chấp nhận lời mời thất bại");
    }
  };

  const handleDecline = async (token: string) => {
    try {
      await declineOrganizationInviteApi(token);
      toast.success("Đã từ chối lời mời");
      refreshInvites();
    } catch {
      toast.error("Từ chối lời mời thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tổ chức</h2>
          <p className="text-gray-500">
            Quản lý các tổ chức của bạn và các lời mời tham gia.
          </p>
        </div>
      </header>

      <Tabs defaultValue="my-organizations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="my-organizations">
            Các tổ chức của tôi
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Lời mời vào tổ chức
            {!inviteLoading && inviteTotalElements > 0 && (
              <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {inviteTotalElements}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-organizations" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              Danh sách tổ chức
              {!orgLoading && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({orgTotalElements})
                </span>
              )}
            </h3>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => navigate("/usr/organizations/create")}
            >
              <Plus className="h-4 w-4" />
              Tạo tổ chức
            </Button>
          </div>

          {/* Loading state */}
          {orgLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {/* Empty state */}
          {!orgLoading && organizations.length === 0 && (
            <EmptyState
              icon={Building2}
              title="Chưa có tổ chức nào"
              description="Bạn chưa tham gia hoặc sở hữu tổ chức nào. Hãy tạo một tổ chức mới để bắt đầu."
              actionLabel="Tạo tổ chức ngay"
              onAction={() => navigate("/usr/organizations/create")}
            />
          )}

          {/* Organization cards */}
          {!orgLoading && organizations.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizations.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    org={org}
                    onClick={() => {
                      dispatch(selectOrganization(org));
                      navigate(`/org/${org.code}`);
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <PaginationBar
                  page={orgPage}
                  totalPages={orgTotalPages}
                  onPageChange={setOrgPage}
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Lời mời đang chờ
              {!inviteLoading && !inviteError && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({inviteTotalElements})
                </span>
              )}
            </h3>
          </div>

          {/* Error state */}
          {inviteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
              {inviteError}
            </div>
          )}

          {/* Loading state */}
          {inviteLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {/* Empty state */}
          {!inviteLoading && !inviteError && invites.length === 0 && (
            <EmptyState
              icon={MailOpen}
              title="Không có lời mời"
              description="Hiện tại bạn không có lời mời nào vào các tổ chức khác."
            />
          )}

          {/* Invitation cards */}
          {!inviteLoading && !inviteError && invites.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invites.map((invite) => (
                  <InviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={() => handleAccept(invite.inviteToken)}
                    onDecline={() => handleDecline(invite.inviteToken)}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <PaginationBar
                  page={invitePage}
                  totalPages={inviteTotalPages}
                  onPageChange={setInvitePage}
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Invite Card ── */

function InviteCard({
  invite,
  onAccept,
  onDecline,
}: {
  invite: OrganizationInviteResponse;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex flex-col p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        {/* Org Logo */}
        <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0 border border-blue-100">
          {invite.organizationLogoUrl ? (
            <img
              src={getS3Url(invite.organizationLogoUrl)}
              alt={invite.organizationName}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-7 w-7 text-blue-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 truncate">
              {invite.organizationName}
            </h4>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-mono border border-blue-100">
              {invite.organizationCode}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Mời bạn tham gia với vai trò{" "}
            <span className="font-medium text-gray-800 lowercase">
              {ROLE_LABELS[invite.invitedRole]?.label || invite.invitedRole}
            </span>
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Người mời: {invite.inviterName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(invite.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-auto pt-2">
        <Button
          size="sm"
          className="flex-1 gap-1.5 bg-blue-600 hover:bg-blue-700"
          onClick={onAccept}
        >
          <Check className="h-4 w-4" />
          Chấp nhận
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 border-gray-200 text-gray-600 hover:bg-gray-50"
          onClick={onDecline}
        >
          <X className="h-4 w-4" />
          Từ chối
        </Button>
      </div>
    </div>
  );
}

/* ── Organization Card ── */

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  OWNER: { label: "Chủ sở hữu", color: "bg-amber-100 text-amber-700" },
  MODERATOR: { label: "Quản trị viên", color: "bg-blue-100 text-blue-700" },
  MEMBER: { label: "Thành viên", color: "bg-gray-100 text-gray-600" },
};

function OrganizationCard({
  org,
  onClick,
}: {
  org: OrganizationSummaryResponse;
  onClick: () => void;
}) {
  const roleInfo = ROLE_LABELS[org.role] ?? ROLE_LABELS.MEMBER;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-start gap-4 mb-3">
        {/* Logo */}
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-transparent group-hover:border-blue-100 transition-colors">
          {org.logoUrl ? (
            <img
              src={getS3Url(org.logoUrl)}
              alt={org.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-6 w-6 text-gray-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {org.name}
          </h4>
          <p className="text-xs text-gray-400 font-mono">{org.code}</p>
        </div>

        {/* Role badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.7rem] font-medium shrink-0 ${roleInfo.color}`}
        >
          {roleInfo.label}
        </span>
      </div>

      {org.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">
          {org.description}
        </p>
      )}

      {org.domain && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto pt-2">
          <Globe className="h-3 w-3" />
          <span className="truncate">{org.domain}</span>
        </div>
      )}
    </div>
  );
}
