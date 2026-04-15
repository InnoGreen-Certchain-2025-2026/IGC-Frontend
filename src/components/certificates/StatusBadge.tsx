import { Badge } from "@/components/ui/badge";
import type { CertificateStatus } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";

interface StatusBadgeProps {
  status: CertificateStatus;
}

const statusClassNameMap: Record<CertificateStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  SIGNED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REVOKED: "bg-red-100 text-red-700 border-red-200",
  EXPIRED: "bg-amber-100 text-amber-700 border-amber-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusTexts = CERTIFICATE_TEXTS[DEFAULT_LOCALE].status as Record<string, string>;
  const text = statusTexts[status] ?? status;

  return (
    <Badge variant="outline" className={statusClassNameMap[status]}>
      {text}
    </Badge>
  );
}
