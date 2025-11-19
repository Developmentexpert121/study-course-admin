"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ArrowLeft,
  Users,
  BarChart3,
  Clock,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  sendBulkEmailBatch,
  clearBulkEmailState,
  clearError,
  clearSuccess,
} from "@/store/slices/adminslice/emailsent";
import { useRouter } from "next/navigation";

export default function BulkEmailPage({ className }: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, success, result, progress } = useAppSelector(
    (state: any) => state.bulkEmail,
  );

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    htmlContent: "",
    batchSize: 10,
  });

  useEffect(() => {
    return () => {
      dispatch(clearBulkEmailState());
    };
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "batchSize" ? parseInt(value) || 10 : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to send this email to all subscribers?`,
      )
    ) {
      await dispatch(sendBulkEmailBatch(formData));
    }
  };

  const handleReset = () => {
    setFormData({
      subject: "",
      message: "",
      htmlContent: "",
      batchSize: 10,
    });
    dispatch(clearBulkEmailState());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10">
      <div className="mx-auto max-w-4xl">
        {/* Enhanced Header */}
        <div className="relative mb-8">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-xl"></div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-r from-emerald-400/10 to-cyan-500/10 blur-xl"></div>

          <div className="relative">
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="group rounded-2xl p-2 transition-all duration-200 hover:bg-white/80 hover:shadow-lg dark:hover:bg-gray-800/80"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 transition-transform group-hover:scale-110 dark:text-gray-400" />
              </button>
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                    <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-sm font-medium text-gray-600 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
                    Campaign Creator
                  </span>
                </div>

                <h1 className="mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:via-blue-100 dark:to-purple-100">
                  New Email Campaign
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Create and send email campaigns to all your subscribers
                </p>
              </div>
            </div>

            {/* Enhanced Stats Overview */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/80 dark:bg-gray-800/80">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-500/5 transition-colors group-hover:bg-blue-500/10"></div>
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/30">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Recipients
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      All Subscribers
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/80 dark:bg-gray-800/80">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-green-500/5 transition-colors group-hover:bg-green-500/10"></div>
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-green-100 p-3 transition-transform group-hover:scale-110 dark:bg-green-900/30">
                    <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Delivery Method
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      Bulk Send
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/80 dark:bg-gray-800/80">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-purple-500/5 transition-colors group-hover:bg-purple-500/10"></div>
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-purple-100 p-3 transition-transform group-hover:scale-110 dark:bg-purple-900/30">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      Ready
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-xl backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/80">
          <div className="p-8">
            {/* Enhanced Success Message */}
            {success && result && (
              <div className="mb-8 rounded-2xl border border-green-200/80 bg-green-50/80 p-6 backdrop-blur-sm dark:border-green-800/80 dark:bg-green-900/20">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                      Campaign Sent Successfully!
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-xl bg-white/80 p-4 text-center backdrop-blur-sm dark:bg-green-900/30">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {result.total}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Total
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/80 p-4 text-center backdrop-blur-sm dark:bg-green-900/30">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {result.successful}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Successful
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/80 p-4 text-center backdrop-blur-sm dark:bg-red-900/30">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {result.failed}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Failed
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/80 p-4 text-center backdrop-blur-sm dark:bg-blue-900/30">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {Math.round((result.successful / result.total) * 100)}
                          %
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Success Rate
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(clearSuccess())}
                    className="rounded-lg p-1 text-green-600 transition-colors hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Error Message */}
            {error && (
              <div className="mb-8 rounded-2xl border border-red-200/80 bg-red-50/80 p-6 backdrop-blur-sm dark:border-red-800/80 dark:bg-red-900/20">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-red-100 p-3 dark:bg-red-900/30">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 dark:text-red-300">
                      Delivery Failed
                    </h3>
                    <p className="mt-2 text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(clearError())}
                    className="rounded-lg p-1 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Progress Bar */}
            {loading && (
              <div className="mb-8 rounded-2xl border border-blue-200/80 bg-blue-50/80 p-6 backdrop-blur-sm dark:border-blue-800/80 dark:bg-blue-900/20">
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/30">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 dark:text-blue-300">
                      Sending campaign emails...
                    </p>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      Progress: {progress}% completed
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {progress}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-blue-200/80 dark:bg-blue-800/80">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 dark:from-blue-400 dark:to-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Enhanced Email Form */}
            <div className="space-y-8">
              {/* Subject */}
              <div className="group">
                <label className="mb-3 block text-lg font-semibold text-gray-900 dark:text-white">
                  Campaign Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter an engaging subject line..."
                    disabled={loading}
                    className="w-full rounded-2xl border-2 border-gray-200 bg-white/50 px-4 py-4 text-lg font-medium text-gray-900 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Target className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="group">
                <label className="mb-3 block text-lg font-semibold text-gray-900 dark:text-white">
                  Email Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your email content here..."
                    disabled={loading}
                    rows={8}
                    className="resize-vertical w-full rounded-2xl border-2 border-gray-200 bg-white/50 px-4 py-4 text-gray-900 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  />
                  <div className="absolute right-4 top-4">
                    <Mail className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  This is the main content that your subscribers will read
                </p>
              </div>

              {/* Enhanced Advanced HTML Content */}
              <div className="group border-t border-gray-200/60 pt-8 dark:border-gray-700/60">
                <details className="cursor-pointer">
                  <summary className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                    <div className="rounded-lg bg-purple-100 p-2 transition-transform group-hover:scale-110 dark:bg-purple-900/30">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Advanced HTML Content (Optional)
                  </summary>
                  <div className="mt-4">
                    <textarea
                      name="htmlContent"
                      value={formData.htmlContent}
                      onChange={handleInputChange}
                      placeholder="Enter custom HTML content for advanced formatting..."
                      disabled={loading}
                      rows={6}
                      className="resize-vertical w-full rounded-2xl border-2 border-gray-200 bg-white/50 px-4 py-4 font-mono text-sm text-gray-900 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      For advanced users: Provide custom HTML to override the
                      default email template
                    </p>
                  </div>
                </details>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex gap-4 border-t border-gray-200/60 pt-8 dark:border-gray-700/60">
                <button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.subject.trim() ||
                    !formData.message.trim()
                  }
                  className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Sending Campaign...
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" />
                        Launch Campaign
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="rounded-2xl border-2 border-gray-300 bg-white/50 px-8 py-4 font-semibold text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Info Card */}
        <div className="mt-8 rounded-2xl border border-gray-200/80 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/80">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Campaign Best Practices
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/50 dark:hover:bg-gray-700/50">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                  <p>Keep subject lines clear and under 60 characters</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/50 dark:hover:bg-gray-700/50">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                  <p>Personalize content for better engagement</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/50 dark:hover:bg-gray-700/50">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500"></div>
                  <p>Test your email before sending to all subscribers</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/50 dark:hover:bg-gray-700/50">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500"></div>
                  <p>Include clear call-to-action buttons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
