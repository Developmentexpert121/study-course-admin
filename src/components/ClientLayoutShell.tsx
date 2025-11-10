"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import ToastProvider from "@/components/core/ToasterProvider";
import UserCoursesDashboard from "@/components/UserCoursesDashboard";

import type { PropsWithChildren } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function ClientLayoutShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [token, setToken] = useState<any>();
  const [role, setRole] = useState<any>();
  const isAuthPage = pathname.startsWith("/auth");
  const isHomePage = pathname === "/" || pathname === "/";
  const isPublicPage = isHomePage;

  useEffect(() => {
    const t = getDecryptedItem("token");
    const r = getDecryptedItem("role");
    console.log("role of user ", r);
    setToken(t);
    setRole(r);
  }, [pathname]);

  // Allow public pages (home) even without token
  if (!token && !isAuthPage && !isPublicPage) return null;

  const isAdmin = role === "admin";
  const isUser = role === "user";
  const isSuperAdmin = role === "Super-Admin" || role === "super-admin";
  const isAuthenticated = !isAuthPage && (isAdmin || isUser || isSuperAdmin);

  const showUserDashboard =
    isUser && (pathname === "/" || pathname === "/user/dashboard");

  // Determine if user is logged in (has token and is on a non-auth page)
  const isLoggedIn = !!token && !isAuthPage;

  return (
    <>
      {!isAuthPage && <NextTopLoader color="#5750F1" showSpinner={false} />}

      <div className={isLoggedIn ? "flex min-h-screen" : "min-h-screen"}>
        {/* Only show sidebar for authenticated users on protected pages */}
        {isAuthenticated && !isPublicPage && <Sidebar />}

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          {/* Only show header for authenticated users on protected pages */}
          {/* {isAuthenticated && !isPublicPage && <Header />} */}

          <main className="bg-banner isolate mx-auto w-full mt-16 md:mt-0">
            {showUserDashboard ? <UserCoursesDashboard /> : children}
          </main>
        </div>
      </div>

      <ToastProvider />
    </>
  );
}
