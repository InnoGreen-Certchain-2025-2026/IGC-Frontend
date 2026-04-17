import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldType, TemplateField } from "./types";
import type { SchemaOptionsResponse } from "@/types/template";

interface FieldSidebarProps {
  fields: TemplateField[];
  schemaOptions: SchemaOptionsResponse;
  selectedId: string | null;
  onSelect: (fieldId: string) => void;
  onRename: (fieldId: string, name: string) => void;
  onTypeChange: (fieldId: string, type: FieldType) => void;
  onUpdateField: (fieldId: string, updates: Partial<TemplateField>) => void;
  onDelete: (fieldId: string) => void;
  onCreateManualField: (payload: { name: string; type: FieldType }) => void;
}

function formatPosition(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function FieldSidebar({
  fields,
  schemaOptions,
  selectedId,
  onSelect,
  onRename,
  onTypeChange,
  onUpdateField,
  onDelete,
  onCreateManualField,
}: FieldSidebarProps) {
  const [manualName, setManualName] = useState("");
  const [manualType, setManualType] = useState<FieldType>("text");
  const [fontSizeInput, setFontSizeInput] = useState("");

  const selectedField = fields.find((field) => field.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedField || selectedField.type === "image") {
      setFontSizeInput("");
      return;
    }
    setFontSizeInput(
      String(selectedField.fontSize ?? schemaOptions.defaultFontSize),
    );
  }, [
    schemaOptions.defaultFontSize,
    selectedField?.fontSize,
    selectedField?.id,
    selectedField?.type,
  ]);

  const commitFontSizeInput = () => {
    if (!selectedField || selectedField.type === "image") return;

    const raw = fontSizeInput.trim();
    const fallback = selectedField.fontSize ?? schemaOptions.defaultFontSize;

    if (!raw) {
      setFontSizeInput(String(fallback));
      return;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setFontSizeInput(String(fallback));
      return;
    }

    const bounded = Math.max(
      schemaOptions.minFontSize,
      Math.min(schemaOptions.maxFontSize, parsed),
    );

    onUpdateField(selectedField.id, { fontSize: bounded });
    setFontSizeInput(String(bounded));
  };

  const previewFontMap: Record<string, string> = {
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

  const manualHint = useMemo(() => {
    if (manualType !== "image") return null;
    if (!manualName.trim())
      return 'Field image sẽ dùng tên mặc định "signature"';
    if (manualName.trim() !== "signature") {
      return 'Khuyến nghị đặt tên "signature" cho field image';
    }
    return null;
  }, [manualName, manualType]);

  const canCreateManualField = useMemo(() => {
    if (manualType === "image") {
      return !manualName.trim() || manualName.trim() === "signature";
    }

    return manualName.trim().length > 0;
  }, [manualName, manualType]);

  const handleCreateManualField = () => {
    if (!canCreateManualField) return;

    const normalizedName =
      manualType === "image"
        ? manualName.trim() || "signature"
        : manualName.trim();

    onCreateManualField({
      name: normalizedName,
      type: manualType,
    });

    setManualName("");
    setManualType("text");
  };

  return (
    <aside className="flex h-full w-full flex-col rounded-xl border bg-white shadow-sm lg:w-65">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Fields ({fields.length})</h3>

        <div className="mt-3 space-y-2 rounded-lg border bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-700">
            Thêm field thủ công
          </p>

          <Input
            value={manualName}
            placeholder={manualType === "image" ? "signature" : "Tên field"}
            onChange={(event) => setManualName(event.target.value)}
          />

          <Select
            value={manualType}
            onValueChange={(value) => setManualType(value as FieldType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">text</SelectItem>
              <SelectItem value="date">date</SelectItem>
              <SelectItem value="number">number</SelectItem>
              <SelectItem value="image">image (signature)</SelectItem>
            </SelectContent>
          </Select>

          {manualHint ? (
            <p className="text-[11px] text-amber-700">{manualHint}</p>
          ) : null}

          <Button
            type="button"
            onClick={handleCreateManualField}
            disabled={!canCreateManualField}
            className="w-full"
          >
            Thêm field
          </Button>
        </div>
      </div>

      <ScrollArea className="h-64 border-b">
        <div className="space-y-2 p-3">
          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-gray-50 p-3 text-xs text-gray-600">
              <p className="font-medium text-gray-700">Chưa có field nào.</p>
              <p className="mt-2">
                1. Chọn "Bôi text" rồi bôi đen tên field trên PDF.
              </p>
              <p>2. Chọn "Vẽ vùng" rồi kéo chuột để tạo vùng.</p>
            </div>
          ) : (
            fields.map((field) => {
              const isActive = field.id === selectedId;

              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => onSelect(field.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="truncate font-medium">{field.name}</p>
                  <p className="text-xs text-gray-500">{field.type}</p>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="flex-1 p-4">
        {selectedField ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Properties</h4>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Tên field
              </label>
              <Input
                value={selectedField.name}
                onChange={(event) =>
                  onRename(selectedField.id, event.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Loại dữ liệu
              </label>
              <Select
                value={selectedField.type}
                onValueChange={(value) =>
                  onTypeChange(selectedField.id, value as FieldType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại dữ liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">text</SelectItem>
                  <SelectItem value="date">date</SelectItem>
                  <SelectItem value="number">number</SelectItem>
                  <SelectItem value="image">image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Font size
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={fontSizeInput}
                  onChange={(event) => setFontSizeInput(event.target.value)}
                  onBlur={commitFontSizeInput}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitFontSizeInput();
                    }
                  }}
                  disabled={selectedField.type === "image"}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Color
                </label>
                <Input
                  value={selectedField.color ?? "#1A1A1A"}
                  onChange={(event) =>
                    onUpdateField(selectedField.id, {
                      color: event.target.value,
                    })
                  }
                  onBlur={(event) => {
                    // Keep this input controlled by parent update below.
                    event.currentTarget.value =
                      event.currentTarget.value || "#1A1A1A";
                  }}
                  disabled={selectedField.type === "image"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Font family
              </label>
              <Select
                value={
                  selectedField.fontFamily ?? schemaOptions.fontFamilies[0]
                }
                onValueChange={(value) =>
                  onUpdateField(selectedField.id, { fontFamily: value })
                }
                disabled={selectedField.type === "image"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schemaOptions.fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Align</label>
              <Select
                value={selectedField.align ?? schemaOptions.alignments[0]}
                onValueChange={(value) =>
                  onUpdateField(selectedField.id, {
                    align: value as TemplateField["align"],
                  })
                }
                disabled={selectedField.type === "image"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schemaOptions.alignments.map((alignment) => (
                    <SelectItem key={alignment} value={alignment}>
                      {alignment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedField.type === "image" ? (
              <div className="rounded-md border border-sky-200 bg-sky-50 p-2 text-xs text-sky-700">
                Field image không chỉnh style text.
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Demo kiểu chữ
                </label>
                <div
                  className="rounded-md border bg-gray-50 px-3 py-2"
                  style={{
                    fontFamily:
                      previewFontMap[selectedField.fontFamily ?? "helvetica"] ??
                      "Helvetica, Arial, sans-serif",
                    fontWeight: (selectedField.fontFamily ?? "").includes(
                      "bold",
                    )
                      ? 700
                      : 500,
                    fontSize: `${selectedField.fontSize ?? schemaOptions.defaultFontSize}px`,
                    color: selectedField.color ?? "#1A1A1A",
                    textAlign: (selectedField.align ?? "left") as
                      | "left"
                      | "center"
                      | "right",
                  }}
                >
                  Example
                </div>
              </div>
            )}

            <div className="rounded-md border bg-gray-50 p-3 text-xs text-gray-600">
              <p>x: {formatPosition(selectedField.x)}</p>
              <p>y: {formatPosition(selectedField.y)}</p>
              <p>w: {formatPosition(selectedField.w)}</p>
              <p>h: {formatPosition(selectedField.h)}</p>
            </div>

            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => onDelete(selectedField.id)}
            >
              <Trash2 className="size-4" />
              Xóa field
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-dashed bg-gray-50 p-3 text-xs text-gray-600">
            Chọn một field để chỉnh sửa thuộc tính.
          </div>
        )}
      </div>
    </aside>
  );
}
