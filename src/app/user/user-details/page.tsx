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
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";

export default function UsersWithProgressPage({ className }: any) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const api = useApiClient();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get(
          `user/get-all-details?page=${page}&limit=${limit}`,
        );
        setUsers(res.data.data.users || []);
        const total = res.data?.data?.totalPages || 0;
        setTotal(total);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [page]);

  const handleMore = (id: any) => {
    router.push(`/users/user-details/view-details?id=${id}`);
  };
  // const totalPages = Math.ceil(total / limit);

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

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Enrolled Courses</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users && users.length > 0 ? (
            users.map((user: any) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={user.id}
                onClick={() => handleMore(user.id)}
              >
                <TableCell className="!text-left">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || "User"}</TableCell>
                <TableCell>
                  <span
                    className={
                      user.verified ? "text-green-600" : "text-red-500"
                    }
                  >
                    {user.verified ? "Verified" : "Unverified"}
                  </span>
                </TableCell>

                <TableCell>
                  {user.enrolledCourses?.length > 0 ? (
                    <ul className="space-y-1 text-left">
                      {user.enrolledCourses.map((course: any) => (
                        <li
                          key={course.course_id}
                          className="flex items-center gap-1"
                        >
                          <img
                            src={course.image}
                            alt={course.title}
                            width={30}
                            height={30}
                            className="rounded"
                          />
                          <span>{course.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-500">Not Enrolled</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.enrolledCourses?.length > 0 ? (
                    <ul className="space-y-1 text-left">
                      {user.enrolledCourses.map((course: any) => (
                        <li key={course.course_id}>
                          {course.completion_percentage}% complete
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* <TableCell onClick={() => handleMore(user.id)} className="cursor-pointer">View More Details</TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="cursor-pointer rounded-xl border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {total || 1}
        </span>
        <button
          onClick={() => setPage((prev) => (page < total ? prev + 1 : prev))}
          disabled={page >= total}
          className="cursor-pointer rounded-xl border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {/* )} */}
    </div>
  );
}
