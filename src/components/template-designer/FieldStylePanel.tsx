import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  SchemaOptionsResponse,
  TemplateField,
  TemplateFieldAlign,
} from "@/types/template";

type FieldValidationError = {
  name?: string;
  bounds?: string;
  style?: string;
  imageRule?: string;
};

interface FieldStylePanelProps {
  selectedField: TemplateField | null;
  schemaOptions: SchemaOptionsResponse | null;
  fieldError: FieldValidationError | undefined;
  onUpdateField: (fieldId: string, updates: Partial<TemplateField>) => void;
  onUpdateStyleDebounced: (
    fieldId: string,
    updates: Partial<TemplateField>,
  ) => void;
}

function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </span>
      <Input
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function FieldStylePanel({
  selectedField,
  schemaOptions,
  fieldError,
  onUpdateField,
  onUpdateStyleDebounced,
}: FieldStylePanelProps) {
  if (!selectedField) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Style</h2>
        <p className="mt-4 rounded-lg border border-dashed p-3 text-xs text-slate-500">
          Chọn field ở cột bên trái để chỉnh style.
        </p>
      </aside>
    );
  }

  const minFontSize = schemaOptions?.minFontSize ?? 6;
  const maxFontSize = schemaOptions?.maxFontSize ?? 72;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Field Style</h2>
      <p className="mt-1 text-xs text-slate-500">
        Field:{" "}
        <span className="font-semibold text-slate-700">
          {selectedField.name}
        </span>
      </p>

      <div className="mt-4 space-y-3">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Name
          </span>
          <Input
            value={selectedField.name}
            onChange={(event) =>
              onUpdateField(selectedField.id, { name: event.target.value })
            }
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="X (%)"
            min={0}
            max={100}
            value={selectedField.x}
            onChange={(value) => onUpdateField(selectedField.id, { x: value })}
          />
          <NumberInput
            label="Y (%)"
            min={0}
            max={100}
            value={selectedField.y}
            onChange={(value) => onUpdateField(selectedField.id, { y: value })}
          />
          <NumberInput
            label="W (%)"
            min={0}
            max={100}
            value={selectedField.w}
            onChange={(value) => onUpdateField(selectedField.id, { w: value })}
          />
          <NumberInput
            label="H (%)"
            min={0}
            max={100}
            value={selectedField.h}
            onChange={(value) => onUpdateField(selectedField.id, { h: value })}
          />
        </div>

        {selectedField.type === "image" ? (
          <p className="rounded-lg border border-sky-200 bg-sky-50 p-2 text-xs text-sky-700">
            Field image chỉ hỗ trợ vị trí và kích thước, không chỉnh style text.
          </p>
        ) : (
          <>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Font family
              </span>
              <Select
                value={selectedField.fontFamily ?? ""}
                onValueChange={(value) =>
                  onUpdateStyleDebounced(selectedField.id, {
                    fontFamily: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn font" />
                </SelectTrigger>
                <SelectContent>
                  {(schemaOptions?.fontFamilies ?? []).map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                label="Font size"
                min={minFontSize}
                max={maxFontSize}
                value={selectedField.fontSize ?? minFontSize}
                onChange={(value) =>
                  onUpdateStyleDebounced(selectedField.id, { fontSize: value })
                }
              />

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Align
                </span>
                <Select
                  value={selectedField.align ?? "left"}
                  onValueChange={(value) =>
                    onUpdateStyleDebounced(selectedField.id, {
                      align: value as TemplateFieldAlign,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      schemaOptions?.alignments ?? ["left", "center", "right"]
                    ).map((alignment) => (
                      <SelectItem key={alignment} value={alignment}>
                        {alignment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Color (#RRGGBB)
              </span>
              <Input
                value={selectedField.color ?? "#1A1A1A"}
                onChange={(event) =>
                  onUpdateStyleDebounced(selectedField.id, {
                    color: event.target.value,
                  })
                }
              />
            </label>
          </>
        )}
      </div>

      {fieldError ? (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <p>{fieldError.name}</p>
          <p>{fieldError.bounds}</p>
          <p>{fieldError.style}</p>
          <p>{fieldError.imageRule}</p>
        </div>
      ) : null}
    </aside>
  );
}
