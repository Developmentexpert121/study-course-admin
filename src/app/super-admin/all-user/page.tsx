"use client";

import React, { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUsers, setPage } from "../../../store/slices/adminslice/all-user-details";

export default function UsersWithProgressPage({ className }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get state from Redux store
  const { users, totalPages, currentPage, loading, error } = useAppSelector(
    (state) => state.users
  );
  
  const limit = 5;

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setPage(currentPage + 1));
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        All Users List
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : users && users.length > 0 ? (
            users.map((user: any) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={user.id}
              >
                <TableCell className="!text-left">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || "User"}</TableCell>
                <TableCell>
                  <span className={user.verifyUser ? "text-green-600" : "text-red-500"}>
                    {user.verifyUser ? "Verified" : "Unverified"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="mt-4 flex justify-end items-center gap-3">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
          className="cursor-pointer px-3 disabled:cursor-not-allowed py-1 border rounded-xl disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || loading}
          className="cursor-pointer px-3 py-1 disabled:cursor-not-allowed border rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}