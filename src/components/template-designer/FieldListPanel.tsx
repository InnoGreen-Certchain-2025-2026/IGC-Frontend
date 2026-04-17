import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateFieldType } from "@/types/template";

type FieldValidationErrors = Record<
  string,
  {
    name?: string;
    bounds?: string;
    style?: string;
    imageRule?: string;
  }
>;

interface FieldListPanelProps {
  selectedFieldId: string | null;
  fieldErrors: FieldValidationErrors;
  onSelectField: (fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
  onAddField: (type: TemplateFieldType) => void;
  fields: Array<{
    id: string;
    name: string;
    type: TemplateFieldType;
  }>;
}

export default function FieldListPanel({
  selectedFieldId,
  fieldErrors,
  onSelectField,
  onRemoveField,
  onAddField,
  fields,
}: FieldListPanelProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Fields</h2>
        <span className="text-xs text-slate-500">{fields.length}</span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddField("text")}
        >
          + Text
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddField("date")}
        >
          + Date
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddField("number")}
        >
          + Number
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddField("image")}
        >
          + Signature
        </Button>
      </div>

      <div className="space-y-2">
        {fields.length === 0 ? (
          <p className="rounded-lg border border-dashed p-3 text-xs text-slate-500">
            Chưa có field. Thêm field để bắt đầu thiết kế.
          </p>
        ) : (
          fields.map((field) => {
            const isSelected = field.id === selectedFieldId;
            const error = fieldErrors[field.id];

            return (
              <button
                key={field.id}
                type="button"
                onClick={() => onSelectField(field.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  isSelected
                    ? "border-[#214e41] bg-[#214e41]/5"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {field.name}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {field.type}
                    </p>
                    {error ? (
                      <p className="mt-1 text-xs text-rose-600">
                        {error.name ||
                          error.bounds ||
                          error.style ||
                          error.imageRule}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveField(field.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
