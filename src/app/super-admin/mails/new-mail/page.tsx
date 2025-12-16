"use client";

import React, { useState, useEffect } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  sendBulkEmailBatch, 
  clearBulkEmailState, 
  clearError, 
  clearSuccess 
} from "@/store/slices/adminslice/emailsent";
import { useRouter } from "next/navigation";

export default function BulkEmailPage({ className }: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { loading, error, success, result, progress } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    htmlContent: "",
    batchSize: 10
  });

  useEffect(() => {
    return () => {
      dispatch(clearBulkEmailState());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchSize' ? parseInt(value) || 10 : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    if (window.confirm(`Are you sure you want to send this email to all subscribers?`)) {
      await dispatch(sendBulkEmailBatch(formData));


      router.push("/super-admin/mails");
    }
  };

  const handleReset = () => {
    setFormData({
      subject: "",
      message: "",
      htmlContent: "",
      batchSize: 10
    });
    dispatch(clearBulkEmailState());
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Send Bulk Email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Send email to all subscribers at once
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Success Message */}
      {success && result && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                Bulk Email Sent Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                <p>Total: {result.total} emails</p>
                <p>Successful: {result.successful} emails</p>
                {result.failed > 0 && (
                  <>
                    <p className="text-red-600 dark:text-red-400">Failed: {result.failed} emails</p>
                    {result.failedEmails.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">View failed emails</summary>
                        <ul className="mt-2 ml-4 list-disc">
                          {result.failedEmails.map((email : any , idx : number) => (
                            <li key={idx}>{email}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => dispatch(clearSuccess())}
              className="text-green-600 hover:text-green-800 dark:text-green-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-300">Error</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-600 hover:text-red-800 dark:text-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Sending emails... {progress}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Email Form */}
      <div className="space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
            Email Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Enter email subject"
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-dark dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Message */}
        

        {/* HTML Content (Optional) */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
 Email Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="htmlContent"
            value={formData.htmlContent}
            onChange={handleInputChange}
            placeholder="Enter custom HTML content (leave empty to use default template)"
            disabled={loading}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-dark dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Advanced: Provide custom HTML for email body
          </p>
        </div>




<div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-2">
          Enter message on <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter your message here..."
            disabled={loading}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-dark dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This will be the main content of your email
          </p>
        </div>
      

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.subject.trim() || !formData.message.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Emails...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Bulk Email
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-dark dark:text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>This will send an email to all subscribers in your database</li>
              <li>Emails are sent in batches to avoid server overload</li>
              <li>Failed emails will be reported after completion</li>
              <li>Make sure to preview your content before sending</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}