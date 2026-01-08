"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchAllEmails } from "@/store/slices/homepage/emailSlice";
import {
  selectEmails,
  selectEmailLoading,
  selectEmailError,

} from "@/store/slices/homepage/emailSlice";
import { Trash2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailListPage({ className }: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get state from Redux store
  const emails = useAppSelector(selectEmails);
  const loading = useAppSelector(selectEmailLoading);
  const error = useAppSelector(selectEmailError);
  //   const totalEmails = useAppSelector(selectTotalEmails);


  const [deletingEmailId, setDeletingEmailId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllEmails());
  }, [dispatch]);

  const handleDeleteEmail = async (e: React.MouseEvent, emailId: number) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this email?")) {
      setDeletingEmailId(emailId);
      try {
        // You'll need to create a deleteEmail action in your slice
        // const result = await dispatch(deleteEmail({ emailId }));
        // if (deleteEmail.fulfilled.match(result)) {
        //   dispatch(fetchAllEmails());
        // }
        console.log("Delete email:", emailId);
        // For now, just refetch to show the current state
        dispatch(fetchAllEmails());
      } catch (error) {
        console.error("Failed to delete email:", error);
      } finally {
        setDeletingEmailId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDomain = (email: string) => {
    return email.split('@')[1];
  };

  return (
    <div
      className={cn(
        "grid  bg-gray-50 px-7.5 pb-4 pt-7.5  dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Email Subscribers
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <button
            //   onClick={(e) => handleDeleteEmail(e, email.id)}
            //   disabled={deletingEmailId === email.id}
            // onClick={()=> router.push("")}
            onClick={() => router.push(`/super-admin/mails/new-mail`)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send Message"
          >
            <Mail className="w-4 h-4" />
            {/* {deletingEmailId === email.id ? "Sending..." : "Message"} */}
            Message
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="w-16">S.No</TableHead>
            <TableHead className="!text-left">Email Address</TableHead>
            {/* <TableHead>Domain</TableHead> */}
            {/* <TableHead>Email ID</TableHead> */}
            <TableHead>Subscribed Date</TableHead>
            {/* <TableHead>Action</TableHead> */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading emails...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : emails?.data && emails?.data.length > 0 ? (
            emails?.data.map((email: any, index: number) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                key={index}
              >
                <TableCell className="text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="!text-left">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {email?.email}
                  </div>
                </TableCell>
                {/* <TableCell>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    {getDomain(email.email)}
                  </span>
                </TableCell> */}
                {/* <TableCell className="font-mono text-sm">
                  #{email.EmailId}
                </TableCell> */}
                <TableCell>
                  {formatDate(email.createdAt)}
                </TableCell>
                {/* <TableCell>
             <button
  onClick={(e) => handleDeleteEmail(e, email.id)}
  disabled={deletingEmailId === email.id}
  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  title="Send Message"
>
  <Mail className="w-4 h-4" />
  {deletingEmailId === email.id ? "Sending..." : "Message"}
</button>
                </TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Mail className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-lg">No emails found</p>
                  <p className="text-sm">Subscribed emails will appear here</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Refresh button since we're not using pagination yet */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => dispatch(fetchAllEmails())}
          disabled={loading}
          className="cursor-pointer px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {/* Showing {emails.length} of {totalEmails} emails */}
        </div>
      </div>
    </div>
  );
}