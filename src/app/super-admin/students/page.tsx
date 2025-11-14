"use client";

import React from "react";
import { Users } from "lucide-react";
import UserManagementPage from "@/components/SuperAdmin/UserManagement/UserManagementPage";

export default function StudentsManagementPage({ className }: any) {
  return (
    <UserManagementPage
      roleName="Student"
      icon={
        <Users className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
      }
      pageTitle="Students Management"
      pageDescription="View and manage all student accounts"
    />
  );
}
