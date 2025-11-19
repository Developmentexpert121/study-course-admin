"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

interface UsersProps {
  className?: string;
  users: User[];
  // loading: boolean;
}

export function Users({ className, users }: UsersProps) {
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
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={user.id}
              >
                <TableCell className="!text-left">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
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
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  }).format(new Date(user.createdAt))}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* )} */}
    </div>
  );
}
