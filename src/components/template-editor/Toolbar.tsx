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

function getButtonClass(buttonMode: EditorMode, isActive: boolean) {
  const activeRing = isActive ? "ring-2 ring-offset-1 shadow-sm" : "";

  if (buttonMode === "select") {
    return `!border-[#214e41] !bg-[#214e41] !text-white hover:!bg-[#183930] ${activeRing} ${
      isActive ? "ring-[#4f9b5a]/40" : ""
    }`;
  }

  if (buttonMode === "text-select") {
    return `!border-[#f2ce3c] !bg-[#f2ce3c] !text-[#214e41] hover:!bg-[#e0bc1f] ${activeRing} ${
      isActive ? "ring-[#d39f10]/35" : ""
    }`;
  }

  return `!border-[#0ea5e9] !bg-[#0ea5e9] !text-white hover:!bg-[#0284c7] ${activeRing} ${
    isActive ? "ring-[#0284c7]/35" : ""
  }`;
}

function getHintClass(mode: EditorMode) {
  if (mode === "select") {
    return "bg-[#edf4f0] text-[#214e41] border border-[#cfe0d8]";
  }

  if (mode === "text-select") {
    return "bg-[#fef6d6] text-[#7a5b00] border border-[#f6db80]";
  }

  return "bg-[#e0f2fe] text-[#075985] border border-[#9fd8f8]";
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
          className={`keep-original-button-color ${getButtonClass("select", mode === "select")}`}
          onClick={() => onModeChange("select")}
        >
          <MousePointer2 className="size-4" />
          Chọn
        </Button>

        <Button
          type="button"
          variant="outline"
          className={`keep-original-button-color ${getButtonClass("text-select", mode === "text-select")}`}
          onClick={() => onModeChange("text-select")}
        >
          <Type className="size-4" />
          Bôi text
        </Button>

        <Button
          type="button"
          variant="outline"
          className={`keep-original-button-color ${getButtonClass("draw", mode === "draw")}`}
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
            className="ml-1 max-w-75 truncate border-[#f6db80] bg-[#fef6d6] text-[#7a5b00]"
            title={pendingName}
          >
            Tên field:{" "}
            {pendingName.length > 30
              ? pendingName.substring(0, 30) + "..."
              : pendingName}
          </Badge>
        ) : null}
      </div>

      <p
        className={`mt-2 rounded-lg px-2.5 py-2 text-sm wrap-break-word whitespace-normal ${getHintClass(mode)}`}
      >
        {modeHintMap[mode](pendingName)}
      </p>
    </div>
  );
}
