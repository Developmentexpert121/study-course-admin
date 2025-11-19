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

      const publicRoutes = [
        "/",
        "/about",
        "/contact",
        "/features",
        "/pricing",
        "/faq",
        "/privacy-policy",
        "/terms",
        "/courses",
      ];

      const isCourseDetailPage =
        pathname?.startsWith("/courses/") && pathname.split("/").length === 3;

      const isPublicPage =
        publicRoutes.includes(pathname) || isCourseDetailPage;
      const isAccessDeniedPage = pathname === "access-denied";
      if (isPublicPage || isAccessDeniedPage) {
        setLoading(false);
        return;
      }

      // 🎯 AUTH PAGES: If user is already logged in, redirect to appropriate dashboard
      if (token && isAuthPage) {
        try {
          const response = await api.get("user/me");
          if (response.success) {
            const userRole = response.data.user.role;

            if (userRole === "super-admin") {
              router.replace("/platform-manager/dashboard");
            } else if (userRole === "Teacher") {
              router.replace("/admin/dashboard");
            } else if (userRole === "Student") {
              router.replace("/user/dashboard");
            } else {
              router.replace("/");
            }
            return;
          }
        } catch (error) {
          // Token is invalid, allow access to auth page
          setLoading(false);
        }
        return;
      }

      // 🎯 PROTECTED PAGES: If no token, redirect to login
      if (!token && !isPublicPage && !isAuthPage) {
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
