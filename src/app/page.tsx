// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function RootPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
 
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      try {
        const token = getDecryptedItem("token");
        const userRole = getDecryptedItem("role");
        if (!token) {
          router.replace("/home");
        } else {
          let redirectPath = "/dashboard";
          if (userRole === "super-admin" || userRole === "Super-Admin") {
            redirectPath = "/super-admin/dashboard";
          } else if (userRole === "admin") {
            redirectPath = "/admin/dashboard";
          } else if (userRole === "user") {
            redirectPath = "/user/dashboard";
          }

          router.replace(redirectPath);
        }
      } catch (error) {
        router.replace("/home");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}
