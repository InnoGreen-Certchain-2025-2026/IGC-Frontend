import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import FieldBox from "./FieldBox";
import type { EditorMode, TemplateField } from "./types";

interface FieldOverlayProps {
  mode: EditorMode;
  pendingName: string | null;
  fields: TemplateField[];
  selectedId: string | null;
  zoomLevel: number;
  overlayRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  onSelectField: (fieldId: string | null) => void;
  onCreateField: (
    field: Omit<TemplateField, "id" | "type"> & {
      type?: TemplateField["type"];
    },
  ) => void;
  onDeleteField: (fieldId: string) => void;
  onUpdateField: (
    fieldId: string,
    updates: Pick<TemplateField, "x" | "y" | "w" | "h">,
  ) => void;
}

interface DrawState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toPercent(valuePx: number, totalPx: number) {
  if (totalPx <= 0) return 0;
  return Number(((valuePx / totalPx) * 100).toFixed(2));
}

export default function FieldOverlay({
  mode,
  pendingName,
  fields,
  selectedId,
  zoomLevel,
  overlayRef,
  containerRef,
  onSelectField,
  onCreateField,
  onDeleteField,
  onUpdateField,
}: FieldOverlayProps) {
  const [drawState, setDrawState] = useState<DrawState | null>(null);
  const drawStateRef = useRef<DrawState | null>(null);

  const previewRect = useMemo(() => {
    if (!drawState) return null;

    const x = Math.min(drawState.startX, drawState.currentX);
    const y = Math.min(drawState.startY, drawState.currentY);
    const width = Math.abs(drawState.currentX - drawState.startX);
    const height = Math.abs(drawState.currentY - drawState.startY);

    return { x, y, width, height };
  }, [drawState]);

  const getRelativePoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;

    return {
      x: clamp(clientX - rect.left, 0, rect.width),
      y: clamp(clientY - rect.top, 0, rect.height),
      width: rect.width,
      height: rect.height,
    };
  };

  useEffect(() => {
    if (mode !== "draw") {
      drawStateRef.current = null;
      setDrawState(null);
      return;
    }

    const handleMouseDown = (event: globalThis.MouseEvent) => {
      if (!pendingName || !containerRef.current) return;

      const container = containerRef.current;
      if (!container.contains(event.target as Node)) return;

      const point = getRelativePoint(event.clientX, event.clientY);
      if (!point) return;

      event.preventDefault();
      onSelectField(null);

      const nextDrawState = {
        startX: point.x,
        startY: point.y,
        currentX: point.x,
        currentY: point.y,
      };

      drawStateRef.current = nextDrawState;
      setDrawState(nextDrawState);
    };

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const currentDrawState = drawStateRef.current;
      if (!currentDrawState) return;

      const point = getRelativePoint(event.clientX, event.clientY);
      if (!point) return;

      event.preventDefault();

      const nextDrawState = {
        ...currentDrawState,
        currentX: point.x,
        currentY: point.y,
      };

      drawStateRef.current = nextDrawState;
      setDrawState(nextDrawState);
    };

    const handleMouseUp = (event: globalThis.MouseEvent) => {
      const currentDrawState = drawStateRef.current;
      if (!currentDrawState || !pendingName || !containerRef.current) {
        drawStateRef.current = null;
        setDrawState(null);
        return;
      }

      const point = getRelativePoint(event.clientX, event.clientY);
      if (!point) {
        drawStateRef.current = null;
        setDrawState(null);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(currentDrawState.startX, point.x);
      const y = Math.min(currentDrawState.startY, point.y);
      const w = Math.abs(point.x - currentDrawState.startX);
      const h = Math.abs(point.y - currentDrawState.startY);

      drawStateRef.current = null;
      setDrawState(null);

      if (w < 8 || h < 8) {
        return;
      }

      onCreateField({
        name: pendingName,
        x: toPercent(x, rect.width),
        y: toPercent(y, rect.height),
        w: toPercent(w, rect.width),
        h: toPercent(h, rect.height),
        type: "text",
      });
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    containerRef,
    mode,
    onCreateField,
    onSelectField,
    pendingName,
    zoomLevel,
  ]);

  const pointerEvents = mode === "select" ? "auto" : "none";

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-20"
      style={{ pointerEvents }}
      onClick={(event) => {
        if (event.target === event.currentTarget && mode === "select") {
          onSelectField(null);
        }
      }}
    >
      {fields.map((field) => (
        <FieldBox
          key={field.id}
          field={field}
          containerRef={containerRef}
          isSelected={selectedId === field.id}
          onSelect={(fieldId) => onSelectField(fieldId)}
          onDelete={onDeleteField}
          onUpdatePositionSize={onUpdateField}
        />
      ))}

      {previewRect ? (
        <div
          className="pointer-events-none absolute border-2 border-dashed border-blue-500 bg-blue-100/15"
          style={{
            left: previewRect.x,
            top: previewRect.y,
            width: previewRect.width,
            height: previewRect.height,
          }}
        />
      ) : null}
    </div>
  );
}
