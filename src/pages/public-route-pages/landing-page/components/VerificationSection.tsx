import { useRef, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVerifyCertificateByPdfFile } from "@/hooks/useCertificates";
import {
  ApiBusinessError,
  type VerifyCertificateFileResponse,
} from "@/types/certificate";
import VerificationResultModal from "./VerificationResultModal";

export default function VerificationSection() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerifyCertificateFileResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const verifyByFileMutation = useVerifyCertificateByPdfFile();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;

    if (!nextFile) {
      setFile(null);
      return;
    }

    const isPdf =
      nextFile.type === "application/pdf" ||
      nextFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      setResult(null);
      toast.error(t("landingPage.verification.toasts.pdfFileInvalid"));
      return;
    }

    setFile(nextFile);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragAreaRef.current?.classList.add("border-[#214e41]", "bg-slate-50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragAreaRef.current?.classList.remove("border-[#214e41]", "bg-slate-50");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragAreaRef.current?.classList.remove("border-[#214e41]", "bg-slate-50");

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      const isPdf =
        droppedFile.type === "application/pdf" ||
        droppedFile.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        toast.error(t("landingPage.verification.toasts.pdfFileInvalid"));
        return;
      }

      setFile(droppedFile);
    }
  };

  const handleFileVerify = async () => {
    if (!file) return;

    try {
      const payload = await verifyByFileMutation.mutateAsync(file);
      setResult(payload);
      setIsModalOpen(true);
      toast.success(t("landingPage.verification.toasts.verifySuccess"));
    } catch (error) {
      if (error instanceof ApiBusinessError) {
        toast.error(error.message);
        return;
      }

      toast.error(t("landingPage.verification.toasts.unexpectedError"));
    }
  };

  return (
    <>
      <section className="relative w-full py-14 sm:py-20 lg:py-24 overflow-hidden bg-white text-slate-900">
        <div className="container relative z-20 mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-10 sm:space-y-12 lg:space-y-16"
          >
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-3 mb-6 bg-[#f2ce3c]/10 border border-[#f2ce3c] rounded-full px-5 py-2 shadow-sm">
                <span className="text-sm md:text-md font-bold tracking-widest text-[#214e41] uppercase">
                  {t("landingPage.verification.badge")}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-slate-900">
                {t("landingPage.verification.titlePrefix")}{" "}
                <span className="text-[#214e41]">
                  {t("landingPage.verification.titleHighlight")}
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-1">
                {t("landingPage.verification.subtitle")}
              </p>
            </div>

            {/* Verification Form */}
            <div className="flex justify-center max-w-2xl mx-auto">
              {/* ==================== Method 1: Verify by ID (COMMENTED) ==================== */}
              {/* 
              Chức năng xác thực bằng mã certificateId - tạm thời không sử dụng
              Nếu muốn bật, hãy thêm lại:
              - Input field cho certificateId
              - Button để xác thực
              - handleVerifyById function
              - useVerifyCertificateById hook
              */}

              {/* ==================== Method 2: Verify by PDF File ==================== */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="p-4 sm:p-6 w-full max-w-2xl border-2 border-slate-200 hover:border-[#214e41] transition-colors">
                  <h3 className="text-lg sm:text-xl font-bold text-[#214e41] mb-4 text-center">
                    {t("landingPage.verification.uploadTitle")}
                  </h3>

                  {/* Drag & Drop Area */}
                  <div
                    ref={dragAreaRef}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex flex-col items-center justify-center p-5 sm:p-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#214e41] hover:bg-slate-50 transition-colors"
                  >
                    {file ? (
                      <>
                        <FileText className="w-12 h-12 text-[#214e41] mb-2" />
                        <p className="text-slate-800 font-medium">
                          {file.name}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {t("landingPage.verification.changeFile")}
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-[#214e41] mb-2" />
                        <p className="text-slate-700 font-medium text-center">
                          {t("landingPage.verification.dragDrop")}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 text-center">
                          {t("landingPage.verification.orClick")}
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <Button
                    disabled={verifyByFileMutation.isPending || !file}
                    onClick={handleFileVerify}
                    className="w-full mt-4 bg-[#214e41] hover:bg-[#183930] text-white font-bold"
                  >
                    {verifyByFileMutation.isPending
                      ? t("landingPage.verification.verifying")
                      : t("landingPage.verification.verifyButton")}
                  </Button>
                </Card>
              </motion.div>
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#214e41]/5 border border-[#214e41]/20 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto"
            >
              <h4 className="font-bold text-[#214e41] mb-2">
                💡 {t("landingPage.verification.infoTitle")}
              </h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• {t("landingPage.verification.info1")}</li>
                <li>• {t("landingPage.verification.info2")}</li>
                <li>• {t("landingPage.verification.info3")}</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Result Modal */}
      <VerificationResultModal
        result={result}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFile(null);
          setResult(null);
        }}
      />
    </>
  );
}
