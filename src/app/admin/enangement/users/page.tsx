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

const CourseUsersManagement: React.FC = () => {
  const api = useApiClient();

  const [courseId, setCourseId] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [progressFilter, setProgressFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setCourseId(id);
    } else {
      showNotification("error", "No course ID provided");
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourseUsers();
    }
  }, [courseId]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCourseUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `certificate/admin/courses/${courseId}/enrolled-users`,
      );

      if (response?.data.success) {
        setUsers(response?.data.data.users);
        setCourse(response?.data.data.course);
        showNotification("success", "Users data loaded successfully");
      } else {
        showNotification("error", "Failed to load users data");
      }
    } catch (error) {
      console.error("Error fetching course users:", error);
      showNotification("error", "Error loading users data");
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
      (progressFilter === "completed" && user.progress.is_completed) ||
      (progressFilter === "in_progress" &&
        !user.progress.is_completed &&
        user.progress.overall_progress > 0) ||
      (progressFilter === "not_started" &&
        user.progress.overall_progress === 0);

    return matchesSearch && matchesProgress;
  });

  // Calculate summary statistics
  const summary = {
    total_enrolled: users.length,
    completed_course: users.filter((u) => u.progress.is_completed).length,
    in_progress: users.filter(
      (u) => !u.progress.is_completed && u.progress.overall_progress > 0,
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
      const response = await fetch(
        `certificate/admin/courses/${courseId}/users/${userId}/generate-certificate`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      if (data.success) {
        showNotification("success", `Certificate generated for ${userName}`);
        await fetchCourseUsers();
      } else {
        showNotification(
          "error",
          data.message || "Failed to generate certificate",
        );
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      showNotification("error", "Error generating certificate");
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
        showNotification("success", `Certificate email sent to ${userName}`);
        await fetchCourseUsers();
      } else {
        showNotification(
          "error",
          response?.data.message || "Failed to send email",
        );
      }
    } catch (error) {
      console.error("Error sending certificate email:", error);
      showNotification("error", "Error sending email");
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
      link.download = `certificate_${certificateCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification("success", `Certificate downloaded for ${userName}`);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      showNotification("error", "Error downloading certificate");
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
      {/* Notification */}
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg p-4 shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={() => (window.location.href = "/admin/enangement")}
              className="mb-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Enangement
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course?.title}
                </h1>
                <p className="mt-1 text-gray-600">
                  Manage enrolled users and certificates
                </p>
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
        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Total Enrolled"
            value={summary.total_enrolled}
            color="blue"
          />
          <StatCard
            icon={<UserCheck className="h-6 w-6 text-green-600" />}
            title="Completed"
            value={summary.completed_course}
            color="green"
          />
          <StatCard
            icon={<PlayCircle className="h-6 w-6 text-yellow-600" />}
            title="In Progress"
            value={summary.in_progress}
            color="yellow"
          />
          <StatCard
            icon={<Award className="h-6 w-6 text-purple-600" />}
            title="Certificates"
            value={summary.certificates_issued}
            color="purple"
          />
        </div>

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

        {/* Users Table */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Certificate Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((userProgress) => (
                  <UserRow
                    key={userProgress.user.id}
                    userProgress={userProgress}
                    onGenerateCertificate={handleGenerateCertificate}
                    onSendEmail={handleSendCertificateEmail}
                    onDownloadCertificate={handleDownloadCertificate}
                    actionLoading={actionLoading}
                    getProgressColor={getProgressColor}
                    getProgressIcon={getProgressIcon}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No users enrolled in this course"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}> = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
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
  actionLoading: number | null;
  getProgressColor: (progress: number) => string;
  getProgressIcon: (progress: number, isCompleted: boolean) => React.ReactNode;
}> = ({
  userProgress,
  onGenerateCertificate,
  onSendEmail,
  onDownloadCertificate,
  actionLoading,
  getProgressColor,
  getProgressIcon,
}) => {
  const { user, progress, certificate, actions } = userProgress;

  return (
    <tr className="transition-colors duration-150 hover:bg-gray-50">
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
          </div>
        </div>
      </td>

      {/* Progress */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          {getProgressIcon(progress.overall_progress, progress.is_completed)}
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
            </div>
          </div>
        ) : progress.is_completed ? (
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

      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="flex items-center space-x-2">
          {actions.can_generate_certificate && (
            <button
              onClick={() => onGenerateCertificate(user.id, user.fullName)}
              disabled={actionLoading === user.id}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading === user.id ? (
                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <Award className="mr-1 h-3 w-3" />
              )}
              Generate
            </button>
          )}

          {actions.can_download_certificate && certificate && (
            <button
              onClick={() =>
                onDownloadCertificate(
                  certificate.certificate_url,
                  certificate.certificate_code,
                  user.fullName,
                )
              }
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
            >
              <Download className="mr-1 h-3 w-3" />
              Download
            </button>
          )}

          {actions.can_send_certificate && certificate && (
            <button
              onClick={() => onSendEmail(certificate.id, user.fullName)}
              disabled={actionLoading === certificate.id}
              className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading === certificate.id ? (
                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <Send className="mr-1 h-3 w-3" />
              )}
              Email
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CourseUsersManagement;
