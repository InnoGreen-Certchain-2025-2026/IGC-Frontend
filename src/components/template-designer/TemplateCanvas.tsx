import { useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import { Loader2, TriangleAlert } from "lucide-react";
import type { TemplateField } from "@/types/template";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface TemplateCanvasProps {
  pdfUrl: string | null;
  fields: TemplateField[];
  selectedFieldId: string | null;
  isLoadingPdf: boolean;
  pdfError: string | null;
  onSelectField: (fieldId: string | null) => void;
  onUpdateField: (fieldId: string, updates: Partial<TemplateField>) => void;
}

const fontFamilyMap: Record<string, string> = {
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

function toPercent(valuePx: number, totalPx: number) {
  if (totalPx <= 0) return 0;
  return Number(((valuePx / totalPx) * 100).toFixed(2));
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

export default function TemplateCanvas({
  pdfUrl,
  fields,
  selectedFieldId,
  isLoadingPdf,
  pdfError,
  onSelectField,
  onUpdateField,
}: TemplateCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  if (isLoadingPdf) {
    return (
      <section className="flex h-[65vh] items-center justify-center rounded-2xl border bg-white text-sm text-slate-600">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Đang tải PDF...
      </section>
    );
  }

  if (!pdfUrl) {
    return (
      <section className="flex h-[65vh] items-center justify-center rounded-2xl border border-dashed bg-slate-50 px-4 text-center text-sm text-slate-500">
        {pdfError ?? "Upload file PDF để bắt đầu đặt field lên template."}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm">
      <div className="relative mx-auto w-fit" ref={wrapperRef}>
        <Document
          file={pdfUrl}
          loading={
            <div className="p-4 text-sm text-slate-500">
              Đang mở tài liệu...
            </div>
          }
          error={
            <div className="flex items-center gap-2 p-4 text-sm text-rose-700">
              <TriangleAlert className="size-4" />
              Không thể render PDF.
            </div>
          }
        >
          <Page
            pageNumber={1}
            width={760}
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
            const rect = wrapperRef.current?.getBoundingClientRect();
            const width = rect?.width ?? 1;
            const height = rect?.height ?? 1;

            const selected = field.id === selectedFieldId;
            const xPx = (clampPercent(field.x) / 100) * width;
            const yPx = (clampPercent(field.y) / 100) * height;
            const wPx = (clampPercent(field.w) / 100) * width;
            const hPx = (clampPercent(field.h) / 100) * height;

            const isImage = field.type === "image";
            const normalizedFont = (
              field.fontFamily ?? "helvetica"
            ).toLowerCase();
            const fontFamily =
              fontFamilyMap[normalizedFont] ?? "Helvetica, Arial, sans-serif";
            const fontWeight = normalizedFont.includes("bold") ? 700 : 500;

            return (
              <Rnd
                key={field.id}
                bounds="parent"
                position={{ x: xPx, y: yPx }}
                size={{ width: Math.max(wPx, 20), height: Math.max(hPx, 16) }}
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
                onResizeStop={(_event, _direction, ref, _delta, position) => {
                  onUpdateField(field.id, {
                    x: toPercent(position.x, width),
                    y: toPercent(position.y, height),
                    w: toPercent(ref.offsetWidth, width),
                    h: toPercent(ref.offsetHeight, height),
                  });
                }}
                className={`border ${selected ? "border-[#214e41]" : "border-[#214e41]/40"} bg-[#214e41]/5`}
                enableUserSelectHack={false}
              >
                <div
                  className="flex h-full w-full items-center px-2"
                  style={{
                    justifyContent:
                      field.align === "center"
                        ? "center"
                        : field.align === "right"
                          ? "flex-end"
                          : "flex-start",
                    color: isImage ? "#214e41" : (field.color ?? "#1A1A1A"),
                    fontSize: `${Math.max(8, (field.fontSize ?? 11) * (width / 760))}px`,
                    fontFamily,
                    fontWeight,
                  }}
                >
                  {isImage ? "[signature]" : "Example"}
                </div>
              </Rnd>
            );
          })}
        </div>
      </div>
    </section>
  );
}
