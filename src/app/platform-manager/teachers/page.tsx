"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import UserManagementPage from "@/components/SuperAdmin/UserManagement/UserManagementPage";

export default function TeachersManagementPage({ className }: any) {
  return (
    <UserManagementPage
      roleName="Teacher"
      icon={
        <BookOpen className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
      }
      pageTitle="Teachers Management"
      pageDescription="View and manage all teacher accounts"
    />
  );
}
