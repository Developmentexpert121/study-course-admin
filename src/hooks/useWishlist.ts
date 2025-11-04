// hooks/useWishlist.ts
import { useState, useEffect, useCallback } from 'react';
import { useApiClient } from "@/lib/api";
import { getDecryptedItem } from "@/utils/storageHelper";

export interface WishlistItem {
    id: number;
    user_id: number;
    course_id: number;
    createdAt: string;
    updatedAt: string;
    course: {
        id: number;
        title: string;
        description: string;
        category: string;
        image: string;
        creator: string;
        creator_name?: string;
        price: string;
        price_type: string;
        duration: string;
        ratings: any; // Can be number or object with average_rating, total_ratings
        average_rating?: number;
        total_ratings?: number;
        enrollment_count: number;
        is_active: boolean;
        status: string;
        has_chapters: boolean;
        totalChapters?: number;
        totalLessons?: number;
        totalMCQs?: number;
        is_course_complete?: boolean;
        course_readiness?: {
            completion_percentage: number;
            readiness_level: string;
            missing_components: string[];
        };
    };
}

interface WishlistStats {
    total: number;
    available: number;
    comingSoon: number;
    freeCourses: number;
    categories: string[];
}

export const useWishlist = () => {
    const api = useApiClient();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const getUserId = (): string | null => {
        const UserId = getDecryptedItem("userId");
        return UserId ? String(UserId) : null;
    };

    // Add course to wishlist with optimistic update
    const addToWishlist = useCallback(async (course: any) => {
        const userId = getUserId();

        if (!userId) {
            const errorMsg = "User not authenticated";
            setError(errorMsg);
            return { success: false, message: errorMsg };
        }

        // Optimistic update
        const optimisticItem: WishlistItem = {
            id: Date.now(), // Temporary ID
            user_id: parseInt(userId),
            course_id: course.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            course: {
                id: course.id,
                title: course.title,
                description: course.description,
                category: course.category,
                image: course.image,
                creator: course.creator,
                creator_name: course.creator_name,
                price: course.price,
                price_type: course.price_type,
                duration: course.duration,
                ratings: course.ratings,
                average_rating: course.average_rating,
                total_ratings: course.total_ratings,
                enrollment_count: course.enrollment_count,
                is_active: course.is_active,
                status: course.status,
                has_chapters: course.has_chapters,
                totalChapters: course.totalChapters,
                totalLessons: course.totalLessons,
                totalMCQs: course.totalMCQs,
                is_course_complete: course.is_course_complete,
                course_readiness: course.course_readiness
            }
        };

        setWishlist(prev => [...prev, optimisticItem]);

        try {
            setLoading(true);
            const response = await api.post('wishlist/add', {
                user_id: userId,
                course_id: course.id
            });

            if (response.success) {
                // Refresh to get actual data from server
                await fetchWishlist();
                setLastUpdated(new Date());
                return { success: true, message: response.data.message };
            } else {
                // Rollback optimistic update
                setWishlist(prev => prev.filter(item => item.id !== optimisticItem.id));
                throw new Error(response.error?.message || "Failed to add to wishlist");
            }
        } catch (err) {
            // Rollback optimistic update
            setWishlist(prev => prev.filter(item => item.id !== optimisticItem.id));
            const errorMessage = err instanceof Error ? err.message : "Failed to add to wishlist";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Remove course from wishlist with optimistic update
    const removeFromWishlist = useCallback(async (courseId: number) => {
        // Optimistic update
        const itemToRemove = wishlist.find(item => item.course.id === courseId);
        setWishlist(prev => prev.filter(item => item.course.id !== courseId));

        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await api.post('wishlist/remove', {
                user_id: userId,
                course_id: courseId
            });

            if (response.success) {
                setLastUpdated(new Date());
                return { success: true, message: response.data.message };
            } else {
                // Rollback optimistic update
                if (itemToRemove) {
                    setWishlist(prev => [...prev, itemToRemove]);
                }
                throw new Error(response.error?.message || "Failed to remove from wishlist");
            }
        } catch (err) {
            // Rollback optimistic update
            if (itemToRemove) {
                setWishlist(prev => [...prev, itemToRemove]);
            }
            const errorMessage = err instanceof Error ? err.message : "Failed to remove from wishlist";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [api, wishlist]);

    // Toggle wishlist status
    const toggleWishlist = useCallback(async (course: any, isCurrentlyInWishlist: boolean) => {
        if (isCurrentlyInWishlist) {
            return await removeFromWishlist(course.id);
        } else {
            return await addToWishlist(course);
        }
    }, [addToWishlist, removeFromWishlist]);

    // Check if course is in wishlist (client-side)
    const isInWishlist = useCallback((courseId: number): boolean => {
        return wishlist.some(item => item.course.id === courseId);
    }, [wishlist]);

    // Check wishlist status from server
    const checkWishlistStatus = useCallback(async (courseId: number) => {
        try {
            const userId = getUserId();

            if (!userId) {
                return false;
            }

            const url = `wishlist/check?user_id=${userId}&course_id=${courseId}`;
            const response = await api.get(url);

            if (response.success) {
                return response.data.data.in_wishlist;
            }
            return false;
        } catch (err) {
            console.error("Error checking wishlist status:", err);
            return false;
        }
    }, [api]);

    // Fetch user's wishlist
    const fetchWishlist = useCallback(async (forceRefresh: boolean = false) => {
        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                setWishlist([]);
                return;
            }

            // Add cache busting if force refresh
            const url = forceRefresh
                ? `wishlist/user/${userId}?t=${Date.now()}`
                : `wishlist/user/${userId}`;

            const response = await api.get(url);

            if (response.success) {
                setWishlist(response.data.data.wishlist || []);
                setLastUpdated(new Date());
                setError(null);
            } else {
                throw new Error(response.error?.message || "Failed to fetch wishlist");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch wishlist";
            setError(errorMessage);
            // Don't clear wishlist on error to maintain optimistic UI
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Get wishlist count
    const getWishlistCount = useCallback(async (): Promise<number> => {
        try {
            const userId = getUserId();

            if (!userId) {
                return 0;
            }

            const response = await api.get(`wishlist/count/${userId}`);

            if (response.success) {
                return response.data.data.wishlist_count;
            }
            return wishlist.length; // Fallback to client-side count
        } catch (err) {
            console.error("Error getting wishlist count:", err);
            return wishlist.length; // Fallback to client-side count
        }
    }, [api, wishlist.length]);

    // Get wishlist statistics
    const getWishlistStats = useCallback((): WishlistStats => {
        const available = wishlist.filter(item => item.course.status === 'active').length;
        const comingSoon = wishlist.filter(item => item.course.status === 'inactive').length;
        const freeCourses = wishlist.filter(item => item.course.price_type === 'free').length;
        const categories = [...new Set(wishlist.map(item => item.course.category).filter(Boolean))];

        return {
            total: wishlist.length,
            available,
            comingSoon,
            freeCourses,
            categories: categories as string[]
        };
    }, [wishlist]);

    // Clear error
    const clearError = useCallback(() => setError(null), []);

    // Clear entire wishlist
    const clearWishlist = useCallback(async () => {
        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await api.post('wishlist/clear', {
                user_id: userId
            });

            if (response.success) {
                setWishlist([]);
                setLastUpdated(new Date());
                return { success: true, message: response.data.message };
            } else {
                throw new Error(response.error?.message || "Failed to clear wishlist");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to clear wishlist";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Move item position in wishlist
    const moveWishlistItem = useCallback(async (courseId: number, newPosition: number) => {
        try {
            const userId = getUserId();

            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await api.post('wishlist/reorder', {
                user_id: userId,
                course_id: courseId,
                position: newPosition
            });

            if (response.success) {
                await fetchWishlist(true); // Force refresh
                return { success: true, message: response.data.message };
            } else {
                throw new Error(response.error?.message || "Failed to reorder wishlist");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to reorder wishlist";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    }, [api, fetchWishlist]);

    // Export wishlist data
    const exportWishlist = useCallback(() => {
        const data = {
            exportedAt: new Date().toISOString(),
            totalItems: wishlist.length,
            items: wishlist.map(item => ({
                title: item.course.title,
                category: item.course.category,
                price: item.course.price_type === 'free' ? 'Free' : `$${item.course.price}`,
                status: item.course.status,
                addedOn: item.createdAt,
                courseUrl: `/user/courses/CourseEnrollment/${item.course.id}`
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wishlist-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [wishlist]);

    // Auto-fetch wishlist on component mount
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    return {
        wishlist,
        loading,
        error,
        lastUpdated,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        checkWishlistStatus,
        fetchWishlist,
        getWishlistCount,
        getWishlistStats,
        clearError,
        clearWishlist,
        moveWishlistItem,
        exportWishlist
    };
};