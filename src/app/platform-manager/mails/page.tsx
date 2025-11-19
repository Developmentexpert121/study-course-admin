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
import {
  Trash2,
  Mail,
  Plus,
  Users,
  RefreshCw,
  Search,
  Download,
  Filter,
  ChevronDown,
} from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10">
      <div className="mx-auto max-w-7xl">
        {/* Premium Header */}
        <div className="relative mb-8">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-xl"></div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-r from-emerald-400/10 to-cyan-500/10 blur-xl"></div>

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-sm font-medium text-gray-600 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
                    Subscriber Management
                  </span>
                </div>

                <h1 className="mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:via-blue-100 dark:to-purple-100">
                  Email Subscribers
                </h1>
                <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                  Manage and communicate with your email subscribers effectively
                </p>
              </div>

              <button
                onClick={() => router.push("/platform-manager/mails/new-mail")}
                className="group relative transform rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 font-semibold text-white shadow-2xl shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/40"
              >
                <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                <div className="relative flex items-center gap-3">
                  <div className="rounded-lg bg-white/20 p-1.5">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span>New Campaign</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/80 dark:bg-gray-800/80">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-500/5 transition-colors group-hover:bg-blue-500/10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Subscribers
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {emails?.data?.length || 0}
                </p>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  +12% from last month
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/80 dark:bg-gray-800/80">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-green-500/5 transition-colors group-hover:bg-green-500/10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Campaigns
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  0
                </p>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  Ready to send
                </p>
              </div>
              <div className="rounded-xl bg-green-100 p-3 transition-transform group-hover:scale-110 dark:bg-green-900/30">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/80 dark:bg-gray-800/80">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-purple-500/5 transition-colors group-hover:bg-purple-500/10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Open Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  -
                </p>
                <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                  Track performance
                </p>
              </div>
              <div className="rounded-xl bg-purple-100 p-3 transition-transform group-hover:scale-110 dark:bg-purple-900/30">
                <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-xl backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/80">
          {/* Enhanced Toolbar */}
          <div className="border-b border-gray-200/60 p-6 dark:border-gray-700/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white/50 py-2.5 pl-10 pr-4 text-gray-900 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              <button
                onClick={() => dispatch(fetchAllEmails())}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600"
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
            <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Enhanced Table */}
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200/60 dark:border-gray-700/60">
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
                      className="group border-b border-gray-100 transition-all duration-200 hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="text-center font-medium text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-100 p-2 transition-transform group-hover:scale-110 dark:bg-blue-900/30">
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
