export const CERTIFICATE_TEXTS = {
  vi: {
    dashboardTitle: "Quản lý chứng chỉ",
    dashboardDescription:
      "Quản lý đầy đủ vòng đời chứng chỉ: Bản nháp, Ký số, Tra cứu, Thu hồi và Cấp lại.",
    tabs: {
      draft: "Bản nháp",
      signed: "Đã ký",
      revoked: "Đã thu hồi",
    },
    actions: {
      createDraft: "Tạo bản nháp",
      sign: "Ký số",
      revoke: "Thu hồi",
      reissue: "Cấp lại",
      claimLookup: "Tra cứu mã nhận",
      claimOwnership: "Nhận chứng chỉ",
      claimed: "Đã nhận",
      verifyByFile: "Xác thực bằng tệp PDF",
      downloadPdf: "Tải PDF",
      submit: "Xác nhận",
      cancel: "Hủy",
      chooseFile: "Chọn tệp PDF",
      verify: "Xác thực",
    },
    searchPlaceholder: "Tìm theo mã chứng chỉ hoặc tên sinh viên",
    empty: {
      draft: "Chưa có chứng chỉ bản nháp.",
      signed: "Chưa có chứng chỉ đã ký.",
      revoked: "Chưa có chứng chỉ đã thu hồi.",
    },
    status: {
      DRAFT: "Bản nháp",
      SIGNED: "Đã ký",
      REVOKED: "Đã thu hồi",
      EXPIRED: "Hết hạn",
    },
    notifications: {
      createDraftSuccess: "Tạo chứng chỉ bản nháp thành công.",
      signSuccess: "Ký số chứng chỉ thành công.",
      revokeSuccess: "Thu hồi chứng chỉ thành công.",
      reissueSuccess: "Cấp lại chứng chỉ thành công và tạo bản nháp mới.",
      claimSuccess: "Bạn đã nhận chứng chỉ vào tài khoản.",
      claimNeedLogin: "Vui lòng đăng nhập để nhận chứng chỉ.",
      claimClaimedByOther: "Chứng chỉ này đã được nhận bởi tài khoản khác.",
      claimInvalid: "Mã nhận không hợp lệ, đã hết hạn hoặc đã bị thu hồi.",
      verifyFileSuccess: "Xác thực tệp PDF thành công.",
      unexpectedError: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    },
    validation: {
      signatureImageInvalid:
        "Ảnh chữ ký phải là PNG/JPG/JPEG và không vượt quá 5MB.",
      userCertificateInvalid:
        "Chứng thư người dùng phải là .p12 hoặc .pfx và không vượt quá 5MB.",
      pdfFileInvalid: "Vui lòng chọn đúng 1 tệp PDF để xác thực.",
    },
  },
} as const;

export const DEFAULT_LOCALE = "vi";
