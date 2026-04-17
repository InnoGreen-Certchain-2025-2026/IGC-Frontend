import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  SchemaOptionsResponse,
  TemplateField,
  TemplateFieldType,
} from "@/types/template";

interface FieldSidebarProps {
  fields: TemplateField[];
  schemaOptions: SchemaOptionsResponse;
  optionsLoading?: boolean;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onUpdateField: (id: string, updates: Partial<TemplateField>) => void;
  onCreateField: (payload: { name: string; type: TemplateFieldType }) => void;
}

export default function FieldSidebar({
  fields,
  schemaOptions,
  optionsLoading = false,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onUpdateField,
  onCreateField,
}: FieldSidebarProps) {
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<TemplateFieldType>("text");
  const [fontSizeInput, setFontSizeInput] = useState("");

  const selectedField =
    fields.find((field) => field.id === selectedFieldId) ?? null;

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

  const createHint = useMemo(() => {
    if (newFieldType !== "image") return null;
    if (!newFieldName.trim()) {
      return 'Field image sẽ được tạo với tên "signature"';
    }
    if (newFieldName.trim() !== "signature") {
      return 'Field image phải có tên "signature"';
    }
    return null;
  }, [newFieldName, newFieldType]);

  const canCreateField = useMemo(() => {
    if (newFieldType === "image") {
      return !newFieldName.trim() || newFieldName.trim() === "signature";
    }

    return newFieldName.trim().length > 0;
  }, [newFieldName, newFieldType]);

  const handleCreateField = () => {
    if (!canCreateField) return;

    const normalizedName =
      newFieldType === "image"
        ? newFieldName.trim() || "signature"
        : newFieldName.trim();

    onCreateField({
      name: normalizedName,
      type: newFieldType,
    });

    setNewFieldName("");
    setNewFieldType("text");
  };

  return (
    <aside className="flex h-[72vh] flex-col rounded-xl border bg-white shadow-sm">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Field inspector</h3>
        <p className="text-xs text-slate-500">{fields.length} field(s)</p>

        <div className="mt-3 space-y-2 rounded-md border bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-700">
            Thêm field thủ công
          </p>

          <Input
            placeholder={newFieldType === "image" ? "signature" : "Tên field"}
            value={newFieldName}
            onChange={(event) => setNewFieldName(event.target.value)}
          />

          <Select
            value={newFieldType}
            onValueChange={(value) =>
              setNewFieldType(value as TemplateFieldType)
            }
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

          {createHint ? (
            <p className="text-[11px] text-amber-700">{createHint}</p>
          ) : null}

          <Button
            type="button"
            className="w-full"
            onClick={handleCreateField}
            disabled={!canCreateField}
          >
            Thêm field
          </Button>
        </div>
      </div>

      <ScrollArea className="h-56 border-b">
        <div className="space-y-2 p-3">
          {fields.length === 0 ? (
            <div className="rounded-md border border-dashed bg-slate-50 p-3 text-xs text-slate-500">
              Chưa có field nào.
            </div>
          ) : (
            fields.map((field) => {
              const active = field.id === selectedFieldId;
              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => onSelectField(field.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left ${active ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <p className="truncate text-sm font-medium text-slate-900">
                    {field.name}
                  </p>
                  <p className="text-xs text-slate-500">{field.type}</p>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="flex-1 space-y-3 p-4">
        {selectedField ? (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Name</label>
              <Input
                value={selectedField.name}
                onChange={(event) =>
                  onUpdateField(selectedField.id, {
                    name: event.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Type</label>
              <Select
                value={selectedField.type}
                onValueChange={(value) =>
                  onUpdateField(selectedField.id, {
                    type: value as TemplateFieldType,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
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
                <label className="text-xs font-medium text-slate-600">
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
                <label className="text-xs font-medium text-slate-600">
                  Color
                </label>
                <Input
                  value={selectedField.color ?? "#000000"}
                  onChange={(event) =>
                    onUpdateField(selectedField.id, {
                      color: event.target.value,
                    })
                  }
                  disabled={selectedField.type === "image"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">
                Font family
              </label>
              <Select
                value={
                  selectedField.fontFamily ?? schemaOptions.fontFamilies[0]
                }
                onValueChange={(value) =>
                  onUpdateField(selectedField.id, { fontFamily: value })
                }
                disabled={selectedField.type === "image" || optionsLoading}
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
              <label className="text-xs font-medium text-slate-600">
                Align
              </label>
              <Select
                value={selectedField.align ?? schemaOptions.alignments[0]}
                onValueChange={(value) =>
                  onUpdateField(selectedField.id, {
                    align: value as TemplateField["align"],
                  })
                }
                disabled={selectedField.type === "image" || optionsLoading}
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
                <label className="text-xs font-medium text-slate-600">
                  Demo kiểu chữ
                </label>
                <div
                  className="rounded-md border bg-slate-50 px-3 py-2"
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

            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => onDeleteField(selectedField.id)}
            >
              Xóa field
            </Button>
          </>
        ) : (
          <div className="rounded-md border border-dashed bg-slate-50 p-3 text-xs text-slate-500">
            Chọn một field để chỉnh sửa.
          </div>
        )}
      </div>
    </aside>
  );
}
