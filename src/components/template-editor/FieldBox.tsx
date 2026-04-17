import { X } from "lucide-react";
import { Rnd } from "react-rnd";
import type { RefObject } from "react";
import type { TemplateField } from "./types";

interface FieldBoxProps {
  field: TemplateField;
  containerRef: RefObject<HTMLDivElement | null>;
  isSelected: boolean;
  onSelect: (fieldId: string) => void;
  onDelete: (fieldId: string) => void;
  onUpdatePositionSize: (
    fieldId: string,
    updates: Pick<TemplateField, "x" | "y" | "w" | "h">,
  ) => void;
}

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

export default function FieldBox({
  field,
  containerRef,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePositionSize,
}: FieldBoxProps) {
  const containerRect = containerRef.current?.getBoundingClientRect();
  const containerWidth = containerRect?.width ?? 1;
  const containerHeight = containerRect?.height ?? 1;

  const xPx = (field.x / 100) * containerWidth;
  const yPx = (field.y / 100) * containerHeight;
  const wPx = (field.w / 100) * containerWidth;
  const hPx = (field.h / 100) * containerHeight;

  return (
    <Rnd
      bounds="parent"
      size={{ width: wPx, height: hPx }}
      position={{ x: xPx, y: yPx }}
      onMouseDown={(event) => {
        event.stopPropagation();
        onSelect(field.id);
      }}
      onDragStart={() => onSelect(field.id)}
      onDragStop={(_event, data) => {
        onUpdatePositionSize(field.id, {
          x: toPercent(data.x, containerWidth),
          y: toPercent(data.y, containerHeight),
          w: field.w,
          h: field.h,
        });
      }}
      onResizeStart={() => onSelect(field.id)}
      onResizeStop={(_event, _direction, ref, _delta, position) => {
        onUpdatePositionSize(field.id, {
          x: toPercent(position.x, containerWidth),
          y: toPercent(position.y, containerHeight),
          w: toPercent(ref.offsetWidth, containerWidth),
          h: toPercent(ref.offsetHeight, containerHeight),
        });
      }}
      className={`border bg-blue-50/20 ${
        isSelected ? "border-2 border-blue-600" : "border-blue-500"
      }`}
      enableUserSelectHack={false}
    >
      <div className="relative flex h-full w-full px-2 py-1">
        <div
          className="w-full overflow-hidden whitespace-nowrap"
          style={{
            textAlign: (field.align ?? "left") as "left" | "center" | "right",
            alignSelf: "center",
            fontFamily: mapFontFamily(field.fontFamily),
            fontWeight: mapFontWeight(field.fontFamily),
            fontSize: `${field.fontSize ?? 11}px`,
            color:
              field.type === "image" ? "#0f766e" : (field.color ?? "#1A1A1A"),
            lineHeight: 1.2,
          }}
        >
          {field.type === "image" ? "[signature]" : "Example"}
        </div>

        <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded bg-white/95 px-1.5 py-0 text-center text-[10px] font-medium text-blue-700 shadow-sm">
          {field.name}
        </span>

        {isSelected ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(field.id);
            }}
            className="absolute -right-2 -top-2 rounded-full border border-red-200 bg-white p-0.5 text-red-600 shadow hover:bg-red-50"
            aria-label={`Xóa field ${field.name}`}
          >
            <X className="size-3" />
          </button>
        ) : null}
      </div>
    </Rnd>
  );
}
