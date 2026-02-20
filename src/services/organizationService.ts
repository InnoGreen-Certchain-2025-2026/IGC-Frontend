import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";
import type { CreateOrganizationRequest } from "@/types/organization/CreateOrganizationRequest";
import type { OrganizationSummaryResponse } from "@/types/organization/OrganizationSummaryResponse";
import type { OrganizationResponse } from "@/types/organization/OrganizationResponse";

/**
 * Tạo tổ chức mới (multipart: data JSON + logo file).
 */
export const createOrganizationApi = async (
  data: CreateOrganizationRequest,
  logo: File,
): Promise<ApiResponse<void>> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  formData.append("logo", logo);

  const response = await axiosInstance.post<ApiResponse<void>>(
    "/organizations",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

/**
 * Lấy danh sách tổ chức của user (có phân trang).
 */
export const getUserOrganizationsApi = async (
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<OrganizationSummaryResponse>>> => {
  const response = await axiosInstance.get<
    ApiResponse<PageResponse<OrganizationSummaryResponse>>
  >("/organizations", {
    params: { page, size },
  });
  return response.data;
};

/**
 * Lấy danh sách tổ chức tóm tắt (không phân trang).
 */
export const getUserBriefOrganizationsApi = async (): Promise<
  ApiResponse<OrganizationSummaryResponse[]>
> => {
  const response = await axiosInstance.get<
    ApiResponse<OrganizationSummaryResponse[]>
  >("/organizations/brief");
  return response.data;
};

/**
 * Lấy chi tiết tổ chức theo ID.
 */
export const getOrganizationByIdApi = async (
  id: number,
): Promise<ApiResponse<OrganizationResponse>> => {
  const response = await axiosInstance.get<ApiResponse<OrganizationResponse>>(
    `/organizations/${id}`,
  );
  return response.data;
};
