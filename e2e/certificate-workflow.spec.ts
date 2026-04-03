import { expect, test, type Page } from "@playwright/test";

const authPersistState = {
  auth: JSON.stringify({
    id: 1,
    email: "qa@example.com",
    name: "QA User",
    avatarUrl: null,
    isAuthenticated: true,
    loading: false,
    error: null,
  }),
  organization: JSON.stringify({
    selectedOrganization: null,
  }),
  _persist: JSON.stringify({
    version: -1,
    rehydrated: true,
  }),
};

test.beforeEach(async ({ page }) => {
  await page.route("**/users/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        errorCode: 0,
        errorMessage: "",
        data: {
          id: 1,
          name: "QA User",
          email: "qa@example.com",
          avatarUrl: null,
        },
      }),
    });
  });
});

async function setAuthenticatedState(page: Page) {
  await page.addInitScript((persistState) => {
    localStorage.setItem("access_token", "token");
    localStorage.setItem("persist:root", JSON.stringify(persistState));
  }, authPersistState);
}

test("flow: create draft -> sign success", async ({ page }) => {
  await setAuthenticatedState(page);

  const drafts = [
    {
      certificateId: "CERT-001",
      studentName: "Draft Student",
      status: "DRAFT",
    },
  ];

  const signed = [
    {
      certificateId: "SIGNED-001",
      studentName: "Signed Student",
      status: "SIGNED",
      claimCode: "CLAIM-001",
      claimExpiry: "2026-12-31",
    },
  ];

  await page.route("**/api/certificates/draft", async (route) => {
    if (route.request().method() === "POST") {
      drafts.push({
        certificateId: "CERT-NEW",
        studentName: "New Student",
        status: "DRAFT",
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          errorCode: 0,
          errorMessage: "",
          data: drafts[drafts.length - 1],
        }),
      });
      return;
    }

    await route.fallback();
  });

  await page.route("**/api/certificates/drafts", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ errorCode: 0, errorMessage: "", data: drafts }),
    });
  });

  await page.route("**/api/certificates/signed", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ errorCode: 0, errorMessage: "", data: signed }),
    });
  });

  await page.route("**/api/certificates/*/sign", async (route) => {
    signed.push({
      certificateId: "CERT-NEW",
      studentName: "New Student",
      status: "SIGNED",
      claimCode: "CLAIM-NEW",
      claimExpiry: "2026-12-31",
    });

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        errorCode: 0,
        errorMessage: "",
        data: signed[signed.length - 1],
      }),
    });
  });

  await page.goto("/org/demo/certificates/create-draft");

  await page.getByLabel("Mã chứng chỉ").fill("CERT-NEW");
  await page.getByLabel("Tên sinh viên").fill("New Student");
  await page.getByLabel("Ngày sinh").fill("2001-01-01");
  await page.getByLabel("Ngành học").fill("Software Engineering");
  await page.getByLabel("Năm tốt nghiệp").fill("2025");
  await page.getByLabel("GPA").fill("3.7");
  await page.getByLabel("Loại chứng chỉ").fill("Bachelor");
  await page.getByLabel("Ngày cấp").fill("2026-03-01");

  await page.getByRole("button", { name: "Xác nhận" }).click();
  await expect(page.getByText("CERT-NEW")).toBeVisible();

  await page.getByRole("button", { name: "Ký số" }).first().click();

  await page.getByLabel("Ảnh chữ ký (png/jpg)").setInputFiles({
    name: "sig.png",
    mimeType: "image/png",
    buffer: Buffer.from("fake"),
  });
  await page.getByLabel("Chứng thư người dùng (.p12/.pfx)").setInputFiles({
    name: "cert.p12",
    mimeType: "application/x-pkcs12",
    buffer: Buffer.from("fake"),
  });
  await page.getByLabel("Mật khẩu chứng thư").fill("safe-pass");
  await page.getByRole("button", { name: "Ký số" }).last().click();

  await expect(page.getByText("Đã ký", { exact: true }).first()).toBeVisible();
});

test("flow: claim info -> download", async ({ page }) => {
  await page.route("**/api/certificates/claim/CLM-100", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        errorCode: 0,
        errorMessage: "",
        data: {
          certificateId: "CERT-100",
          studentName: "Claim Student",
          certificateType: "Bachelor",
          issueDate: "2026-01-01",
          status: "SIGNED",
          issuer: "IGC",
        },
      }),
    });
  });

  await page.route(
    "**/api/certificates/claim/CLM-100/download",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/pdf",
        body: "%PDF-1.4 test",
      });
    },
  );

  await page.goto("/claim");
  await page.getByLabel("Mã nhận").fill("CLM-100");
  await page.getByRole("button", { name: "Tra cứu mã nhận" }).click();

  await expect(page.getByText("Thông tin chứng chỉ")).toBeVisible();
  await page.getByRole("button", { name: "Tải PDF" }).click();
});

test("flow: revoke -> reissue", async ({ page }) => {
  await setAuthenticatedState(page);

  const drafts = [
    {
      certificateId: "CERT-DRAFT-1",
      studentName: "Draft One",
      status: "DRAFT",
    },
  ];

  const signed = [
    {
      certificateId: "CERT-SIGNED-1",
      studentName: "Signed One",
      status: "SIGNED",
    },
    {
      certificateId: "CERT-REVOKED-1",
      studentName: "Revoked One",
      status: "REVOKED",
    },
  ];

  await page.route("**/api/certificates/drafts", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ errorCode: 0, errorMessage: "", data: drafts }),
    });
  });

  await page.route("**/api/certificates/signed", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ errorCode: 0, errorMessage: "", data: signed }),
    });
  });

  await page.route(
    "**/api/certificates/CERT-SIGNED-1/revoke",
    async (route) => {
      const target = signed.find(
        (item) => item.certificateId === "CERT-SIGNED-1",
      );
      if (target) {
        target.status = "REVOKED";
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          errorCode: 0,
          errorMessage: "",
          data: {
            certificateId: "CERT-SIGNED-1",
            studentName: "Signed One",
            status: "REVOKED",
          },
        }),
      });
    },
  );

  await page.route("**/api/certificates/*/reissue", async (route) => {
    const url = route.request().url();
    const parts = url.split("/");
    const certificateId = parts[parts.length - 2] ?? "CERT-REISSUED-1";

    drafts.push({
      certificateId: `${certificateId}-REISSUED`,
      studentName: "Revoked One",
      status: "DRAFT",
    });

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        errorCode: 0,
        errorMessage: "",
        data: drafts[drafts.length - 1],
      }),
    });
  });

  await page.goto("/org/demo/certificates");

  await page.getByRole("tab", { name: "Đã ký" }).click();
  await page.getByRole("button", { name: "Thu hồi" }).first().click();
  await page.getByRole("button", { name: "Thu hồi" }).last().click();

  await page.getByRole("tab", { name: "Đã thu hồi" }).click();
  await page.getByRole("button", { name: "Cấp lại" }).first().click();
  await page.getByRole("button", { name: "Cấp lại" }).last().click();

  await page.getByRole("tab", { name: "Bản nháp" }).click();
  await expect(page.getByRole("cell", { name: /REISSUED/ })).toBeVisible();
});
