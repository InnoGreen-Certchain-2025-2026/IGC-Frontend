import type { TemplateField, TemplateResponse } from "@/types/template";
import { templateApi } from "@/services/templateApi";

export interface SaveTemplateSchemaRequest {
  id: number;
  fields: TemplateField[];
}

export interface SaveTemplateSchemaResponse extends TemplateResponse {}

export const templateSchemaService = {
  async saveSchema(
    templateId: string,
    orgId: number,
    fields: TemplateField[],
  ): Promise<SaveTemplateSchemaResponse> {
    const response = await templateApi.saveTemplateSchemaByFields(
      templateId,
      orgId,
      fields,
      "put",
    );
    return response;
  },

  async createSchema(
    templateId: string,
    orgId: number,
    fields: TemplateField[],
  ): Promise<SaveTemplateSchemaResponse> {
    const response = await templateApi.saveTemplateSchemaByFields(
      templateId,
      orgId,
      fields,
      "post",
    );
    return response;
  },

  async getTemplate(
    templateId: string,
    orgId: number,
  ): Promise<SaveTemplateSchemaResponse> {
    const response = await templateApi.getTemplate(templateId, orgId);
    return response;
  },

  async getAllTemplates(orgId: number): Promise<SaveTemplateSchemaResponse[]> {
    const response = await templateApi.getTemplates(orgId);
    return response.data;
  },

  async uploadTemplate(
    orgId: number,
    name: string,
    fields: TemplateField[],
    pdfFile: File,
  ): Promise<SaveTemplateSchemaResponse> {
    const response = await templateApi.uploadTemplate({
      orgId,
      name,
      fields,
      pdfFile,
    });
    return response.data;
  },
};
