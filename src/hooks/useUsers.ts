// hooks/useUsers.ts
'use client';

import { useApiClient } from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';

export function useUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const api = useApiClient();

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get("user");

            if (res.success) {
                setUsers(res?.data?.data?.users || []);
            } else {
                setError(res.error?.message || "Failed to fetch users");
            }
        } catch (err) {
            setError("Network error occurred");
        } finally {
            setLoading(false);
        }
    }, [api]);

    const refetch = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, error, refetch };
}