// components/CourseCertificatesPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Award, ChevronLeft, Download, Mail, Users } from "lucide-react";

const CourseCertificatesPage: React.FC = () => {
  const [courseId, setCourseId] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setCourseId(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={() => (window.location.href = "/admin/courses")}
              className="mb-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Courses
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Course Certificates
                </h1>
                <p className="mt-1 text-gray-600">
                  Manage certificates for Course ID: {courseId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <Award className="mx-auto mb-4 h-16 w-16 text-blue-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Certificates Management
          </h2>
          <p className="mb-6 text-gray-600">
            This page will show all certificates issued for this course with
            bulk actions.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Download className="mr-2 h-4 w-4" />
              Bulk Download
            </button>
            <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Mail className="mr-2 h-4 w-4" />
              Bulk Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCertificatesPage;
