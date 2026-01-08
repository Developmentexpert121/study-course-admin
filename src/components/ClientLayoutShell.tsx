"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import ToastProvider from "@/components/core/ToasterProvider";
// import UserCoursesDashboard from "@/components/UserCoursesDashboard";

import type { PropsWithChildren } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";
import { height } from "tailwindcss/defaultTheme";
import { useSidebarContext } from "./Layouts/sidebar/sidebar-context";

export default function ClientLayoutShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [token, setToken] = useState<any>();
  const [role, setRole] = useState<any>();
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
    "/courses/",
  ];
  const isPublicPage = publicRoutes.includes(pathname);

  useEffect(() => {
    const t = getDecryptedItem("token");
    const r = getDecryptedItem("role");
    setToken(t);
    setRole(r);
  }, [pathname]);
  const { isDesktopMenuOpen, toggleDesktopMenu } = useSidebarContext();
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

      <div className={isLoggedIn ? "flex min-h-screen" : "min-h-screen"} style={{ height: "100vh" }}>

        {/* Only show sidebar for authenticated users on protected pages */}
        {isDesktopMenuOpen && isAuthenticated && !isPublicPage && <Sidebar />}

        <div className="w-full bg-gray-2 dark:bg-[#020d1a] h-full " >

          {/* Only show header for authenticated users on protected pages */}
          {/* {isAuthenticated && !isPublicPage && <Header />} */}

          <main className="bg-banner isolate mx-auto  w-full md:mt-0 h-full overflow-auto">
            {/* {showUserDashboard ? <UserCoursesDashboard /> : children} */}
            {!isDesktopMenuOpen && (
              <button
                onClick={toggleDesktopMenu}
                className="inline-flex h-10 w-10 flex-col items-center justify-center rounded-lg px-10 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open menu"
              >
                <span className="mb-1 h-0.5 w-4 bg-gray-700 dark:bg-gray-300"></span>
                <span className="mb-1 h-0.5 w-4 bg-gray-700 dark:bg-gray-300"></span>
                <span className="h-0.5 w-4 bg-gray-700 dark:bg-gray-300"></span>
              </button>
            )}
            {children}
          </main>
        </div>
      </div>

      <ToastProvider />
    </>
  );
}
