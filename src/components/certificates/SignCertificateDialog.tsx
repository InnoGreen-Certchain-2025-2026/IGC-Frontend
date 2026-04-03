import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import type {
  CertificateRecord,
  SignCertificatePayload,
} from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";

interface SignCertificateDialogProps {
  open: boolean;
  certificate: CertificateRecord | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: SignCertificatePayload) => Promise<void>;
}

interface SignFormState {
  signatureImage: File | null;
  userCertificate: File | null;
  certificatePassword: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const isImageFile = (file: File): boolean =>
  ["image/png", "image/jpeg", "image/jpg"].includes(file.type);

const isP12OrPfxFile = (file: File): boolean => {
  const name = file.name.toLowerCase();
  return name.endsWith(".p12") || name.endsWith(".pfx");
};

export function SignCertificateDialog({
  open,
  certificate,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: SignCertificateDialogProps) {
  const localeText = CERTIFICATE_TEXTS[DEFAULT_LOCALE];
  const [errorText, setErrorText] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [formState, setFormState] = useState<SignFormState>({
    signatureImage: null,
    userCertificate: null,
    certificatePassword: "",
    x: 40,
    y: 40,
    width: 160,
    height: 80,
  });

  const signaturePreviewUrl = useMemo(() => {
    if (!formState.signatureImage) {
      return null;
    }
    return URL.createObjectURL(formState.signatureImage);
  }, [formState.signatureImage]);

  useEffect(() => {
    return () => {
      if (signaturePreviewUrl) {
        URL.revokeObjectURL(signaturePreviewUrl);
      }
    };
  }, [signaturePreviewUrl]);

  const validateFiles = (nextState: SignFormState): string => {
    if (!nextState.signatureImage || !isImageFile(nextState.signatureImage)) {
      return localeText.validation.signatureImageInvalid;
    }

    if (nextState.signatureImage.size > MAX_FILE_SIZE) {
      return localeText.validation.signatureImageInvalid;
    }

    if (
      !nextState.userCertificate ||
      !isP12OrPfxFile(nextState.userCertificate)
    ) {
      return localeText.validation.userCertificateInvalid;
    }

    if (nextState.userCertificate.size > MAX_FILE_SIZE) {
      return localeText.validation.userCertificateInvalid;
    }

    if (!nextState.certificatePassword.trim()) {
      return "Vui lòng nhập mật khẩu chứng thư số.";
    }

    return "";
  };

  const setCoordinate = (
    key: "x" | "y" | "width" | "height",
    value: number,
  ) => {
    const safeValue = Number.isNaN(value) ? 0 : Math.max(0, value);
    setFormState((prev) => ({ ...prev, [key]: safeValue }));
  };

  const submit = async () => {
    if (!certificate) {
      return;
    }

    const validationMessage = validateFiles(formState);
    setErrorText(validationMessage);

    if (validationMessage) {
      return;
    }

    await onSubmit({
      certificateId: certificate.certificateId,
      signatureImage: formState.signatureImage as File,
      userCertificate: formState.userCertificate as File,
      certificatePassword: formState.certificatePassword,
      x: formState.x,
      y: formState.y,
      width: formState.width,
      height: formState.height,
    });
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragging || !previewRef.current) {
      return;
    }

    const rect = previewRef.current.getBoundingClientRect();
    const nextX = Math.max(
      0,
      Math.round(event.clientX - rect.left - formState.width / 2),
    );
    const nextY = Math.max(
      0,
      Math.round(event.clientY - rect.top - formState.height / 2),
    );

    setFormState((prev) => ({ ...prev, x: nextX, y: nextY }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ký số chứng chỉ</DialogTitle>
          <DialogDescription>
            Tải ảnh chữ ký và chứng thư số người dùng (.p12/.pfx), sau đó chọn
            vị trí hiển thị chữ ký.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="signatureImage">Ảnh chữ ký (png/jpg)</Label>
              <Input
                id="signatureImage"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setFormState((prev) => ({ ...prev, signatureImage: file }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userCertificate">
                Chứng thư người dùng (.p12/.pfx)
              </Label>
              <Input
                id="userCertificate"
                type="file"
                accept=".p12,.pfx,application/x-pkcs12"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setFormState((prev) => ({ ...prev, userCertificate: file }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificatePassword">Mật khẩu chứng thư</Label>
              <Input
                id="certificatePassword"
                type="password"
                value={formState.certificatePassword}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    certificatePassword: event.target.value,
                  }))
                }
                placeholder="Nhập mật khẩu chứng thư"
                autoComplete="new-password"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="x">x</Label>
                <Input
                  id="x"
                  type="number"
                  value={formState.x}
                  onChange={(event) =>
                    setCoordinate("x", Number(event.target.value))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="y">y</Label>
                <Input
                  id="y"
                  type="number"
                  value={formState.y}
                  onChange={(event) =>
                    setCoordinate("y", Number(event.target.value))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="width">rộng</Label>
                <Input
                  id="width"
                  type="number"
                  value={formState.width}
                  onChange={(event) =>
                    setCoordinate("width", Number(event.target.value))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="height">cao</Label>
                <Input
                  id="height"
                  type="number"
                  value={formState.height}
                  onChange={(event) =>
                    setCoordinate("height", Number(event.target.value))
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Xem trước (kéo chữ ký để chọn tọa độ x/y)</Label>
            <div
              ref={previewRef}
              className="relative h-72 w-full rounded-md border bg-slate-50"
              onMouseMove={onMouseMove}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#d5deeb_1px,transparent_1px),linear-gradient(to_bottom,#d5deeb_1px,transparent_1px)] bg-size-[16px_16px]" />
              <div
                className="absolute cursor-move rounded border-2 border-blue-500 bg-blue-100/60"
                style={{
                  left: `${formState.x}px`,
                  top: `${formState.y}px`,
                  width: `${formState.width}px`,
                  height: `${formState.height}px`,
                }}
                onMouseDown={() => setDragging(true)}
              >
                {signaturePreviewUrl ? (
                  <img
                    src={signaturePreviewUrl}
                    alt="signature-preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-muted-foreground flex h-full items-center justify-center text-xs">
                    Vùng chữ ký
                  </span>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Backend sẽ kiểm tra lại chính xác vị trí. Kiểm tra phía client chỉ
              nhằm hỗ trợ thao tác nhanh hơn.
            </p>
          </div>
        </div>

        {errorText ? (
          <p className="text-destructive flex items-center gap-2 text-sm">
            <AlertTriangle className="size-4" />
            {errorText}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {localeText.actions.cancel}
          </Button>
          <Button type="button" onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? "Đang ký số..." : localeText.actions.sign}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
