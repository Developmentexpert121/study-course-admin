// pages/certificates/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useApiClient } from "@/lib/api";
import { Download, Eye, FileText } from "lucide-react";
import { getDecryptedItem } from "@/utils/storageHelper";

interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_code: string;
  certificate_url: string;
  issued_date: string;
  status: "issued" | "revoked";
  download_count: number;
  course?: {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
  };
}

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);
  const api = useApiClient();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const user = getDecryptedItem("userId");

      const response = await api.get(`certificate/user/${user}`);

      if (response.success) {
        setCertificates(response.data);
      } else {
        alert("Failed to load certificates");
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      alert("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: number) => {
    setDownloading(certificateId);
    try {
      const response = await api.post(
        `certificate/${certificateId}/download`,
        {},
      );

      if (response.success) {
        // Open certificate URL in new tab for download
        window.open(response.data.download_url, "_blank");
        // Refresh list to update download count
        fetchCertificates();
      } else {
        alert("Failed to download certificate");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download certificate");
    } finally {
      setDownloading(null);
    }
  };

  const handleView = (certificateUrl: string) => {
    window.open(certificateUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              My Certificates
            </h1>
            <p className="mt-1 text-gray-600">
              View and download your course completion certificates
            </p>
          </div>

          {/* Certificates List */}
          <div className="p-6">
            {certificates.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-24 w-24 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No certificates yet
                </h3>
                <p className="mb-6 text-gray-500">
                  Complete courses to earn certificates that will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certificates &&
                  certificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                    >
                      <div className="p-6">
                        {/* Course Thumbnail */}
                        {certificate.course?.thumbnail && (
                          <div className="mb-4">
                            <img
                              src={certificate.course.thumbnail}
                              alt={certificate.course.title}
                              className="h-32 w-full rounded-md object-cover"
                            />
                          </div>
                        )}

                        {/* Course Title */}
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                          {certificate.course?.title}
                        </h3>

                        {/* Certificate Details */}
                        <div className="mb-4 space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Issued:</span>
                            <span>
                              {new Date(
                                certificate.issued_date,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Downloads:</span>
                            <span>{certificate.download_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                certificate.status === "issued"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {certificate.status}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleView(certificate.certificate_url)
                            }
                            className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(certificate.id)}
                            disabled={downloading === certificate.id}
                            className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
                          >
                            {downloading === certificate.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
