import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiBusinessError,
  type ApiResponse,
  type CertificateRecord,
} from "@/types/certificate";
import axiosInstance from "@/lib/axiosInstance";
import {
  createDraftCertificateApi,
  parseApiResponse,
  signCertificateApi,
} from "@/services/certificateApi";

vi.mock("@/lib/axiosInstance", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("certificateApi parser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws typed business error when API returns business error", () => {
    const payload: ApiResponse<CertificateRecord | null> = {
      errorCode: 4001,
      errorMessage: "Draft exists",
      data: null,
    };

    expect(() =>
      parseApiResponse(payload, {
        certificateId: "CERT-01",
        studentName: "A",
        status: "DRAFT",
      }),
    ).toThrow(ApiBusinessError);
  });

  it("returns fallback when data is null and no business error", () => {
    const payload: ApiResponse<CertificateRecord | null> = {
      errorCode: 0,
      errorMessage: "",
      data: null,
    };

    const fallback = {
      certificateId: "CERT-NULL",
      studentName: "Student",
      status: "DRAFT" as const,
    };

    expect(parseApiResponse(payload, fallback)).toEqual(fallback);
  });

  it("creates draft and returns parsed data", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({
      data: {
        errorCode: 0,
        errorMessage: "",
        data: {
          certificateId: "CERT-100",
          studentName: "John Doe",
          status: "DRAFT",
        },
      },
    });

    const result = await createDraftCertificateApi({
      request: {
        certificateId: "CERT-100",
        studentName: "John Doe",
        dateOfBirth: "2000-01-01",
        major: "Computer Science",
        graduationYear: 2024,
        gpa: 3.6,
        certificateType: "Bachelor",
        issueDate: "2026-03-20",
      },
      userCertificate: new File(["cert"], "user.p12", {
        type: "application/x-pkcs12",
      }),
      certificatePassword: "secret",
      organizationId: 1,
    });

    expect(result.certificateId).toBe("CERT-100");
    expect(result.status).toBe("DRAFT");
  });

  it("sends form-data for sign request", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({
      data: {
        errorCode: 0,
        errorMessage: "",
        data: {
          certificateId: "CERT-200",
          studentName: "Jane Doe",
          status: "SIGNED",
          claimCode: "CLM-123",
        },
      },
    });

    const signResult = await signCertificateApi({
      certificateId: "CERT-200",
      signatureImage: new File(["img"], "sig.png", { type: "image/png" }),
      userCertificate: new File(["cert"], "user.p12", {
        type: "application/x-pkcs12",
      }),
      certificatePassword: "secret",
      x: 1,
      y: 2,
      width: 100,
      height: 50,
    });

    expect(signResult.status).toBe("SIGNED");
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
  });
});
