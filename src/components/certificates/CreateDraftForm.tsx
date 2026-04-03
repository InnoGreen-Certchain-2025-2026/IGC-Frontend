import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CertificateDraftPayload } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";

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
});

type DraftFormValues = z.infer<typeof draftSchema>;
type DraftFormInput = z.input<typeof draftSchema>;

interface CreateDraftFormProps {
  onSubmit: (payload: CertificateDraftPayload) => Promise<void>;
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
    },
  });

  const localeText = CERTIFICATE_TEXTS[DEFAULT_LOCALE];

  const submit = async (values: DraftFormValues) => {
    await onSubmit(values);
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
