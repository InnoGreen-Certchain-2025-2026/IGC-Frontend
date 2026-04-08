import { MousePointer2, Square, Type, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EditorMode } from "./types";

interface ToolbarProps {
  mode: EditorMode;
  pendingName: string | null;
  selectedId: string | null;
  onModeChange: (nextMode: EditorMode) => void;
  onDeleteField: (fieldId: string) => void;
}

const modeHintMap: Record<EditorMode, (pendingName: string | null) => string> =
  {
    select: () => "Chọn field để chỉnh sửa hoặc di chuyển.",
    "text-select": () => "Bôi đen text trên PDF để đặt tên field",
    draw: (pendingName) => {
      const displayName = pendingName
        ? pendingName.length > 50
          ? pendingName.substring(0, 50) + "..."
          : pendingName
        : "";
      return displayName
        ? `Đang vẽ vùng cho field "${displayName}" — kéo chuột trên PDF`
        : "Hãy bôi text trước để có tên field";
    },
  };

function getButtonClass(isActive: boolean) {
  return isActive
    ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
    : "border-gray-200";
}

export default function Toolbar({
  mode,
  pendingName,
  selectedId,
  onModeChange,
  onDeleteField,
}: ToolbarProps) {
  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className={getButtonClass(mode === "select")}
          onClick={() => onModeChange("select")}
        >
          <MousePointer2 className="size-4" />
          Chọn
        </Button>

        <Button
          type="button"
          variant="outline"
          className={getButtonClass(mode === "text-select")}
          onClick={() => onModeChange("text-select")}
        >
          <Type className="size-4" />
          Bôi text
        </Button>

        <Button
          type="button"
          variant="outline"
          className={getButtonClass(mode === "draw")}
          onClick={() => onModeChange("draw")}
        >
          <Square className="size-4" />
          Vẽ vùng
        </Button>

        {selectedId ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onDeleteField(selectedId)}
            title="Delete selected field"
          >
            <Trash2 className="size-4" />
            Xóa
          </Button>
        ) : null}

        {pendingName ? (
          <Badge
            variant="outline"
            className="ml-1 border-blue-200 bg-blue-50 text-blue-700 max-w-[300px] truncate"
            title={pendingName}
          >
            Tên field:{" "}
            {pendingName.length > 30
              ? pendingName.substring(0, 30) + "..."
              : pendingName}
          </Badge>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-gray-600 break-words whitespace-normal">
        {modeHintMap[mode](pendingName)}
      </p>
    </div>
  );
}
