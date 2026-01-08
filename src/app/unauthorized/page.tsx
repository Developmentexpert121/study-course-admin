// app/unauthorized/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-10 w-10 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            403 - Access Forbidden
          </h1>
          <p className="text-gray-500">
            You don't have the necessary permissions to view this page
          </p>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="mb-4 text-gray-600">This might be because:</p>
          <ul className="mb-6 space-y-2 text-left text-gray-600">
            <li className="flex items-center">
              <span className="mr-2 text-red-500">•</span>
              Your account doesn't have the required role
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-red-500">•</span>
              You need to be logged in with different credentials
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-red-500">•</span>
              This is a restricted area for administrators only
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push("/home")}
            className="flex-1 rounded-lg bg-[#02517b]px-4 py-2 text-white transition-colors hover:bg-[#1A6A93]"
          >
            Home Page
          </button>
          <button
            onClick={() => router.push("/auth/login")}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Login Again
          </button>
        </div>

        {/* Support */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@yourapp.com"
              className="text-blue-600 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
