"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import ToastProvider from "@/components/core/ToasterProvider";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function ClientLayoutShell({ children }: any) {
  const pathname = usePathname();
  const [token, setToken] = useState<any>();
  const [role, setRole] = useState<any>();
  const [permissions, setPermissions] = useState<any[]>([]);

  const isAuthPage = pathname.startsWith("/auth");
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
  const isPublicPage = publicRoutes.includes(pathname);

  useEffect(() => {
    const t = getDecryptedItem("token");
    const r = getDecryptedItem("role");
    const p = getDecryptedItem("permissions");
    setToken(t);
    setRole(r);
    setPermissions(Array.isArray(p) ? p : []);
  }, [pathname]);

  // Allow public pages (home) even without token
  if (!token && !isAuthPage && !isPublicPage) return null;

  const isAdmin = role === "Teacher";
  const isUser = role === "Student";
  const isSuperAdmin = role === "Super-Admin" || role === "super-admin";
  const isHR = role === "HR"; // Add HR role check
  const isAuthenticated =
    !isAuthPage && (isAdmin || isUser || isSuperAdmin || isHR);

  const showUserDashboard =
    isUser && (pathname === "/" || pathname === "/user/dashboard");

  // Determine if user is logged in (has token and is on a non-auth page)
  const isLoggedIn = !!token && !isAuthPage;

  return (
    <>
      {!isAuthPage && <NextTopLoader color="#5750F1" showSpinner={false} />}

      <div className={isLoggedIn ? "flex min-h-screen" : "min-h-screen"}>
        {/* Only show sidebar for authenticated users on protected pages */}
        {isAuthenticated && !isPublicPage && (
          <Sidebar role={role} permissions={permissions} />
        )}

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          {/* Only show header for authenticated users on protected pages */}
          {/* {isAuthenticated && !isPublicPage && <Header />} */}

          <main className="bg-banner isolate mx-auto mt-16 w-full md:mt-0">
            {children}
          </main>
        </div>
      </div>

      <ToastProvider />
    </>
  );
}
