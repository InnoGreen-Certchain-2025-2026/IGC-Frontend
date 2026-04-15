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
      <div className="relative flex h-full w-full items-center justify-center">
        <span className="rounded bg-white/85 px-2 py-0.5 text-center text-[11px] font-medium text-blue-700 shadow-sm">
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
