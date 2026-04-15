import { useMemo, useState } from "react";
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
import type { TemplateField, TemplateFieldType } from "@/types/template";

interface FieldSidebarProps {
  fields: TemplateField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onUpdateField: (id: string, updates: Partial<TemplateField>) => void;
  onCreateField: (payload: { name: string; type: TemplateFieldType }) => void;
}

export default function FieldSidebar({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onUpdateField,
  onCreateField,
}: FieldSidebarProps) {
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<TemplateFieldType>("text");

  const selectedField =
    fields.find((field) => field.id === selectedFieldId) ?? null;

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
                  type="number"
                  value={selectedField.fontSize ?? 12}
                  onChange={(event) =>
                    onUpdateField(selectedField.id, {
                      fontSize: Number(event.target.value),
                    })
                  }
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
                />
              </div>
            </div>

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
