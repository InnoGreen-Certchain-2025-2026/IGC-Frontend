import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus, Building2, MailOpen, Globe, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";
import { usePagination } from "@/hooks/usePagination";
import { getUserOrganizationsApi } from "@/services/organizationService";
import type { OrganizationSummaryResponse } from "@/types/organization/OrganizationSummaryResponse";
import PaginationBar from "@/components/custom/pagination/PaginationBar";
import { getS3Url } from "@/lib/utils";
import { useCallback } from "react";

/**
 * Organizations management page.
 * Features tabs for "My Organizations" and "Invitations".
 */
export default function OrganizationsPage() {
  const navigate = useNavigate();

  const fetchOrgs = useCallback(
    (page: number, size: number) => getUserOrganizationsApi(page, size),
    [],
  );

  const {
    data: organizations,
    page,
    totalPages,
    totalElements,
    loading,
    setPage,
  } = usePagination<OrganizationSummaryResponse>(fetchOrgs, {
    initialSize: 6,
  });

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
          <TabsTrigger value="invitations">Lời mời vào tổ chức</TabsTrigger>
        </TabsList>

        <TabsContent value="my-organizations" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              Danh sách tổ chức
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({totalElements})
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
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {/* Empty state */}
          {!loading && organizations.length === 0 && (
            <EmptyState
              icon={Building2}
              title="Chưa có tổ chức nào"
              description="Bạn chưa tham gia hoặc sở hữu tổ chức nào. Hãy tạo một tổ chức mới để bắt đầu."
              actionLabel="Tạo tổ chức ngay"
              onAction={() => navigate("/usr/organizations/create")}
            />
          )}

          {/* Organization cards */}
          {!loading && organizations.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizations.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    org={org}
                    onClick={() => navigate(`/org/${org.id}`)}
                  />
                ))}
              </div>

              <PaginationBar
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="invitations">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Lời mời đang chờ</h3>
          </div>

          <EmptyState
            icon={MailOpen}
            title="Không có lời mời"
            description="Hiện tại bạn không có lời mời nào vào các tổ chức khác."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Organization Card ── */

function OrganizationCard({
  org,
  onClick,
}: {
  org: OrganizationSummaryResponse;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-start gap-4 mb-3">
        {/* Logo */}
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
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
      </div>

      {org.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {org.description}
        </p>
      )}

      {org.domain && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto">
          <Globe className="h-3 w-3" />
          <span>{org.domain}</span>
        </div>
      )}
    </div>
  );
}
