import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/certificates/StatusBadge";
import type { CertificateRecord } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";

interface CertificatesTableProps {
  records: CertificateRecord[];
  activeTab: "DRAFT" | "SIGNED" | "REVOKED";
  highlightCertificateId?: string;
  onSign: (record: CertificateRecord) => void;
  onRevoke: (certificateId: string) => Promise<void>;
  onReissue: (certificateId: string) => Promise<void>;
  isRevokePending: boolean;
  isReissuePending: boolean;
}

export function CertificatesTable({
  records,
  activeTab,
  highlightCertificateId,
  onSign,
  onRevoke,
  onReissue,
  isReissuePending,
  isRevokePending,
}: CertificatesTableProps) {
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];
  const [pendingCertificateId, setPendingCertificateId] = useState<string>("");

  const titleByTab = useMemo(() => {
    if (activeTab === "DRAFT") return text.tabs.draft;
    if (activeTab === "SIGNED") return text.tabs.signed;
    return text.tabs.revoked;
  }, [activeTab, text.tabs.draft, text.tabs.revoked, text.tabs.signed]);

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã chứng chỉ</TableHead>
            <TableHead>Tên sinh viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Mã nhận</TableHead>
            <TableHead>Hạn nhận</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const isHighlighted =
              record.certificateId === highlightCertificateId;

            return (
              <TableRow
                key={record.certificateId}
                className={isHighlighted ? "bg-blue-50" : undefined}
              >
                <TableCell className="font-medium">
                  {record.certificateId}
                </TableCell>
                <TableCell>{record.studentName}</TableCell>
                <TableCell>
                  <StatusBadge status={record.status} />
                </TableCell>
                <TableCell>{record.claimCode ?? "-"}</TableCell>
                <TableCell>{record.claimExpiry ?? "-"}</TableCell>
                <TableCell className="space-x-2 text-right">
                  {activeTab === "DRAFT" ? (
                    <Button size="sm" onClick={() => onSign(record)}>
                      {text.actions.sign}
                    </Button>
                  ) : null}

                  {activeTab === "SIGNED" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          {text.actions.revoke}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Thu hồi chứng chỉ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Chứng chỉ này sẽ được đánh dấu đã thu hồi và không
                            còn hiệu lực.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {text.actions.cancel}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={async () => {
                              setPendingCertificateId(record.certificateId);
                              await onRevoke(record.certificateId);
                              setPendingCertificateId("");
                            }}
                          >
                            {isRevokePending &&
                            pendingCertificateId === record.certificateId
                              ? "Đang thu hồi..."
                              : text.actions.revoke}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}

                  {activeTab === "REVOKED" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                          {text.actions.reissue}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cấp lại chứng chỉ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Thao tác cấp lại sẽ tạo một chứng chỉ bản nháp mới
                            từ bản ghi đã thu hồi này.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {text.actions.cancel}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              setPendingCertificateId(record.certificateId);
                              await onReissue(record.certificateId);
                              setPendingCertificateId("");
                            }}
                          >
                            {isReissuePending &&
                            pendingCertificateId === record.certificateId
                              ? "Đang cấp lại..."
                              : text.actions.reissue}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <p className="text-muted-foreground border-t px-4 py-3 text-xs">
        {titleByTab}: {records.length}
      </p>
    </div>
  );
}
