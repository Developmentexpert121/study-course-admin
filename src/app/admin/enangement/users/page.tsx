// components/CourseUsersManagement.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  Mail,
  Download,
  Filter,
  Search,
  ChevronLeft,
  BarChart3,
  UserCheck,
  Clock,
  XCircle,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Send,
} from "lucide-react";
import { useApiClient } from "@/lib/api";
import StatCard from "@/app/ui-elements/StatCard";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";

const CourseUsersManagement: React.FC = () => {
  const api = useApiClient();

  const [courseId, setCourseId] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [progressFilter, setProgressFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [batchUpdating, setBatchUpdating] = useState<number | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setCourseId(id);
    } else {
      console.log("error", "No course ID provided");
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourseUsers();
    }
  }, [courseId]);

  const fetchCourseUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `certificate/admin/courses/${courseId}/enrolled-users`,
      );

      if (response?.data.success) {
        const usersData = response.data.data.users;

        // Transform the data to match component expectations
        const transformedUsers = usersData.map((user: any) => ({
          ...user,
          // Add is_completed for backward compatibility
          progress: {
            ...user.progress,
            is_completed: user.progress.course_completed,
          },
        }));

        setUsers(transformedUsers);
        setCourse(response.data.data.course);
        toasterSuccess("Users data loaded successfully", 2000, "id");
      } else {
        toasterError("Failed to load users data", 2000, "id");
      }
    } catch (error) {
      console.error("Error fetching course users:", error);
      toasterError("Failed to load users data", 2000, "id");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "completed" && user.progress.course_completed) ||
      (progressFilter === "in_progress" &&
        !user.progress.course_completed &&
        user.progress.overall_progress > 0) ||
      (progressFilter === "not_started" &&
        user.progress.overall_progress === 0);

    return matchesSearch && matchesProgress;
  });

  // Calculate summary statistics based on actual data
  const summary = {
    total_enrolled: users.length,
    completed_course: users.filter((u) => u.progress.course_completed).length,
    in_progress: users.filter(
      (u) => !u.progress.course_completed && u.progress.overall_progress > 0,
    ).length,
    not_started: users.filter((u) => u.progress.overall_progress === 0).length,
    certificates_issued: users.filter((u) => u.certificate).length,
  };

  const handleGenerateCertificate = async (
    userId: number,
    userName: string,
  ) => {
    setActionLoading(userId);
    try {
      const response = await api.post(
        `certificate/admin/courses/${courseId}/users/${userId}/generate-certificate`,
        {},
      );

      if (response?.data.success) {
        toasterSuccess(`Certificate generated for ${userName}`, 2000, "id");
        await fetchCourseUsers();
      } else {
        toasterError(
          response?.data.message || "Failed to generate certificate",
          2000,
          "id",
        );
      }
    } catch (error: any) {
      console.error("Error generating certificate:", error);
      toasterError(
        error.response?.data?.message || "Failed to generate certificate",
        2000,
        "id",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendCertificateEmail = async (
    certificateId: number,
    userName: string,
  ) => {
    setActionLoading(certificateId);
    try {
      const response = await api.post(
        `certificate/admin/certificates/${certificateId}/send-email`,
        {},
      );

      if (response?.data.success) {
        toasterSuccess(`Certificate email sent to ${userName}`, 2000, "id");
        await fetchCourseUsers();
      } else {
        toasterError(
          response?.data.message || "Failed to send email",
          2000,
          "id",
        );
      }
    } catch (error: any) {
      console.error("Error sending certificate email:", error);
      toasterError(
        error.response?.data?.message || "Failed to send email",
        2000,
        "id",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadCertificate = (
    certificateUrl: string,
    certificateCode: string,
    userName: string,
  ) => {
    try {
      const link = document.createElement("a");
      link.href = certificateUrl;
      link.download = `certificate_${certificateCode}_${userName.replace(/\s+/g, "_")}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toasterSuccess(`Certificate downloaded for ${userName}`, 2000, "id");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toasterError("Failed to download certificate", 2000, "id");
    }
  };

  const handleBatchChange = async (enrollmentId: number, newBatch: string, userName: string) => {
    setBatchUpdating(enrollmentId);
    try {
      const response = await api.put(
        `enroll/${enrollmentId}/batch`,
        { batch: newBatch }
      );

      if (response?.data.success) {
        toasterSuccess(`Batch updated to ${newBatch} for ${userName}`, 2000, "id");
        await fetchCourseUsers();
      } else {
        toasterError(
          response?.data.message || "Failed to update batch",
          2000,
          "id",
        );
      }
    } catch (error: any) {
      console.error("Error updating batch:", error);
      toasterError(
        error.response?.data?.message || "Failed to update batch",
        2000,
        "id",
      );
    } finally {
      setBatchUpdating(null);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-600";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getProgressIcon = (progress: number, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (progress > 0) return <PlayCircle className="h-4 w-4 text-blue-600" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={() => (window.location.href = "/admin/enangement")}
              className="mb-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course?.title}
                </h1>
                <p className="mt-1 text-gray-600">
                  Manage enrolled users and certificates
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    <Users className="mr-1 h-3 w-3" />
                    {summary.total_enrolled} Enrolled
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {summary.completed_course} Completed
                  </span>
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                    <Award className="mr-1 h-3 w-3" />
                    {summary.certificates_issued} Certificates
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchCourseUsers}
                  disabled={loading}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Progress</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            title="Total Enrolled"
            value={summary.total_enrolled}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Course Completed"
            value={summary.completed_course}
            icon={UserCheck}
            color="green"
          />
          <StatCard
            title="In Progress"
            value={summary.in_progress}
            icon={PlayCircle}
            color="yellow"
          />
          <StatCard
            title="Certificates Issued"
            value={summary.certificates_issued}
            icon={Award}
            color="purple"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Progress
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Certificate Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Batch
                  </TableHead>
                 
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((userProgress) => (
                  <UserRow
                    key={userProgress.user.id}
                    userProgress={userProgress}
                    onGenerateCertificate={handleGenerateCertificate}
                    onSendEmail={handleSendCertificateEmail}
                    onDownloadCertificate={handleDownloadCertificate}
                    onBatchChange={handleBatchChange}
                    actionLoading={actionLoading}
                    batchUpdating={batchUpdating}
                    getProgressColor={getProgressColor}
                    getProgressIcon={getProgressIcon}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || progressFilter !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "No users enrolled in this course"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserRow: React.FC<{
  userProgress: any;
  onGenerateCertificate: (userId: number, userName: string) => void;
  onSendEmail: (certificateId: number, userName: string) => void;
  onDownloadCertificate: (url: string, code: string, userName: string) => void;
  onBatchChange: (enrollmentId: number, newBatch: string, userName: string) => void;
  actionLoading: number | null;
  batchUpdating: number | null;
  getProgressColor: (progress: number) => string;
  getProgressIcon: (progress: number, isCompleted: boolean) => React.ReactNode;
}> = ({
  userProgress,
  onGenerateCertificate,
  onSendEmail,
  onDownloadCertificate,
  onBatchChange,
  actionLoading,
  batchUpdating,
  getProgressColor,
  getProgressIcon,
}) => {
  const { user, progress, certificate, actions, enrollment } = userProgress;

  // FIX: Always allow download and email if certificate exists and is issued
  const canDownload = certificate && certificate.status === "issued";
  const canSendEmail = certificate && certificate.status === "issued";
  const canGenerate = progress.course_completed && !certificate;

  return (
    <TableRow className="transition-colors duration-150 hover:bg-gray-50">
      {/* User Info */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
            {user.profileImage ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.profileImage}
                alt={user.fullName}
              />
            ) : (
              user.fullName
                .split(" ")
                .map((n: any) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.fullName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="text-xs text-gray-400">
              Enrolled:{" "}
              {new Date(
                userProgress.enrollment.enrolled_at,
              ).toLocaleDateString()}
            </div>
          </div>
        </div>
      </td>

      {/* Progress */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          {getProgressIcon(
            progress.overall_progress,
            progress.course_completed,
          )}
          <div className="mx-3 h-2 w-32 rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progress.overall_progress)}`}
              style={{ width: `${progress.overall_progress}%` }}
            ></div>
          </div>
          <span className="min-w-12 text-sm font-medium text-gray-900">
            {progress.overall_progress}%
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {progress.completed_chapters}/{progress.total_chapters} chapters
          {progress.course_completed && (
            <span className="ml-2 text-green-600">✓ Completed</span>
          )}
        </div>
      </td>

      {/* Certificate Status */}
      <td className="whitespace-nowrap px-6 py-4">
        {certificate ? (
          <div className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Issued</div>
              <div className="text-xs text-gray-500">
                {new Date(certificate.issued_date).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-400">
                Code: {certificate.certificate_code}
              </div>
            </div>
          </div>
        ) : progress.course_completed ? (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Award className="mr-1 h-3 w-3" />
            Ready to Issue
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </span>
        )}
      </td>

      {/* Batch */}
      <td className="px-6 py-4">
        <div className="flex flex-col items-center">
          <select
            value={enrollment.batch}
            onChange={(e) => onBatchChange(enrollment.id, e.target.value, user.fullName)}
            disabled={batchUpdating === enrollment.id}
            className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {[1, 2, 3, 4, 5, 6].map((batch) => (
              <option key={batch} value={batch.toString()}>
                Batch {batch}
              </option>
            ))}
          </select>
          {batchUpdating === enrollment.id && (
            <div className="mt-2 h-3 w-3 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          )}
          <div className="mt-2 text-xs text-gray-500 text-center">
            {enrollment.batch === '1' && '10:00 AM - 11:00 AM'}
            {enrollment.batch === '2' && '11:00 AM - 12:00 PM'}
            {enrollment.batch === '3' && '12:00 PM - 1:00 PM'}
            {enrollment.batch === '4' && '3:00 PM - 4:00 PM'}
            {enrollment.batch === '5' && '4:00 PM - 5:00 PM'}
            {enrollment.batch === '6' && '5:00 PM - 6:00 PM'}
          </div>
        </div>
      </td>

  
    </TableRow>
  );
};

export default CourseUsersManagement;