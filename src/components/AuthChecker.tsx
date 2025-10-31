"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = useApiClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      const token = getDecryptedItem("token");

      const isAuthPage = pathname?.startsWith("/auth") || false;
      const isHomePage = pathname === "/" || pathname === "/home";
      const isPublicPage = isHomePage;
      const isAccessDeniedPage = pathname === "access-denied";
      if (isPublicPage || isAccessDeniedPage) {
        console.log("✅ Allowing public page access");
        setLoading(false);
        return;
      }

      // 🎯 AUTH PAGES: If user is already logged in, redirect to appropriate dashboard
      if (token && isAuthPage) {
        try {
          const response = await api.get("user/me");
          if (response.success) {
            const userRole = response.data.user.role;
            console.log("User already logged in, redirecting to dashboard");

            if (userRole === "super-admin") {
              router.replace("/super-admin/dashboard");
            } else if (userRole === "admin") {
              router.replace("/admin/dashboard");
            } else if (userRole === "user") {
              router.replace("/user/dashboard");
            } else {
              router.replace("/home");
            }
            return;
          }
        } catch (error) {
          // Token is invalid, allow access to auth page
          console.log("Invalid token, allowing auth page access");
          setLoading(false);
        }
        return;
      }

      // 🎯 PROTECTED PAGES: If no token, redirect to login
      if (!token && !isPublicPage && !isAuthPage) {
        console.log("❌ No token, redirecting to login");
        router.replace("/auth/login");
        return;
      }

      // 🎯 ALL OTHER CASES: Allow access
     
      setLoading(false);
    };

    checkAuth();
  }, [isClient, pathname, router, api]);

  if (!isClient || loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
