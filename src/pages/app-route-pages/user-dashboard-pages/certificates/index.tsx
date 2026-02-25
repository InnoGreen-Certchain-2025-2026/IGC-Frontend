import { useEffect, useState } from "react";
import {
  getMyCertificatesApi,
  downloadCertificateApi,
} from "@/services/certificateService";
import { toast } from "sonner";
import type { CertificateResponse } from "@/types/certificate/CertificateResponse";

/**
 * Certificate list page.
 * Displays the user's blockchain certificates with validity badges.
 */
export default function CertificatesPage() {
  const [certs, setCerts] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyCertificatesApi();
      if (res.data) setCerts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải bằng cấp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày cấp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certs.map((cert) => (
                <tr key={cert.certificateId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.certificateId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.certificateType || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        cert.isValid
                          ? "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                          : "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                      }
                    >
                      {cert.isValid ? "Hợp lệ" : "Không hợp lệ"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={async () => {
                        try {
                          const { filename, blob } =
                            await downloadCertificateApi(cert.certificateId);
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = filename;
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch (e) {
                          console.error(e);
                          toast.error("Không thể tải xuống");
                        }
                      }}
                    >
                      Tải xuống
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
