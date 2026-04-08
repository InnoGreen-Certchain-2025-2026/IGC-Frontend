import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CertificateDraftPayload } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";

const certificateFileSchema = z
  .instanceof(File, { message: "Vui lòng upload chứng thư số (.p12/.pfx)" })
  .refine((file) => /\.(p12|pfx)$/i.test(file.name), {
    message: "Chỉ chấp nhận file .p12 hoặc .pfx",
  });

const draftSchema = z.object({
  certificateId: z.string().min(3, "Mã chứng chỉ phải có ít nhất 3 ký tự"),
  studentName: z.string().min(2, "Vui lòng nhập tên sinh viên"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải theo định dạng YYYY-MM-DD"),
  major: z.string().min(2, "Vui lòng nhập ngành học"),
  graduationYear: z.coerce.number().int().min(1900).max(2099),
  gpa: z.coerce.number().min(0).max(4),
  certificateType: z.string().min(2, "Vui lòng nhập loại chứng chỉ"),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày cấp phải theo định dạng YYYY-MM-DD"),
  userCertificate: certificateFileSchema,
  certificatePassword: z.string().min(1, "Vui lòng nhập mật khẩu chứng thư số"),
});

type DraftFormValues = z.infer<typeof draftSchema>;
type DraftFormInput = z.input<typeof draftSchema>;

interface CreateDraftFormProps {
  onSubmit: (payload: {
    request: CertificateDraftPayload;
    userCertificate: File;
    certificatePassword: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CreateDraftForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: CreateDraftFormProps) {
  const form = useForm<DraftFormInput, undefined, DraftFormValues>({
    resolver: zodResolver(draftSchema),
    mode: "onChange",
    defaultValues: {
      certificateId: "",
      studentName: "",
      dateOfBirth: "",
      major: "",
      graduationYear: new Date().getFullYear(),
      gpa: 0,
      certificateType: "",
      issueDate: new Date().toISOString().split("T")[0],
      userCertificate: undefined,
      certificatePassword: "",
    },
  });

  const localeText = CERTIFICATE_TEXTS[DEFAULT_LOCALE];

  const submit = async (values: DraftFormValues) => {
    await onSubmit({
      request: {
        certificateId: values.certificateId,
        studentName: values.studentName,
        dateOfBirth: values.dateOfBirth,
        major: values.major,
        graduationYear: values.graduationYear,
        gpa: values.gpa,
        certificateType: values.certificateType,
        issueDate: values.issueDate,
      },
      userCertificate: values.userCertificate,
      certificatePassword: values.certificatePassword,
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="certificateId">Mã chứng chỉ</Label>
          <Input id="certificateId" {...form.register("certificateId")} />
          <p className="text-destructive text-xs">
            {form.formState.errors.certificateId?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentName">Tên sinh viên</Label>
          <Input id="studentName" {...form.register("studentName")} />
          <p className="text-destructive text-xs">
            {form.formState.errors.studentName?.message}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="userCertificate">Chứng thư số (.p12/.pfx)</Label>
          <Input
            id="userCertificate"
            type="file"
            accept=".p12,.pfx,application/x-pkcs12"
            onChange={(event) => {
              const file = event.target.files?.[0];
              form.setValue("userCertificate", file as File, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
          <p className="text-destructive text-xs">
            {form.formState.errors.userCertificate?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificatePassword">Mật khẩu chứng thư số</Label>
          <Input
            id="certificatePassword"
            type="password"
            autoComplete="new-password"
            {...form.register("certificatePassword")}
          />
          <p className="text-destructive text-xs">
            {form.formState.errors.certificatePassword?.message}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...form.register("dateOfBirth")}
          />
          <p className="text-destructive text-xs">
            {form.formState.errors.dateOfBirth?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="major">Ngành học</Label>
          <Input id="major" {...form.register("major")} />
          <p className="text-destructive text-xs">
            {form.formState.errors.major?.message}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="graduationYear">Năm tốt nghiệp</Label>
          <Input
            id="graduationYear"
            type="number"
            {...form.register("graduationYear")}
          />
          <p className="text-destructive text-xs">
            {form.formState.errors.graduationYear?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gpa">GPA</Label>
          <Input id="gpa" type="number" step="0.01" {...form.register("gpa")} />
          <p className="text-destructive text-xs">
            {form.formState.errors.gpa?.message}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="certificateType">Loại chứng chỉ</Label>
          <Input id="certificateType" {...form.register("certificateType")} />
          <p className="text-destructive text-xs">
            {form.formState.errors.certificateType?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDate">Ngày cấp</Label>
          <Input id="issueDate" type="date" {...form.register("issueDate")} />
          <p className="text-destructive text-xs">
            {form.formState.errors.issueDate?.message}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
        <Button type="button" variant="outline" onClick={onCancel}>
          {localeText.actions.cancel}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? "Đang gửi..." : localeText.actions.submit}
        </Button>
      </div>
    </form>
  );
}
