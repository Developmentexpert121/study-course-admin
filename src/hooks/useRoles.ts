// hooks/useRoles.ts
import { useState, useEffect } from 'react';
import { useApiClient } from '@/lib/api';

export const useRoles = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const api = useApiClient();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get('roles');

                console.log(response)
                if (response.success) {
                    setRoles(response.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return { roles, loading };
};