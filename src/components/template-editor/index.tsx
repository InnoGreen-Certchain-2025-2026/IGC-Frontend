import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileUp, ZoomIn, ZoomOut, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Toolbar from "./Toolbar";
import FieldOverlay from "./FieldOverlay";
import FieldSidebar from "./FieldSidebar";
import FieldsListTab from "./FieldsListTab";
import { templateSchemaService } from "@/services/templateSchemaService";
import { templateApi } from "@/services/templateApi";
import type { EditorMode, FieldType, TemplateField } from "./types";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const PDF_WIDTH_BASE = 600;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function TemplateEditor({
  templateId,
  orgId,
}: {
  templateId?: string;
  orgId?: number;
} = {}) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>("select");
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"designer" | "fields">("designer");
  const [templatePdfUrl, setTemplatePdfUrl] = useState<string | null>(null);

  // Template management
  const [activeTemplateId, setActiveTemplateId] = useState<string | undefined>(
    templateId,
  );
  const [templateName, setTemplateName] = useState<string>("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const pdfWidth = Math.round(PDF_WIDTH_BASE * zoomLevel);

  useEffect(() => {
    if (!templateId || !orgId) {
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const loadTemplate = async () => {
      setIsAutoSaving(true);
      try {
        const response = await templateSchemaService.getTemplate(
          templateId,
          orgId,
        );
        if (cancelled) return;

        setActiveTemplateId(response.id);
        setTemplateName(response.name);
        setFields(response.fields ?? []);

        if (response.pdfUrl) {
          setTemplatePdfUrl(response.pdfUrl);
          return;
        }

        const blob = await templateApi.getTemplatePdfBlob(templateId, orgId);
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setTemplatePdfUrl(objectUrl);
      } catch (loadError) {
        if (cancelled) return;
        console.error("Lỗi khi tải template:", loadError);
        toast.error("Không thể tải template đã lưu");
      } finally {
        if (!cancelled) {
          setIsAutoSaving(false);
        }
      }
    };

    loadTemplate();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [orgId, templateId]);

  // Auto-save schema when fields change
  useEffect(() => {
    if (!activeTemplateId || !orgId || fields.length === 0) return;

    const saveTimeout = setTimeout(async () => {
      setIsAutoSaving(true);
      try {
        await templateSchemaService.saveSchema(activeTemplateId, orgId, fields);
        console.log("Auto-saved schema");
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 2000); // Debounce: save after 2 seconds of inactivity

    return () => clearTimeout(saveTimeout);
  }, [fields, activeTemplateId, orgId]);

  // Handle save template + schema
  const handleSaveTemplate = async () => {
    if (!orgId) {
      toast.error("Không thể lấy thông tin tổ chức");
      return;
    }

    if (!pdfFile && !activeTemplateId && !templatePdfUrl) {
      toast.error("Vui lòng upload PDF trước khi lưu template");
      return;
    }

    setIsSaving(true);
    try {
      let templateIdToSave = activeTemplateId;

      if (!templateIdToSave) {
        const fallbackName =
          templateName.trim() ||
          pdfFile?.name.replace(/\.pdf$/i, "") ||
          "Template";
        if (!pdfFile) {
          toast.error("Vui lòng chọn file PDF để tạo template mới");
          setIsSaving(false);
          return;
        }

        const createdTemplate = await templateSchemaService.uploadTemplate(
          orgId,
          fallbackName,
          fields,
          pdfFile,
        );
        templateIdToSave = createdTemplate.id;
        setActiveTemplateId(createdTemplate.id);
        setTemplateName(createdTemplate.name ?? fallbackName);
        toast.success("Template đã được tạo!");
        return;
      }

      await templateSchemaService.saveSchema(templateIdToSave, orgId, fields);
      toast.success("Schema đã được lưu!");
    } catch (error) {
      console.error("Lỗi khi lưu template:", error);
      toast.error("Lỗi khi lưu template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Handle keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Plus/Equals for zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        handleZoomIn();
      }
      // Ctrl/Cmd + Minus for zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      // Ctrl/Cmd + 0 for reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomLevel]);

  useEffect(() => {
    if (!pdfFile) {
      setPdfUrl(null);
      return;
    }

    const url = URL.createObjectURL(pdfFile);
    setPdfUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfFile]);

  const handleContainerMouseDown = (_e: React.MouseEvent) => {
    if (mode === "text-select") {
      containerRef.current?.focus();
    }
  };

  useEffect(() => {
    if (mode !== "text-select") return;

    const handleMouseDown = (): void => {
      // Reserved for future mouse tracking
    };

    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text) {
        setPendingName(text);
        selection?.removeAllRanges();
        setMode("draw");
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mode]);

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedId) ?? null,
    [fields, selectedId],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setPdfFile(null);
      setFields([]);
      setSelectedId(null);
      setPendingName(null);
      setMode("select");
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return;
    }

    setPdfFile(file);
    setTemplatePdfUrl(null);
    setFields([]);
    setSelectedId(null);
    setPendingName(null);
    setMode("text-select");
  };

  const handlePdfLoadSuccess = () => {
    // PDF rendered successfully
  };

  const handleCreateField = (
    field: Omit<TemplateField, "id" | "type"> & { type?: FieldType },
  ) => {
    const newField: TemplateField = {
      id: crypto.randomUUID(),
      name: field.name,
      type: field.type ?? "text",
      x: field.x,
      y: field.y,
      w: field.w,
      h: field.h,
    };

    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
    setMode("select");
    setPendingName(null);
  };

  const handleCreateManualField = (payload: {
    name: string;
    type: FieldType;
  }) => {
    handleCreateField({
      name: payload.name,
      type: payload.type,
      x: 10,
      y: 10,
      w: payload.type === "image" ? 20 : 28,
      h: payload.type === "image" ? 10 : 6,
    });
  };

  const updateField = (fieldId: string, updates: Partial<TemplateField>) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    );
  };

  const deleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
    setSelectedId((current) => (current === fieldId ? null : current));
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-slate-200 bg-linear-to-br from-[#214e41] via-[#336b59] to-[#1a3a32] p-5 shadow-md text-white">
        <div className="space-y-2">
          <Badge className="w-fit bg-[#f2ce3c] text-[#214e41] font-semibold">
            Template
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Trình chỉnh sửa template
          </h2>
          <p className="max-w-3xl text-sm text-slate-100">
            Upload PDF, bôi text hoặc vẽ vùng để thêm field, sau đó lưu schema
            template ngay trên cùng một màn hình.
          </p>
        </div>
      </header>

      {/* Compact horizontal guidance + actions bar */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-stretch">
          <div className="grid flex-1 gap-3 md:grid-cols-3">
            {[
              { title: "1. Upload PDF", description: "Chọn file template gốc" },
              {
                title: "2. Cấu hình fields",
                description: "Bôi text hoặc vẽ vùng trên PDF",
              },
              { title: "3. Submit", description: "Lưu template và schema" },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-xl border bg-slate-50 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {step.title}
                </p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border bg-blue-50 px-4 py-3">
            <div className="text-xs">
              <p className="font-medium text-blue-900">Hành động</p>
              <p className="text-blue-700">
                {isAutoSaving ? "Đang lưu tự động..." : "Sẵn sàng lưu thay đổi"}
              </p>
            </div>
            <Button
              onClick={handleSaveTemplate}
              disabled={
                isSaving || (!pdfFile && !activeTemplateId && !templatePdfUrl)
              }
              className="shrink-0 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Check className="mr-2 size-4" />
              {isSaving ? "Đang lưu..." : "Lưu template"}
            </Button>
          </div>
        </div>
      </div>

      <Toolbar
        mode={mode}
        pendingName={pendingName}
        selectedId={selectedId}
        onModeChange={setMode}
        onDeleteField={deleteField}
      />

      <div className="rounded-xl border bg-white shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "designer" | "fields")
          }
        >
          <TabsList className="border-b">
            <TabsTrigger value="designer">Thiết kế</TabsTrigger>
            <TabsTrigger value="fields">
              Danh sách đã được thêm ({fields.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designer" className="p-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
                    <FileUp className="size-4" />
                    Upload PDF
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {pdfFile ? (
                    <p className="text-sm text-gray-600">{pdfFile.name}</p>
                  ) : null}
                </div>

                {pdfFile ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 0.5}
                      title="Zoom out (Ctrl+-)"
                    >
                      <ZoomOut className="size-4" />
                    </Button>
                    <span className="min-w-15 text-center text-sm font-medium">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 2}
                      title="Zoom in (Ctrl++)"
                    >
                      <ZoomIn className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleResetZoom}
                      className="text-xs"
                      title="Reset zoom (Ctrl+0)"
                    >
                      Reset
                    </Button>
                  </div>
                ) : null}

                <div className="rounded-xl border bg-gray-100 p-4">
                  <ScrollArea
                    className="h-[70vh] w-full"
                    onMouseDown={(e) => {
                      // Clear pending text selection when clicking scrollbar
                      if (
                        (e.target as HTMLElement).closest(
                          '[data-slot="scroll-area-scrollbar"]',
                        )
                      ) {
                        setPendingName("");
                      }
                    }}
                  >
                    {pdfUrl || templatePdfUrl ? (
                      <div
                        className="flex justify-center"
                        style={{
                          minWidth: `${pdfWidth + 40}px`,
                        }}
                      >
                        <div
                          ref={containerRef}
                          className="mx-auto"
                          style={{
                            width: `${pdfWidth}px`,
                          }}
                        >
                          <div
                            className={`template-editor-pdf relative overflow-hidden rounded bg-white shadow-md ${
                              mode === "text-select"
                                ? "select-text"
                                : "select-none"
                            } ${mode === "draw" ? "draw-mode" : ""}`}
                            onMouseDown={handleContainerMouseDown}
                          >
                            <Document
                              file={pdfUrl ?? templatePdfUrl ?? undefined}
                              onLoadSuccess={handlePdfLoadSuccess}
                              loading={
                                <div className="p-4 text-sm text-gray-500">
                                  Đang tải PDF...
                                </div>
                              }
                            >
                              <Page
                                pageNumber={1}
                                width={pdfWidth}
                                className="template-editor-pdf-page"
                                renderTextLayer
                                renderAnnotationLayer={false}
                                loading={
                                  <div className="p-4 text-sm text-gray-500">
                                    Đang render trang...
                                  </div>
                                }
                              />
                            </Document>

                            {mode !== "text-select" ? (
                              <FieldOverlay
                                mode={mode}
                                pendingName={pendingName}
                                fields={fields}
                                selectedId={selectedId}
                                zoomLevel={zoomLevel}
                                overlayRef={overlayRef}
                                containerRef={containerRef}
                                onSelectField={setSelectedId}
                                onCreateField={handleCreateField}
                                onDeleteField={deleteField}
                                onUpdateField={(fieldId, updates) =>
                                  updateField(fieldId, updates)
                                }
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-90 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                        Hãy upload 1 file PDF để bắt đầu thiết kế template.
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {selectedField ? (
                  <p className="text-xs text-gray-500">
                    Đang chọn field:{" "}
                    <span className="font-medium text-gray-700">
                      {selectedField.name}
                    </span>
                  </p>
                ) : null}
              </div>

              <FieldSidebar
                fields={fields}
                selectedId={selectedId}
                onSelect={(fieldId) => {
                  setSelectedId(fieldId);
                  setMode("select");
                  setActiveTab("designer");
                }}
                onRename={(fieldId, name) => updateField(fieldId, { name })}
                onTypeChange={(fieldId, type) => updateField(fieldId, { type })}
                onDelete={deleteField}
                onCreateManualField={handleCreateManualField}
              />
            </div>
          </TabsContent>

          <TabsContent value="fields" className="p-4">
            <FieldsListTab fields={fields} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
