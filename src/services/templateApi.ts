import type { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { getFilenameFromContentDisposition } from "@/lib/download";
import type {
  BatchProgressResponse,
  BatchStartResponse,
  BulkCertificateUploadPayload,
  SaveSchemaRequest,
  TemplateFieldRequest,
  TemplateResponse,
  TemplateUploadPayload,
} from "@/types/template";
import type { ApiResponse } from "@/types/base/ApiResponse";

function buildTemplateUploadFormData(payload: TemplateUploadPayload) {
  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob(
      [
        JSON.stringify({
          orgId: payload.orgId,
          name: payload.name,
          fields: payload.fields,
        }),
      ],
      { type: "application/json" },
    ),
  );
  formData.append("pdfFile", payload.pdfFile);
  return formData;
}

function buildBulkCertificateFormData(payload: BulkCertificateUploadPayload) {
  const formData = new FormData();
  formData.append("orgId", String(payload.orgId));
  formData.append("excelFile", payload.excelFile);
  formData.append("userCertificate", payload.userCertificate);
  formData.append("certificatePassword", payload.certificatePassword);
  return formData;
}

function getBlobFilename(
  response: AxiosResponse<Blob>,
  fallbackFilename: string,
) {
  return getFilenameFromContentDisposition(
    response.headers["content-disposition"] as string | undefined,
    fallbackFilename,
  );
}

export const templateApi = {
  async getTemplates(orgId: number, keyword = "") {
    const response = await axiosInstance.get<ApiResponse<TemplateResponse[]>>(
      "/api/templates",
      { params: { orgId, q: keyword } },
    );
    return response.data;
  },

  async getTemplateById(id: string, orgId: number): Promise<TemplateResponse> {
    const response = await axiosInstance.get<ApiResponse<TemplateResponse>>(
      `/api/templates/${id}`,
      { params: { orgId } },
    );
    return response.data.data;
  },

  async getTemplate(id: string, orgId: number): Promise<TemplateResponse> {
    return templateApi.getTemplateById(id, orgId);
  },

  async uploadTemplate(payload: TemplateUploadPayload) {
    const response = await axiosInstance.post<ApiResponse<TemplateResponse>>(
      "/api/templates/upload",
      buildTemplateUploadFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  async updateTemplateName(id: string, orgId: number, name: string) {
    const response = await axiosInstance.put<ApiResponse<TemplateResponse>>(
      `/api/templates/${id}`,
      null,
      { params: { orgId, name } },
    );
    return response.data;
  },

  async saveTemplateSchema(
    id: string,
    payload: SaveSchemaRequest,
    method: "put" | "post" = "put",
  ): Promise<TemplateResponse> {
    const response = await axiosInstance.request<ApiResponse<TemplateResponse>>(
      {
        method,
        url: `/api/templates/${id}/schema`,
        data: payload,
      },
    );
    return response.data.data;
  },

  async saveTemplateSchemaByFields(
    id: string,
    orgId: number,
    fields: TemplateFieldRequest[],
    method: "put" | "post" = "put",
  ): Promise<TemplateResponse> {
    return templateApi.saveTemplateSchema(id, { id: orgId, fields }, method);
  },

  async getTemplatePdfBlob(id: string, orgId: number) {
    const response = await axiosInstance.get(`/api/templates/${id}/pdf`, {
      params: { orgId },
      responseType: "blob",
      withCredentials: true,
      headers: {
        Accept: "application/pdf",
      },
    });
    return response.data as Blob;
  },

  async getTemplatePdfDownload(id: string, orgId: number) {
    const response = await axiosInstance.get<Blob>(`/api/templates/${id}/pdf`, {
      params: { orgId },
      responseType: "blob",
    });
    return {
      blob: response.data,
      filename: getBlobFilename(
        response as AxiosResponse<Blob>,
        `template-${id}.pdf`,
      ),
    };
  },

  async deleteTemplate(id: string, orgId: number) {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `/api/templates/${id}`,
      { params: { orgId } },
    );
    return response.data;
  },

  async getExcelTemplateDownload(id: string, orgId: number) {
    const response = await axiosInstance.get<Blob>(
      `/api/templates/${id}/excel-template`,
      { params: { orgId }, responseType: "blob" },
    );
    return {
      blob: response.data,
      filename: getBlobFilename(
        response as AxiosResponse<Blob>,
        `template-${id}-sample.xlsx`,
      ),
    };
  },

  async bulkCreateCertificates(
    templateId: string,
    payload: BulkCertificateUploadPayload,
  ) {
    const response = await axiosInstance.post<ApiResponse<BatchStartResponse>>(
      `/api/templates/${templateId}/bulk-certificates`,
      buildBulkCertificateFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  async getBatchProgress(batchId: string) {
    const response = await axiosInstance.get<
      ApiResponse<BatchProgressResponse>
    >(`/api/templates/batches/${batchId}/progress`);
    return response.data;
  },
};
