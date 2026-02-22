import { useEffect, useState } from "react";
import { useAppSelector } from "@/features/hooks";
import { getOrganizationByIdApi } from "@/services/organizationService";
import type { OrganizationResponse } from "@/types/organization/OrganizationResponse";
import { getS3Url } from "@/lib/utils";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  User,
  FileText,
  MapPin,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";

const SERVICE_PLAN_LABELS: Record<string, { label: string; color: string }> = {
  FREE: { label: "Miễn phí", color: "bg-gray-100 text-gray-700" },
  PRO: { label: "Pro", color: "bg-blue-100 text-blue-700" },
  ENTERPRISE: {
    label: "Enterprise",
    color: "bg-purple-100 text-purple-700",
  },
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Chủ sở hữu",
  MODERATOR: "Quản trị viên",
  MEMBER: "Thành viên",
};

/**
 * Organization info page.
 * Fetches full org details via getOrganizationByIdApi and displays them.
 */
export default function OrgInfoPage() {
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  const [org, setOrg] = useState<OrganizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedOrg?.id) return;

    let cancelled = false;

    const fetchOrg = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrganizationByIdApi(selectedOrg.id);
        if (!cancelled && res.data) setOrg(res.data);
      } catch {
        if (!cancelled) setError("Không thể tải thông tin tổ chức.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrg();
    return () => {
      cancelled = true;
    };
  }, [selectedOrg?.id]);

  if (!selectedOrg?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-500">Không tìm thấy tổ chức.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-500">{error ?? "Đã xảy ra lỗi."}</p>
      </div>
    );
  }

  const planInfo =
    SERVICE_PLAN_LABELS[org.servicePlan] ?? SERVICE_PLAN_LABELS.FREE;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Thông tin tổ chức</h2>
        <p className="text-gray-500">
          Xem chi tiết thông tin về tổ chức {org.name}.
        </p>
      </header>

      {/* ── Header card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {org.logoUrl ? (
              <img
                src={getS3Url(org.logoUrl)}
                alt={org.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{org.name}</h3>
            <p className="text-sm text-gray-400 font-mono">{org.code}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${planInfo.color}`}
            >
              {planInfo.label}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              {ROLE_LABELS[org.role] ?? org.role}
            </span>
          </div>
        </div>

        {org.description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {org.description}
          </p>
        )}

        {org.domain && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            <span>{org.domain}</span>
          </div>
        )}
      </div>

      {/* ── Info sections ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin pháp lý */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Thông tin pháp lý
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={FileText}
              label="Tên pháp lý"
              value={org.legalName}
            />
            <InfoRow icon={CreditCard} label="Mã số thuế" value={org.taxCode} />
            <InfoRow
              icon={MapPin}
              label="Địa chỉ pháp lý"
              value={org.legalAddress}
            />
            <InfoRow
              icon={User}
              label="Người đại diện"
              value={org.representativeName}
            />
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Thông tin liên hệ
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={User}
              label="Người liên hệ"
              value={org.contactName}
            />
            <InfoRow
              icon={Mail}
              label="Email liên hệ"
              value={org.contactEmail}
            />
            <InfoRow
              icon={Phone}
              label="Số điện thoại"
              value={org.contactPhone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper component ── */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 wrap-break-word">
          {value || <span className="text-gray-300 italic">Chưa cập nhật</span>}
        </p>
      </div>
    </div>
  );
}
