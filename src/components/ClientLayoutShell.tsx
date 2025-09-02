'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import Cookies from 'js-cookie';

import { Sidebar } from '@/components/Layouts/sidebar';
import { Header } from '@/components/Layouts/header';
import ToastProvider from '@/components/core/ToasterProvider';
import UserCoursesDashboard from '@/components/UserCoursesDashboard'; // We'll create this component

import type { PropsWithChildren } from 'react';

export default function ClientLayoutShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [token, setToken] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    const t = Cookies.get('token');
    const r = Cookies.get('role');
    setToken(t);
    setRole(r);
  }, []);

  if (!token && !isAuthPage) return null;

  const isAdmin = role === 'admin';
  const isUser = role === 'user';
  const isAuthenticated = !isAuthPage && (isAdmin || isUser);

  // For admin: always show actual content
  // For user: show courses dashboard only on dashboard, show actual content for other pages
  const showUserDashboard = isUser && (pathname === '/' || pathname === '/user-dashboard');

  return (
    <>
      {!isAuthPage && <NextTopLoader color="#5750F1" showSpinner={false} />}

      <div className="flex min-h-screen">
        {isAuthenticated && <Sidebar />}

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          {isAuthenticated && <Header />}

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {showUserDashboard ? (
              <UserCoursesDashboard />
            ) : (
              // Show actual page content for:
              // - Admin on all pages
              // - User on non-dashboard pages (like Profile)
              children
            )}
          </main>
        </div>
      </div>

      <ToastProvider />
    </>
  );
}