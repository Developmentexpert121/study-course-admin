"use client";

import React from "react";
import { Shield } from "lucide-react";
import UserManagementPage from "@/components/SuperAdmin/UserManagement/UserManagementPage";

export default function AdminsManagementPage({ className }: any) {
  return (
    <UserManagementPage
      roleName="Admin"
      icon={
        <Shield className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
      }
      pageTitle="Admins Management"
      pageDescription="View and manage all admin accounts (excluding Super-Admins)"
    />
  );
}
