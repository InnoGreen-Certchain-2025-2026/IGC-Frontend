import { EmptyState } from "@/components/custom/empty-state/EmptyState";
import { ScrollText } from "lucide-react";

interface CertificateEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CertificateEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: CertificateEmptyStateProps) {
  return (
    <EmptyState
      icon={ScrollText}
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
