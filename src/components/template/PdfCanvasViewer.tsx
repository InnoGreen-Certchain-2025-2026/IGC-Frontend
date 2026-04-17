import { useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, TriangleAlert } from "lucide-react";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import type { TemplateField } from "@/types/template";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function toPercent(valuePx: number, totalPx: number) {
  if (totalPx <= 0) return 0;
  return Number(((valuePx / totalPx) * 100).toFixed(2));
}

function mapFontFamily(fontFamily?: string) {
  const key = (fontFamily ?? "helvetica").toLowerCase();
  const mapping: Record<string, string> = {
    helvetica: "Helvetica, Arial, sans-serif",
    "helvetica-bold": "Helvetica, Arial, sans-serif",
    times: "Times New Roman, serif",
    "times-bold": "Times New Roman, serif",
    courier: "Courier New, monospace",
    "courier-bold": "Courier New, monospace",
    arial: "Arial, sans-serif",
    "arial-bold": "Arial, sans-serif",
    "sans-serif": "sans-serif",
    "sans-bold": "sans-serif",
    serif: "serif",
    "serif-bold": "serif",
    monospace: "monospace",
    "mono-bold": "monospace",
  };
  return mapping[key] ?? "Helvetica, Arial, sans-serif";
}

function mapFontWeight(fontFamily?: string) {
  return (fontFamily ?? "").toLowerCase().includes("bold") ? 700 : 500;
}

interface PdfCanvasViewerProps {
  pdfUrl: string | null;
  fields: TemplateField[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onUpdateField: (id: string, updates: Partial<TemplateField>) => void;
  onDeleteField: (id: string) => void;
  pdfLoading: boolean;
  pdfError?: string | null;
  onRetryPdf?: () => void;
}

export default function PdfCanvasViewer({
  pdfUrl,
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onDeleteField,
  pdfLoading,
  pdfError,
  onRetryPdf,
}: PdfCanvasViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (pdfLoading) {
    return (
      <div className="flex h-[72vh] items-center justify-center rounded-xl border bg-white text-sm text-slate-600">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Đang tải PDF...
      </div>
    );
  }

  if (!pdfUrl) {
    if (pdfError) {
      return (
        <div className="flex h-[72vh] flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-6 text-center text-sm text-rose-700">
          <TriangleAlert className="size-5" />
          <p>{pdfError}</p>
          {onRetryPdf ? (
            <Button type="button" variant="outline" onClick={onRetryPdf}>
              Thử lại
            </Button>
          ) : null}
        </div>
      );
    }

    return (
      <div className="flex h-[72vh] items-center justify-center rounded-xl border border-dashed bg-slate-50 text-sm text-slate-500">
        Không có dữ liệu PDF để preview.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-slate-100 p-3">
      <div className="relative mx-auto w-fit" ref={containerRef}>
        <Document
          file={pdfUrl}
          loading={
            <div className="p-4 text-sm text-slate-500">
              Đang mở tài liệu...
            </div>
          }
        >
          <Page
            pageNumber={1}
            width={820}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        <div
          className="absolute inset-0"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onSelectField(null);
            }
          }}
        >
          {fields.map((field) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const width = rect?.width ?? 1;
            const height = rect?.height ?? 1;

            const xPx = (field.x / 100) * width;
            const yPx = (field.y / 100) * height;
            const wPx = (field.w / 100) * width;
            const hPx = (field.h / 100) * height;

            const selected = selectedFieldId === field.id;

            return (
              <Rnd
                key={field.id}
                bounds="parent"
                size={{ width: wPx, height: hPx }}
                position={{ x: xPx, y: yPx }}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  onSelectField(field.id);
                }}
                onDragStop={(_event, data) => {
                  onUpdateField(field.id, {
                    x: toPercent(data.x, width),
                    y: toPercent(data.y, height),
                  });
                }}
                onResizeStop={(_event, _dir, ref, _delta, position) => {
                  onUpdateField(field.id, {
                    x: toPercent(position.x, width),
                    y: toPercent(position.y, height),
                    w: toPercent(ref.offsetWidth, width),
                    h: toPercent(ref.offsetHeight, height),
                  });
                }}
                className={`border ${selected ? "border-blue-600" : "border-blue-400"} bg-blue-100/20`}
                enableUserSelectHack={false}
              >
                <div className="relative flex h-full w-full px-2 py-1">
                  <div
                    className="w-full overflow-hidden whitespace-nowrap"
                    style={{
                      textAlign: (field.align ?? "left") as
                        | "left"
                        | "center"
                        | "right",
                      alignSelf: "center",
                      fontFamily: mapFontFamily(field.fontFamily),
                      fontWeight: mapFontWeight(field.fontFamily),
                      fontSize: `${field.fontSize ?? 11}px`,
                      color:
                        field.type === "image"
                          ? "#0f766e"
                          : (field.color ?? "#1A1A1A"),
                      lineHeight: 1.2,
                    }}
                  >
                    {field.type === "image" ? "[signature]" : "Example"}
                  </div>

                  <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded bg-white/95 px-1.5 py-0 text-[10px] font-medium text-blue-700">
                    {field.name}
                  </span>

                  {selected ? (
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 rounded-full border bg-white px-1.5 py-0 text-[10px] text-rose-600"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteField(field.id);
                      }}
                    >
                      x
                    </button>
                  ) : null}
                </div>
              </Rnd>
            );
          })}
        </div>
      </div>
    </div>
  );
}
