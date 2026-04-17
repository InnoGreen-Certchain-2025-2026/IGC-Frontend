import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TemplateUploadFormProps {
  templateName: string;
  pdfFileName: string;
  isBusy: boolean;
  hasTemplateId: boolean;
  onTemplateNameChange: (name: string) => void;
  onPdfFileChange: (file: File | null) => void;
  onUpload: () => Promise<void>;
  onUpdateSchema: () => Promise<void>;
}

export default function TemplateUploadForm({
  templateName,
  pdfFileName,
  isBusy,
  hasTemplateId,
  onTemplateNameChange,
  onPdfFileChange,
  onUpload,
  onUpdateSchema,
}: TemplateUploadFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] md:items-end">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Template Name
          </label>
          <Input
            value={templateName}
            onChange={(event) => onTemplateNameChange(event.target.value)}
            placeholder="Certificate Template 2026"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            PDF Template
          </label>
          <label className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-700 hover:bg-slate-100">
            <Upload className="size-4" />
            <span className="truncate">{pdfFileName || "Chọn file PDF"}</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) =>
                onPdfFileChange(event.target.files?.[0] ?? null)
              }
            />
          </label>
        </div>

        <Button
          type="button"
          className="h-11 bg-[#214e41] text-white hover:bg-[#183930]"
          disabled={isBusy}
          onClick={onUpload}
        >
          {isBusy ? <Loader2 className="size-4 animate-spin" /> : null}
          Upload Template
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11"
          disabled={isBusy || !hasTemplateId}
          onClick={onUpdateSchema}
        >
          {isBusy ? <Loader2 className="size-4 animate-spin" /> : null}
          Update Schema
        </Button>
      </div>
    </section>
  );
}
