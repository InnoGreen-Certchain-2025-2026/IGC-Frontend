import { type TemplateField } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface FieldsListTabProps {
  fields: TemplateField[];
}

function formatPosition(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function FieldsListTab({ fields }: FieldsListTabProps) {
  if (fields.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm font-medium text-gray-700">
          Chưa có field nào được thêm
        </p>
        <p className="mt-2 text-xs text-gray-600">
          Sử dụng bôi text + vẽ vùng để thêm fields vào template
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-3 p-4">
        {fields.map((field, index) => (
          <Card
            key={field.id}
            className="border border-gray-200 p-4 hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{field.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  <span className="inline-block rounded bg-gray-100 px-2 py-1">
                    {field.type}
                  </span>
                </p>
              </div>
              <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                #{index + 1}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded bg-gray-50 p-2 text-xs text-gray-600">
              <div>
                <p className="font-medium text-gray-700">X</p>
                <p>{formatPosition(field.x)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Y</p>
                <p>{formatPosition(field.y)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Rộng</p>
                <p>{formatPosition(field.w)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Cao</p>
                <p>{formatPosition(field.h)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
