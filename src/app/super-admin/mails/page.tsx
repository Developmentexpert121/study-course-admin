"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllEmails } from "@/store/slices/homepage/emailSlice";
import {
  selectEmails,
  selectEmailLoading,
  selectEmailError,
} from "@/store/slices/homepage/emailSlice";
import { Trash2, Mail, Plus, Users, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailListPage({ className }: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const emails = useAppSelector(selectEmails);
  const loading = useAppSelector(selectEmailLoading);
  const error = useAppSelector(selectEmailError);

  const [searchTerm, setSearchTerm] = useState("");
  const [deletingEmailId, setDeletingEmailId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllEmails());
  }, [dispatch]);

  const filteredEmails =
    emails?.data?.filter((email: any) =>
      email.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                Email Subscribers
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and communicate with your email subscribers
              </p>
            </div>
            <button
              onClick={() => router.push("/super-admin/mails/new-mail")}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white shadow-lg shadow-green-500/25 transition-all duration-200 hover:bg-green-700 hover:shadow-xl hover:shadow-green-500/30"
            >
              <Plus className="h-5 w-5" />
              New Campaign
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Subscribers
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {emails?.data?.length || 0}
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Campaigns
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  0
                </p>
              </div>
              <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Open Rate
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  -
                </p>
              </div>
              <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/30">
                <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={() => dispatch(fetchAllEmails())}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="w-20 text-center font-semibold text-gray-900 dark:text-white">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">
                    Subscriber
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 dark:text-white">
                    Subscription Date
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 dark:text-white">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Loading subscribers...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEmails.length > 0 ? (
                  filteredEmails.map((email: any, index: number) => (
                    <TableRow
                      key={email.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="text-center font-medium text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {email.email}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {email.email.split("@")[1]}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-gray-600 dark:text-gray-400">
                        {formatDate(email.createdAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
                        <div className="rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
                          <Mail className="h-12 w-12 opacity-50" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            No subscribers found
                          </p>
                          <p className="mt-1 text-sm">
                            {searchTerm
                              ? "Try adjusting your search"
                              : "Subscribers will appear here once they sign up"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
