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
      <label className="block text-[0.7rem] uppercase tracking-wider text-white/55 mb-1.5 font-semibold">
        Tổ chức
      </label>
      <Popover open={orgOpen} onOpenChange={setOrgOpen}>
        <PopoverTrigger asChild>
          <button className="w-full bg-white/10 border border-white/15 text-white rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between gap-2 hover:bg-white/18 focus:bg-white/18">
            <div className="flex items-center gap-2 overflow-hidden">
              {selectedOrg?.logoUrl ? (
                <img
                  src={getS3Url(selectedOrg.logoUrl)}
                  alt=""
                  className="h-5 w-5 rounded object-cover shrink-0"
                />
              ) : (
                <Building2 className="h-4 w-4 opacity-60 shrink-0" />
              )}
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedOrg?.name ?? "Cá nhân"}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-60 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[240px] p-0"
          side="bottom"
          align="start"
          sideOffset={6}
        >
          {/* Header */}
          <div className="px-3 py-2.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Chuyển tổ chức
            </p>
          </div>
          <Separator />

          {/* Organization list */}
          <div className="py-1 max-h-[200px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {/* Personal (no org selected) */}
                <button
                  onClick={handleSelectPersonal}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 bg-transparent border-none cursor-pointer text-left transition-colors duration-100 hover:bg-gray-100"
                >
                  {selectedOrg === null ? (
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  ) : (
                    <span className="h-4 w-4 shrink-0" />
                  )}
                  <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Cá nhân</span>
                </button>

                {/* Org list */}
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrg(org)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 bg-transparent border-none cursor-pointer text-left transition-colors duration-100 hover:bg-gray-100"
                  >
                    {selectedOrg?.id === org.id ? (
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
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
                      <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                    )}
                    <span className="truncate">{org.name}</span>
                  </button>
                ))}

                {organizations.length === 0 && (
                  <p className="px-3 py-2 text-xs text-gray-400 italic">
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
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.82rem] font-medium text-gray-500 bg-transparent border-none cursor-pointer text-left transition-all duration-100 hover:bg-gray-100 hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
              Quản lý tổ chức
            </button>
            <button
              onClick={() => {
                navigate("/usr/organizations/create");
                setOrgOpen(false);
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.82rem] font-medium text-gray-500 bg-transparent border-none cursor-pointer text-left transition-all duration-100 hover:bg-gray-100 hover:text-gray-900"
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
