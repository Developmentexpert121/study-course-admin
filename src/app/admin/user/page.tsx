"use client";

import { useEffect, useState } from "react";
import { Users } from "@/components/Tables/users";
import { useApiClient } from "@/lib/api";

const UsersClient = () => {
  const [users, setUsers] = useState<any>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const api = useApiClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await api.get("user");
        setUsers(res.data?.data || []);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load users. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Unable to load users
          </h3>
          <p className="mb-4 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-md border border-transparent bg-[#02517b]px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1A6A93] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Users Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and view all registered users in the system
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 px-4 py-2">
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-700">
                  {users?.users?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {users?.users && users.users.length > 0 ? (
          <Users users={users.users} />
        ) : (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-gray-500">
              There are no users registered in the system yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersClient;
