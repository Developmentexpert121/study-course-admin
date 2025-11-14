"use client";

import { useRouter } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function AccessDenied() {
  const router = useRouter();
  const userRole: any = getDecryptedItem("role");

  const getRoleMessage = () => {
    switch (userRole?.toLowerCase()) {
      case "Teacher":
        return "Admin access required";
      case "Super-Admin":
        return "Super Admin access required";
      case "Student":
        return "User access required";
      default:
        return "You don't have permission to access this page";
    }
  };

  const getSuggestedAction = () => {
    switch (userRole?.toLowerCase()) {
      case "Teacher":
      case "Super-Admin":
        return "Please contact system administrator for elevated permissions";
      case "Student":
        return "Please contact your administrator if you need access to this resource";
      default:
        return "Please contact your administrator if you believe this is a mistake";
    }
  };

  const getDashboardPath = () => {
    switch (userRole?.toLowerCase()) {
      case "Admin":
        return "/admin/dashboard";
      case "super-admin":
        return "/super-admin/dashboard";
      case "Student":
        return "/user/dashboard";
      default:
        return "/";
    }
  };

  const handleDashboardRedirect = () => {
    router.push(getDashboardPath());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Access Denied</h1>

        {/* Role-specific message */}
        <div className="mb-4">
          <p className="mb-2 text-lg font-medium text-red-600">
            {getRoleMessage()}
          </p>
          <p className="text-sm text-gray-600">{getSuggestedAction()}</p>
        </div>

        {/* Current User Info */}
        {userRole && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <p className="text-sm text-yellow-800">
              Logged in as:{" "}
              <span className="font-medium capitalize">
                {userRole.replace("-", " ")}
              </span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push("/home")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go Home
          </button>
          {userRole && (
            <button
              onClick={handleDashboardRedirect}
              className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
            >
              My Dashboard
            </button>
          )}
        </div>

        {/* Support */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@devexhub.com"
              className="font-medium text-blue-600 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
