// pages/certificates/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useApiClient } from "@/lib/api";
import {
  Download,
  Eye,
  FileText,
  Award,
  Calendar,
  DownloadCloud,
  Filter,
  Search,
  FileDown,
} from "lucide-react";
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
  certificate_course?: {
    // ✅ Fixed: Changed from 'course' to 'certificate_course'
    id: number;
    title: string;
    description: string;
  };
}

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const api = useApiClient();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const user = getDecryptedItem("userId");
      if (!user) {
        console.error("No user ID found");
        setCertificates([]);
        setLoading(false);
        return;
      }

      const response = await api.get(`certificate/user/${user}`);

      if (response?.data?.success) {
        setCertificates(response.data.data || []);
      } else {
        console.error("Failed to fetch certificates:", response?.data?.message);
        setCertificates([]);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (
    certificateId: number,
    certificateUrl: string,
    certificateCode: string,
    courseTitle: string,
  ) => {
    setDownloading(certificateId);
    try {
      // Create a more descriptive filename
      const fileName = `certificate_${certificateCode}_${courseTitle.replace(/\s+/g, "_")}.pdf`;

      const link = document.createElement("a");
      link.href = certificateUrl;
      link.download = fileName; // ✅ Fixed: Use PDF extension
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Try to update download count (if endpoint exists)
      try {
        await api.post(`certificate/${certificateId}/download`, {});
        // Refresh to get updated download count
        fetchCertificates();
      } catch (apiError) {
        console.log("Download count update not available");
      }
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(null);
    }
  };

  const handleView = (certificateUrl: string) => {
    window.open(certificateUrl, "_blank");
  };

  // Filter certificates based on search
  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.certificate_course?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()), // ✅ Fixed: certificate_course
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your certificates...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 transition-colors duration-200 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            My Certificates
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Showcasing your learning achievements and course completions
          </p>
        </div>

        {/* Stats and Controls */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {certificates.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Certificates
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {certificates.filter((c) => c.status === "issued").length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {certificates.reduce(
                    (total, cert) => total + cert.download_count,
                    0,
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Downloads
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* View Toggle */}
              <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Content */}
        {filteredCertificates.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md">
              <FileText className="mx-auto mb-6 h-24 w-24 text-gray-300 dark:text-gray-600" />
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {searchTerm ? "No certificates found" : "No certificates yet"}
              </h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Complete courses to earn certificates that will appear here"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onDownload={handleDownload}
                onView={handleView}
                downloading={downloading}
              />
            ))}
          </div>
        ) : (
          // List View
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {filteredCertificates.map((certificate, index) => (
              <CertificateListItem
                key={certificate.id}
                certificate={certificate}
                onDownload={handleDownload}
                onView={handleView}
                downloading={downloading}
                isLast={index === filteredCertificates.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Certificate Card Component (Grid View)
const CertificateCard = ({
  certificate,
  onDownload,
  onView,
  downloading,
}: {
  certificate: Certificate;
  onDownload: (id: number, url: string, code: string, title: string) => void;
  onView: (url: string) => void;
  downloading: number | null;
}) => (
  <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800">
    {/* Certificate Header */}
    <div className="p-6">
      {/* Course Title */}
      <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {certificate.certificate_course?.title || "Unknown Course"}{" "}
        {/* ✅ Fixed */}
      </h3>

      {/* Certificate Details */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="mr-2 h-4 w-4" />
          <span>
            Issued {new Date(certificate.issued_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <DownloadCloud className="mr-2 h-4 w-4" />
          <span>{certificate.download_count} downloads</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <FileDown className="mr-2 h-4 w-4" />
          <span>Certificate Code: {certificate.certificate_code}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            certificate.status === "issued"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {certificate.status === "issued" ? "✓ Active" : "Wait for approval"}
        </span>
      </div>
    </div>

 {['issued'].includes(certificate.status) && (<div className="border-t border-gray-100 bg-gray-50 px-6 pb-6 pt-4 dark:border-gray-600 dark:bg-gray-700/50">
      <div className="flex gap-3">
        <button
          onClick={() => onView(certificate.certificate_url)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button
          onClick={() =>
            onDownload(
              certificate.id,
              certificate.certificate_url,
              certificate.certificate_code,
              certificate.certificate_course?.title || "Certificate",
            )
          }
          disabled={downloading === certificate.id}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {downloading === certificate.id ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download
        </button>
      </div>
    </div>)} 
  
    {/* Actions */}
    
  </div>
);

// Certificate List Item Component
const CertificateListItem = ({
  certificate,
  onDownload,
  onView,
  downloading,
  isLast,
}: {
  certificate: Certificate;
  onDownload: (id: number, url: string, code: string, title: string) => void;
  onView: (url: string) => void;
  downloading: number | null;
  isLast: boolean;
}) => (
  <div
    className={`flex flex-col justify-between p-6 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 sm:flex-row sm:items-center ${
      !isLast ? "border-b border-gray-200 dark:border-gray-600" : ""
    }`}
  >
    {/* Left Section - Course Info */}
    <div className="mb-4 flex-1 sm:mb-0">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {certificate.certificate_course?.title || "Unknown Course"}{" "}
        {/* ✅ Fixed */}
      </h3>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          {new Date(certificate.issued_date).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <DownloadCloud className="mr-1 h-4 w-4" />
          {certificate.download_count} downloads
        </div>
        <div className="flex items-center">
          <FileDown className="mr-1 h-4 w-4" />
          {certificate.certificate_code}
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            certificate.status === "issued"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {certificate.status}
        </span>
      </div>
    </div>

    {/* Right Section - Actions */}
    <div className="flex gap-3">
      <button
        onClick={() => onView(certificate.certificate_url)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <Eye className="h-4 w-4" />
        View
      </button>
      <button
        onClick={() =>
          onDownload(
            certificate.id,
            certificate.certificate_url,
            certificate.certificate_code,
            certificate.certificate_course?.title || "Certificate",
          )
        }
        disabled={downloading === certificate.id}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
      >
        {downloading === certificate.id ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download
      </button>
    </div>
  </div>
);

export default CertificatesPage;
