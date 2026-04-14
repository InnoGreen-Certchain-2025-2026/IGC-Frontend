import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCheck2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { VerifyCertificateFileResponse } from "@/types/certificate";

interface VerificationResultModalProps {
  result: VerifyCertificateFileResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationResultModal({
  result,
  isOpen,
  onClose,
}: VerificationResultModalProps) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card
              className={`relative overflow-hidden border-2 ${
                result?.valid
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {/* Close button X */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>

              <div className="p-8 space-y-6">
                {/* Icon and Title */}
                <div className="flex items-center gap-4">
                  <div
                    className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-full ${
                      result?.valid
                        ? "bg-emerald-200 text-emerald-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {result?.valid ? (
                      <FileCheck2 className="w-8 h-8" />
                    ) : (
                      <AlertTriangle className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        result?.valid ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {result?.valid
                        ? t("landingPage.verification.modal.successTitle")
                        : t("landingPage.verification.modal.failedTitle")}
                    </h2>
                    <p
                      className={`text-sm ${
                        result?.valid ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {result?.valid
                        ? t("landingPage.verification.modal.valid")
                        : t("landingPage.verification.modal.invalid")}
                    </p>
                  </div>
                </div>

                {/* Message */}
                {!result?.valid && result?.message && (
                  <div
                    className={`p-4 rounded-lg ${
                      result?.valid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <p className="text-sm font-medium">{result.message}</p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid gap-3 text-sm">
                  {result?.certificateId && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">
                        {t("landingPage.verification.modal.certificateId")}:
                      </span>
                      <span
                        className={
                          result?.valid ? "text-emerald-700" : "text-red-700"
                        }
                      >
                        {result.certificateId}
                      </span>
                    </div>
                  )}
                  {result?.studentName && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">
                        {t("landingPage.verification.modal.student")}:
                      </span>
                      <span
                        className={
                          result?.valid ? "text-emerald-700" : "text-red-700"
                        }
                      >
                        {result.studentName}
                      </span>
                    </div>
                  )}
                  {result?.issuer && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">
                        {t("landingPage.verification.modal.issuer")}:
                      </span>
                      <span
                        className={
                          result?.valid ? "text-emerald-700" : "text-red-700"
                        }
                      >
                        {result.issuer}
                      </span>
                    </div>
                  )}
                  {result?.issueTimestamp && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">
                        {t("landingPage.verification.modal.issueDate")}:
                      </span>
                      <span
                        className={
                          result?.valid ? "text-emerald-700" : "text-red-700"
                        }
                      >
                        {new Date(result.issueTimestamp).toLocaleDateString(
                          i18n.language === "vi" ? "vi-VN" : "en-US",
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <Button
                  onClick={onClose}
                  className={`w-full ${
                    result?.valid
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {t("landingPage.verification.modal.close")}
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
