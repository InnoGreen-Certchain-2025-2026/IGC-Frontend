import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { templateApi } from "@/services/templateApi";
import type {
  SaveSchemaRequest,
  TemplateField,
  TemplateFieldType,
  TemplateResponse,
} from "@/types/template";

function validateFields(fields: TemplateField[]) {
  const normalizedNames = new Set<string>();

  for (const field of fields) {
    const trimmedName = field.name.trim();

    if (!trimmedName) {
      return "Tên field không được để trống";
    }

    const key = trimmedName.toLowerCase();
    if (normalizedNames.has(key)) {
      return `Tên field \"${trimmedName}\" đang bị trùng`;
    }

    if (field.type === "image" && trimmedName !== "signature") {
      return 'Field type=image phải có name là "signature"';
    }

    normalizedNames.add(key);
  }

  return null;
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined;

    if (typeof responseData === "string" && responseData.trim()) {
      return responseData;
    }

    if (responseData && typeof responseData === "object") {
      if (responseData.message) return responseData.message;
      if (responseData.error) return responseData.error;
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function useTemplateEditor(templateId?: string, orgId?: number) {
  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const [metadataLoading, setMetadataLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const hasContext = Boolean(templateId && orgId);

  const loadTemplateEditorData = useCallback(async () => {
    if (!templateId || !orgId) {
      return;
    }

    setMetadataLoading(true);
    setErrorMessage(null);

    try {
      const nextTemplate = await templateApi.getTemplateById(templateId, orgId);
      setTemplate(nextTemplate);
      setFields(nextTemplate.fields ?? []);
      setSelectedFieldId((current) => {
        if (!current) return null;
        return (nextTemplate.fields ?? []).some((item) => item.id === current)
          ? current
          : null;
      });
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Không thể tải metadata template",
      );
      setErrorMessage(message);
      toast.error(message);
      return;
    } finally {
      setMetadataLoading(false);
    }

    setPdfLoading(true);

    let nextObjectUrl: string | null = null;

    try {
      const pdfBlob = await templateApi.getTemplatePdfBlob(templateId, orgId);

      if (!pdfBlob || !pdfBlob.type.toLowerCase().includes("pdf")) {
        throw new Error("Invalid PDF response");
      }

      nextObjectUrl = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return nextObjectUrl;
      });
      nextObjectUrl = null;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Không thể tải file PDF template",
      );
      setErrorMessage(message);
      toast.error(message);
    } finally {
      if (nextObjectUrl) {
        URL.revokeObjectURL(nextObjectUrl);
      }
      setPdfLoading(false);
    }
  }, [orgId, templateId]);

  const reloadAll = useCallback(async () => {
    if (!hasContext) {
      return;
    }

    await loadTemplateEditorData();
  }, [hasContext, loadTemplateEditorData]);

  useEffect(() => {
    if (!hasContext) {
      return;
    }

    loadTemplateEditorData();
  }, [hasContext, loadTemplateEditorData]);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const addField = useCallback(
    (options?: { name?: string; type?: TemplateFieldType }) => {
      const normalizedType = options?.type ?? "text";
      const fallbackName =
        normalizedType === "image" ? "signature" : `field_${fields.length + 1}`;
      const normalizedName = options?.name?.trim() || fallbackName;

      const newField: TemplateField = {
        id: crypto.randomUUID(),
        name: normalizedName,
        type: normalizedType,
        x: 10,
        y: 10,
        w: 20,
        h: 6,
        fontSize: 12,
        fontFamily: "Helvetica",
        align: "left",
        color: "#000000",
      };

      setFields((current) => [...current, newField]);
      setSelectedFieldId(newField.id);
    },
    [fields.length],
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<TemplateField>) => {
      setFields((current) =>
        current.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field,
        ),
      );
    },
    [],
  );

  const removeField = useCallback((fieldId: string) => {
    setFields((current) => current.filter((item) => item.id !== fieldId));
    setSelectedFieldId((current) => (current === fieldId ? null : current));
  }, []);

  const saveSchema = useCallback(async () => {
    if (!templateId || !orgId) {
      toast.error("Thiếu templateId hoặc orgId");
      return false;
    }

    const validationError = validateFields(fields);
    if (validationError) {
      toast.error(validationError);
      return false;
    }

    const payload: SaveSchemaRequest = {
      id: orgId,
      fields,
    };

    setSaveLoading(true);
    setErrorMessage(null);

    try {
      const response = await templateApi.saveTemplateSchema(
        templateId,
        payload,
      );
      setTemplate(response);
      setFields(response.fields ?? []);
      setLastSavedAt(new Date().toISOString());
      toast.success("Lưu schema thành công");
      return true;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Không thể lưu schema template",
      );
      setErrorMessage(message);
      toast.error(message);
      return false;
    } finally {
      setSaveLoading(false);
    }
  }, [fields, orgId, templateId]);

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) ?? null,
    [fields, selectedFieldId],
  );

  return {
    hasContext,
    template,
    fields,
    selectedField,
    selectedFieldId,
    pdfBlobUrl,
    metadataLoading,
    pdfLoading,
    saveLoading,
    saveSchemaLoading: saveLoading,
    error: errorMessage,
    errorMessage,
    lastSavedAt,
    setFields,
    setSelectedFieldId,
    updateField,
    removeField,
    addField,
    saveSchema,
    reloadAll,
  };
}
