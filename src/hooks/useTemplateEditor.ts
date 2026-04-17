import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { templateApi } from "@/services/templateApi";
import { getS3Url } from "@/lib/utils";
import type {
  SaveSchemaRequest,
  SchemaOptionsResponse,
  TemplateField,
  TemplateFieldAlign,
  TemplateFieldType,
  TemplateResponse,
} from "@/types/template";

function isBlobUrl(url?: string | null) {
  return Boolean(url && url.startsWith("blob:"));
}

function resolveTemplatePdfUrl(template: TemplateResponse): string | null {
  const candidate = (template.pdfUrl || template.pdfStorageKey || "").trim();
  if (!candidate) return null;

  // API routes like /api/templates/{id}/pdf must NOT be transformed to S3.
  if (candidate.startsWith("/api/") || candidate.startsWith("api/")) {
    return null;
  }

  // Keep absolute URLs unchanged (signed URL / CDN / S3 direct URL).
  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  // For storage keys/relative paths, derive full S3 URL from env.
  return getS3Url(candidate);
}

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const DEFAULT_SCHEMA_OPTIONS: SchemaOptionsResponse = {
  fontFamilies: [
    "helvetica",
    "helvetica-bold",
    "times",
    "times-bold",
    "courier",
    "courier-bold",
    "arial",
    "arial-bold",
    "sans-serif",
    "sans-bold",
    "serif",
    "serif-bold",
    "monospace",
    "mono-bold",
  ],
  alignments: ["left", "center", "right"],
  minFontSize: 6,
  maxFontSize: 72,
  defaultFontSize: 11,
};

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Number(value.toFixed(2))));
}

function normalizeField(
  field: TemplateField,
  options: SchemaOptionsResponse,
): TemplateField {
  const normalizedField: TemplateField = {
    ...field,
    x: clampPercent(field.x),
    y: clampPercent(field.y),
    w: clampPercent(field.w),
    h: clampPercent(field.h),
  };

  if (field.type === "image") {
    return {
      ...normalizedField,
      name: "signature",
      fontFamily: undefined,
      fontSize: undefined,
      align: undefined,
      color: undefined,
    };
  }

  const fallbackFont =
    options.fontFamilies[0] ?? DEFAULT_SCHEMA_OPTIONS.fontFamilies[0];
  const fontFamily =
    field.fontFamily && options.fontFamilies.includes(field.fontFamily)
      ? field.fontFamily
      : fallbackFont;

  const fallbackAlign = options.alignments[0] ?? "left";
  const align =
    field.align && options.alignments.includes(field.align)
      ? field.align
      : fallbackAlign;

  const fontSize = Number(field.fontSize ?? options.defaultFontSize);
  const boundedFontSize = Math.max(
    options.minFontSize,
    Math.min(
      options.maxFontSize,
      Number.isFinite(fontSize) ? fontSize : options.defaultFontSize,
    ),
  );

  const color =
    field.color && HEX_COLOR_PATTERN.test(field.color)
      ? field.color
      : "#1A1A1A";

  return {
    ...normalizedField,
    fontFamily,
    align: align as TemplateFieldAlign,
    fontSize: boundedFontSize,
    color,
  };
}

function validateFields(
  fields: TemplateField[],
  options: SchemaOptionsResponse,
) {
  const normalizedNames = new Set<string>();
  let imageCount = 0;

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

    if (field.type === "image") {
      imageCount += 1;
      if (imageCount > 1) {
        return 'Chỉ được có 1 field image tên "signature"';
      }
    }

    if (
      !Number.isFinite(field.x) ||
      !Number.isFinite(field.y) ||
      !Number.isFinite(field.w) ||
      !Number.isFinite(field.h) ||
      field.x < 0 ||
      field.y < 0 ||
      field.w < 0 ||
      field.h < 0 ||
      field.x > 100 ||
      field.y > 100 ||
      field.w > 100 ||
      field.h > 100
    ) {
      return `Field "${trimmedName}" có tọa độ/kích thước phải nằm trong 0..100`;
    }

    if (field.type !== "image") {
      if (
        !Number.isFinite(field.fontSize) ||
        Number(field.fontSize) < options.minFontSize ||
        Number(field.fontSize) > options.maxFontSize
      ) {
        return `Field "${trimmedName}" có fontSize ngoài khoảng [${options.minFontSize}..${options.maxFontSize}]`;
      }

      if (!field.align || !options.alignments.includes(field.align)) {
        return `Field "${trimmedName}" có align không hợp lệ`;
      }

      if (
        !field.fontFamily ||
        !options.fontFamilies.includes(field.fontFamily)
      ) {
        return `Field "${trimmedName}" có fontFamily không hợp lệ`;
      }

      if (!field.color || !HEX_COLOR_PATTERN.test(field.color)) {
        return `Field "${trimmedName}" có color không đúng #RRGGBB`;
      }
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
  const [schemaOptions, setSchemaOptions] = useState<SchemaOptionsResponse>(
    DEFAULT_SCHEMA_OPTIONS,
  );
  const [optionsLoading, setOptionsLoading] = useState(false);

  const hasContext = Boolean(templateId && orgId);

  useEffect(() => {
    let cancelled = false;

    const loadSchemaOptions = async () => {
      setOptionsLoading(true);
      try {
        const response = await templateApi.getSchemaOptions();
        if (!cancelled) {
          setSchemaOptions(response);
        }
      } catch {
        if (!cancelled) {
          setSchemaOptions(DEFAULT_SCHEMA_OPTIONS);
        }
      } finally {
        if (!cancelled) {
          setOptionsLoading(false);
        }
      }
    };

    loadSchemaOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadTemplateEditorData = useCallback(async () => {
    if (!templateId || !orgId) {
      return;
    }

    setMetadataLoading(true);
    setErrorMessage(null);

    try {
      const nextTemplate = await templateApi.getTemplateById(templateId, orgId);
      setTemplate(nextTemplate);
      setFields(
        (nextTemplate.fields ?? []).map((field) =>
          normalizeField(field, schemaOptions),
        ),
      );
      setSelectedFieldId((current) => {
        if (!current) return null;
        return (nextTemplate.fields ?? []).some((item) => item.id === current)
          ? current
          : null;
      });

      const directPdfUrl = resolveTemplatePdfUrl(nextTemplate);
      if (directPdfUrl) {
        setPdfBlobUrl((current) => {
          if (current && isBlobUrl(current)) {
            URL.revokeObjectURL(current);
          }
          return directPdfUrl;
        });
        setPdfLoading(false);
        return;
      }
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
        if (current && isBlobUrl(current)) {
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
  }, [orgId, schemaOptions, templateId]);

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
      if (pdfBlobUrl && isBlobUrl(pdfBlobUrl)) {
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
        fontSize: schemaOptions.defaultFontSize,
        fontFamily: schemaOptions.fontFamilies[0] ?? "helvetica",
        align: (schemaOptions.alignments[0] ?? "left") as TemplateFieldAlign,
        color: "#1A1A1A",
      };

      setFields((current) => [
        ...current,
        normalizeField(newField, schemaOptions),
      ]);
      setSelectedFieldId(newField.id);
    },
    [fields.length, schemaOptions],
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<TemplateField>) => {
      setFields((current) =>
        current.map((field) =>
          field.id === fieldId
            ? normalizeField({ ...field, ...updates }, schemaOptions)
            : field,
        ),
      );
    },
    [schemaOptions],
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

    const validationError = validateFields(fields, schemaOptions);
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
  }, [fields, orgId, schemaOptions, templateId]);

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
    schemaOptions,
    optionsLoading,
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
