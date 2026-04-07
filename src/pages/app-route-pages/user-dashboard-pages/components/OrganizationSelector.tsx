import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ChevronsUpDown,
  Check,
  Settings,
  Plus,
  Building2,
  Loader2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getUserBriefOrganizationsApi } from "@/services/organizationService";
import type { OrganizationSummaryResponse } from "@/types/organization/OrganizationSummaryResponse";
import { getS3Url } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import {
  selectOrganization,
  clearSelectedOrganization,
} from "@/features/organization/organizationSlice";

/**
 * Organization selector dropdown in the sidebar.
 * Fetches the user's organizations via API and displays them.
 */
export default function OrganizationSelector() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  const [orgOpen, setOrgOpen] = useState(false);
  const [organizations, setOrganizations] = useState<
    OrganizationSummaryResponse[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserBriefOrganizationsApi()
      .then((res) => {
        if (res.data) {
          setOrganizations(res.data);
        }
      })
      .catch(() => {
        // silently fail
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectOrg = (org: OrganizationSummaryResponse) => {
    dispatch(selectOrganization(org));
    setOrgOpen(false);
    navigate(`/org/${org.code}`);
  };

  const handleSelectPersonal = () => {
    dispatch(clearSelectedOrganization());
    setOrgOpen(false);
    navigate("/usr");
  };

  return (
    <div className="px-4 pt-4 pb-2">
      <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Tổ chức
      </label>
      <Popover open={orgOpen} onOpenChange={setOrgOpen}>
        <PopoverTrigger asChild>
          <button className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-150 hover:border-primary-200 hover:bg-slate-50 hover:shadow-md focus:border-primary-300 focus:bg-slate-50">
            <div className="flex items-center gap-2 overflow-hidden">
              {selectedOrg?.logoUrl ? (
                <img
                  src={getS3Url(selectedOrg.logoUrl)}
                  alt=""
                  className="h-5 w-5 rounded object-cover shrink-0"
                />
              ) : (
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
              )}
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedOrg?.name ?? "Cá nhân"}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-60 overflow-hidden rounded-2xl border border-slate-200 p-0 shadow-xl"
          side="bottom"
          align="start"
          sideOffset={6}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-slate-50 to-white px-3 py-2.5">
            <p className="text-xs font-semibold text-primary-800 uppercase tracking-[0.2em]">
              Chuyển tổ chức
            </p>
          </div>
          <Separator />

          {/* Organization list */}
          <div className="max-h-50 overflow-y-auto py-1.5">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            ) : (
              <>
                {/* Personal (no org selected) */}
                <button
                  onClick={handleSelectPersonal}
                  className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-3 py-2.5 text-left text-sm text-slate-700 transition-all duration-150 hover:bg-slate-50 hover:text-primary-800 hover:shadow-sm"
                >
                  {selectedOrg === null ? (
                    <Check className="h-4 w-4 text-primary-600 shrink-0" />
                  ) : (
                    <span className="h-4 w-4 shrink-0" />
                  )}
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Cá nhân</span>
                </button>

                {/* Org list */}
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrg(org)}
                    className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-3 py-2.5 text-left text-sm text-slate-700 transition-all duration-150 hover:bg-slate-50 hover:text-primary-800 hover:shadow-sm"
                  >
                    {selectedOrg?.id === org.id ? (
                      <Check className="h-4 w-4 text-primary-600 shrink-0" />
                    ) : (
                      <span className="h-4 w-4 shrink-0" />
                    )}
                    {org.logoUrl ? (
                      <img
                        src={getS3Url(org.logoUrl)}
                        alt=""
                        className="h-4 w-4 rounded object-cover shrink-0"
                      />
                    ) : (
                      <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{org.name}</span>
                  </button>
                ))}

                {organizations.length === 0 && (
                  <p className="px-3 py-2 text-xs text-slate-400 italic">
                    Chưa có tổ chức nào
                  </p>
                )}
              </>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={() => {
                navigate("/usr/organizations");
                setOrgOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-3 py-2.5 text-left text-[0.82rem] font-medium text-slate-500 transition-all duration-150 hover:bg-slate-50 hover:text-primary-800 hover:shadow-sm"
            >
              <Settings className="h-4 w-4" />
              Quản lý tổ chức
            </button>
            <button
              onClick={() => {
                navigate("/usr/organizations/create");
                setOrgOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-3 py-2.5 text-left text-[0.82rem] font-medium text-slate-500 transition-all duration-150 hover:bg-slate-50 hover:text-primary-800 hover:shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Tạo tổ chức mới
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
