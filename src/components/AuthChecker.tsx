'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Loader from './Loader';
import api from '@/lib/api';

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false); 
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setHydrated(true); 
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = async () => {
      const token = Cookies.get('token');
      const isAuthPage = pathname.startsWith('/auth');

      if (!token && !isAuthPage) {
        router.replace('/auth/login');
        return;
      }

      if (!token && isAuthPage) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('user/me');
        
        if (response.success) {
          // User is authenticated and authorized
          if (isAuthPage) {
            // Redirect from auth pages to appropriate dashboard
            const userRole = response.data.user.role;
            if (userRole === 'super-admin' || userRole === 'admin') {
              router.replace('/admin/dashboard');
            } else {
              router.replace('/dashboard');
            }
          } else {
            setLoading(false);
          }
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        
        if (!isAuthPage) {
          router.replace('/auth/login');
        } else {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [hydrated, pathname, router]);

  if (!hydrated || loading) {
    return <Loader />;
  }

  return <>{children}</>;
};