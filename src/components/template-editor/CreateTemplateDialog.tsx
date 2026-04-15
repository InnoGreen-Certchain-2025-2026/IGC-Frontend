import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateTemplateDialogProps {
  open: boolean;
  pdfFileName?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => void;
  isLoading?: boolean;
}

export default function CreateTemplateDialog({
  open,
  pdfFileName,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: CreateTemplateDialogProps) {
  const [name, setName] = useState("");

  const handleConfirm = () => {
    if (!name.trim()) {
      return;
    }
    onConfirm(name.trim());
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo template mới</DialogTitle>
          <DialogDescription>
            Nhập tên cho template. Tên sẽ theo tên PDF nếu để trống.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Tên template</Label>
            <Input
              id="template-name"
              placeholder={pdfFileName?.replace(/\.pdf$/i, "") || "Template"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  handleConfirm();
                }
              }}
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!name.trim() || isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
