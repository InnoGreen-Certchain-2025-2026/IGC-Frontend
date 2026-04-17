import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const ALIGNMENTS: TemplateFieldAlign[] = ["left", "center", "right"];
const DEFAULT_OPTIONS: SchemaOptionsResponse = {
  fontFamilies: ["helvetica"],
  alignments: ALIGNMENTS,
  minFontSize: 6,
  maxFontSize: 72,
  defaultFontSize: 11,
};

function isBlobUrl(url?: string | null) {
  return Boolean(url && url.startsWith("blob:"));
}

export interface FieldValidationError {
  name?: string;
  bounds?: string;
  style?: string;
  imageRule?: string;
}

export type FieldValidationErrors = Record<string, FieldValidationError>;

function getErrorMessage(error: unknown, fallback = "Đã xảy ra lỗi") {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Number(value.toFixed(2))));
}

function normalizeField(
  field: TemplateField,
  options: SchemaOptionsResponse,
): TemplateField {
  const align = ALIGNMENTS.includes(
    (field.align ?? "left") as TemplateFieldAlign,
  )
    ? (field.align as TemplateFieldAlign)
    : "left";

  const fontFamily = options.fontFamilies.includes(field.fontFamily ?? "")
    ? field.fontFamily
    : (options.fontFamilies[0] ?? "helvetica");

  return {
    ...field,
    x: clampPercent(field.x),
    y: clampPercent(field.y),
    w: clampPercent(field.w),
    h: clampPercent(field.h),
    fontSize:
      field.type === "image"
        ? undefined
        : Math.max(
            options.minFontSize,
            Math.min(
              options.maxFontSize,
              Number(field.fontSize ?? options.defaultFontSize),
            ),
          ),
    fontFamily: field.type === "image" ? undefined : fontFamily,
    align: field.type === "image" ? undefined : align,
    color: field.type === "image" ? undefined : (field.color ?? "#1A1A1A"),
  };
}

function mergeFieldDrafts(
  fields: TemplateField[],
  drafts: Record<string, Partial<TemplateField>>,
) {
  return fields.map((field) => ({ ...field, ...(drafts[field.id] ?? {}) }));
}

function validateField(
  field: TemplateField,
  allFields: TemplateField[],
  options: SchemaOptionsResponse,
): FieldValidationError {
  const error: FieldValidationError = {};
  const name = field.name.trim();

  if (!name) {
    error.name = "Tên field không được để trống.";
  }

  const duplicate = allFields.some(
    (item) =>
      item.id !== field.id &&
      item.name.trim().toLowerCase() === name.toLowerCase() &&
      name.length > 0,
  );
  if (duplicate) {
    error.name = `Tên field \"${name}\" đang bị trùng.`;
  }

  const bounds = [field.x, field.y, field.w, field.h];
  const invalidBound = bounds.some(
    (value) => !Number.isFinite(value) || value < 0 || value > 100,
  );
  if (invalidBound) {
    error.bounds = "x, y, w, h phải nằm trong khoảng 0..100.";
  }

  if (field.type === "image") {
    if (name !== "signature") {
      error.imageRule = 'Field image bắt buộc name là "signature".';
    }

    const imageCount = allFields.filter((item) => item.type === "image").length;
    if (imageCount > 1) {
      error.imageRule = 'Chỉ được tồn tại 1 field image với name "signature".';
    }

    return error;
  }

  const fontSize = Number(field.fontSize);
  if (
    !Number.isFinite(fontSize) ||
    fontSize < options.minFontSize ||
    fontSize > options.maxFontSize
  ) {
    error.style = `fontSize phải nằm trong [${options.minFontSize}..${options.maxFontSize}].`;
  }

  const align = field.align ?? "left";
  const isAlignmentAllowed =
    ALIGNMENTS.includes(align as TemplateFieldAlign) &&
    (options.alignments.length === 0 ||
      options.alignments.includes(align as TemplateFieldAlign));
  if (!isAlignmentAllowed) {
    error.style = "align chỉ được là left | center | right.";
  }

  if (!field.color || !HEX_COLOR_PATTERN.test(field.color)) {
    error.style = "color phải đúng định dạng #RRGGBB.";
  }

  if (!field.fontFamily || !options.fontFamilies.includes(field.fontFamily)) {
    error.style = "fontFamily không hợp lệ theo options từ backend.";
  }

  return error;
}

interface UseTemplateDesignerStateParams {
  orgId?: number;
  templateId?: string;
}

export function useTemplateDesignerState({
  orgId,
  templateId,
}: UseTemplateDesignerStateParams) {
  const [schemaOptions, setSchemaOptions] =
    useState<SchemaOptionsResponse | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [templateName, setTemplateName] = useState("Certificate Template 2026");
  const [templateEntity, setTemplateEntity] = useState<TemplateResponse | null>(
    null,
  );
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [draftStyleByFieldId, setDraftStyleByFieldId] = useState<
    Record<string, Partial<TemplateField>>
  >({});
  const draftStyleByFieldIdRef = useRef<Record<string, Partial<TemplateField>>>(
    {},
  );
  const debounceTimersRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const effectiveOptions = schemaOptions ?? DEFAULT_OPTIONS;

  useEffect(() => {
    draftStyleByFieldIdRef.current = draftStyleByFieldId;
  }, [draftStyleByFieldId]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach((timer) =>
        clearTimeout(timer),
      );
      if (pdfUrl && isBlobUrl(pdfUrl)) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const loadSchemaOptions = useCallback(async () => {
    setLoadingOptions(true);

    try {
      const response = await templateApi.getSchemaOptions();
      setSchemaOptions(response);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tải schema options"));
      setSchemaOptions(DEFAULT_OPTIONS);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  const attachPdfFile = useCallback((file: File | null) => {
    setPdfFile(file);
    setFormError(null);

    setPdfUrl((current) => {
      if (current && isBlobUrl(current)) {
        URL.revokeObjectURL(current);
      }
      if (!file) return null;
      return URL.createObjectURL(file);
    });
  }, []);

  useEffect(() => {
    loadSchemaOptions();
  }, [loadSchemaOptions]);

  useEffect(() => {
    if (!templateId || !orgId) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    const loadExistingTemplate = async () => {
      setLoadingPdf(true);
      setFormError(null);

      try {
        const template = await templateApi.getTemplateById(templateId, orgId);
        if (cancelled) return;

        setTemplateEntity(template);
        setTemplateName(template.name);
        setFields(
          (template.fields ?? []).map((field) =>
            normalizeField(field, effectiveOptions),
          ),
        );

        const s3Candidate = template.pdfUrl || template.pdfStorageKey;
        if (s3Candidate) {
          const s3Url = getS3Url(s3Candidate);
          if (s3Url) {
            setPdfUrl((current) => {
              if (current && isBlobUrl(current)) URL.revokeObjectURL(current);
              return s3Url;
            });
            return;
          }
        }

        const blob = await templateApi.getTemplatePdfBlob(templateId, orgId);
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setPdfUrl((current) => {
          if (current && isBlobUrl(current)) URL.revokeObjectURL(current);
          return objectUrl;
        });
        objectUrl = null;
      } catch (error) {
        if (!cancelled) {
          setFormError(getErrorMessage(error, "Không thể tải template"));
        }
      } finally {
        if (!cancelled) {
          setLoadingPdf(false);
        }
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      }
    };

    loadExistingTemplate();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [effectiveOptions, orgId, templateId]);

  const effectiveFields = useMemo(
    () => mergeFieldDrafts(fields, draftStyleByFieldId),
    [draftStyleByFieldId, fields],
  );

  const fieldErrors = useMemo(() => {
    return effectiveFields.reduce<FieldValidationErrors>((acc, field) => {
      const error = validateField(field, effectiveFields, effectiveOptions);
      if (error.name || error.bounds || error.style || error.imageRule) {
        acc[field.id] = error;
      }
      return acc;
    }, {});
  }, [effectiveFields, effectiveOptions]);

  const selectedField = useMemo(
    () => effectiveFields.find((field) => field.id === selectedFieldId) ?? null,
    [effectiveFields, selectedFieldId],
  );

  const hasValidationError = useMemo(
    () => Object.keys(fieldErrors).length > 0,
    [fieldErrors],
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<TemplateField>) => {
      setFields((current) =>
        current.map((field) => {
          if (field.id !== fieldId) return field;
          return normalizeField({ ...field, ...updates }, effectiveOptions);
        }),
      );
    },
    [effectiveOptions],
  );

  const updateFieldStyleDebounced = useCallback(
    (fieldId: string, updates: Partial<TemplateField>) => {
      setDraftStyleByFieldId((current) => ({
        ...current,
        [fieldId]: {
          ...(current[fieldId] ?? {}),
          ...updates,
        },
      }));

      const existingTimer = debounceTimersRef.current[fieldId];
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      debounceTimersRef.current[fieldId] = setTimeout(() => {
        setFields((current) =>
          current.map((field) => {
            if (field.id !== fieldId) return field;
            const draft = draftStyleByFieldIdRef.current[fieldId] ?? {};
            return normalizeField({ ...field, ...draft }, effectiveOptions);
          }),
        );

        setDraftStyleByFieldId((current) => {
          const next = { ...current };
          delete next[fieldId];
          return next;
        });
      }, 120);
    },
    [draftStyleByFieldId, effectiveOptions],
  );

  const addField = useCallback(
    (type: TemplateFieldType) => {
      const id = crypto.randomUUID();
      const isImage = type === "image";
      const fallbackName = isImage
        ? "signature"
        : `${type}_${fields.length + 1}`;

      if (isImage && effectiveFields.some((item) => item.type === "image")) {
        toast.error('Chỉ được có 1 field image tên "signature".');
        return;
      }

      const field: TemplateField = normalizeField(
        {
          id,
          name: fallbackName,
          type,
          x: 10,
          y: 10,
          w: isImage ? 20 : 35,
          h: isImage ? 10 : 7,
          fontSize: effectiveOptions.defaultFontSize,
          fontFamily: effectiveOptions.fontFamilies[0] ?? "helvetica",
          align: "left",
          color: "#1A1A1A",
        },
        effectiveOptions,
      );

      setFields((current) => [...current, field]);
      setSelectedFieldId(id);
    },
    [effectiveFields, effectiveOptions, fields.length],
  );

  const removeField = useCallback((fieldId: string) => {
    setFields((current) => current.filter((field) => field.id !== fieldId));
    setSelectedFieldId((current) => (current === fieldId ? null : current));
    setDraftStyleByFieldId((current) => {
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
    const timer = debounceTimersRef.current[fieldId];
    if (timer) {
      clearTimeout(timer);
      delete debounceTimersRef.current[fieldId];
    }
  }, []);

  const flushDraftStyles = useCallback(() => {
    const mergedFields = mergeFieldDrafts(fields, draftStyleByFieldId).map(
      (field) => normalizeField(field, effectiveOptions),
    );

    setFields(mergedFields);
    setDraftStyleByFieldId({});

    Object.values(debounceTimersRef.current).forEach((timer) =>
      clearTimeout(timer),
    );
    debounceTimersRef.current = {};

    return mergedFields;
  }, [draftStyleByFieldId, effectiveOptions, fields]);

  const uploadTemplate = useCallback(async () => {
    if (!orgId) {
      toast.error("Thiếu orgId để upload template");
      return;
    }

    if (!pdfFile) {
      toast.error("Vui lòng chọn file PDF template.");
      return;
    }

    const mergedFields = flushDraftStyles();

    const nextErrors = mergedFields.reduce<FieldValidationErrors>(
      (acc, field) => {
        const error = validateField(field, mergedFields, effectiveOptions);
        if (error.name || error.bounds || error.style || error.imageRule) {
          acc[field.id] = error;
        }
        return acc;
      },
      {},
    );

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Schema chưa hợp lệ. Vui lòng kiểm tra panel lỗi.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await templateApi.uploadTemplate({
        orgId,
        name: templateName.trim() || "Certificate Template",
        fields: mergedFields,
        pdfFile,
      });

      setTemplateEntity(response.data);
      setTemplateName(response.data.name);
      toast.success("Upload template thành công");
    } catch (error) {
      const message = getErrorMessage(error, "Upload template thất bại");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [effectiveOptions, flushDraftStyles, orgId, pdfFile, templateName]);

  const updateSchema = useCallback(async () => {
    const currentTemplateId = templateEntity?.id ?? templateId;

    if (!currentTemplateId) {
      toast.error("Chưa có template để cập nhật schema. Hãy upload trước.");
      return;
    }

    if (!orgId) {
      toast.error("Thiếu orgId để cập nhật schema");
      return;
    }

    const mergedFields = flushDraftStyles();

    const nextErrors = mergedFields.reduce<FieldValidationErrors>(
      (acc, field) => {
        const error = validateField(field, mergedFields, effectiveOptions);
        if (error.name || error.bounds || error.style || error.imageRule) {
          acc[field.id] = error;
        }
        return acc;
      },
      {},
    );

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Schema chưa hợp lệ. Vui lòng sửa lỗi trước khi lưu.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const payload: SaveSchemaRequest = {
      id: orgId,
      fields: mergedFields,
    };

    try {
      const response = await templateApi.saveTemplateSchema(
        currentTemplateId,
        payload,
        "put",
      );
      setTemplateEntity(response);
      setFields(
        (response.fields ?? []).map((field) =>
          normalizeField(field, effectiveOptions),
        ),
      );
      toast.success("Cập nhật schema thành công");
    } catch (error) {
      const message = getErrorMessage(error, "Cập nhật schema thất bại");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    effectiveOptions,
    flushDraftStyles,
    orgId,
    templateEntity?.id,
    templateId,
  ]);

  return {
    schemaOptions,
    loadingOptions,
    templateEntity,
    templateName,
    pdfFile,
    pdfUrl,
    loadingPdf,
    selectedFieldId,
    selectedField,
    effectiveFields,
    fieldErrors,
    hasValidationError,
    isSubmitting,
    formError,
    setTemplateName,
    setSelectedFieldId,
    attachPdfFile,
    addField,
    removeField,
    updateField,
    updateFieldStyleDebounced,
    uploadTemplate,
    updateSchema,
  };
}
