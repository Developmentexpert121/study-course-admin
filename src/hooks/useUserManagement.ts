// hooks/useUserManagement.ts - Simplified version
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { useApiClient } from "@/lib/api";
import {
    fetchUsers,
    setPage,
    setSearch,
    setAccountStatus, // CHANGED
    setRoleId,
} from "../store/slices/adminslice/all-user-details";

interface UseUserManagementProps {
    roleName: "Student" | "Teacher" | "Admin";
}

export const useUserManagement = ({ roleName }: UseUserManagementProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const api = useApiClient();

    // State - REMOVED verification status
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<any>(null);
    const [availableRoles, setAvailableRoles] = useState<any[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [processingUserId, setProcessingUserId] = useState<string | null>(null);
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [localAccountStatus, setLocalAccountStatus] = useState("all"); // ONLY ACCOUNT STATUS

    // Redux state
    const usersState = useAppSelector((state) => state.users);

    // Constants
    const limit = 5;
    const EXCLUDED_ROLES = ["Super-Admin", "Student", "Teacher"];

    // Memoized values
    const totalCount = usersState.totalUsers || 0;
    const activeCount = usersState.activeUsers || 0;
    const inactiveCount = totalCount - activeCount || 0;

    // Check if we have a valid role
    const hasValidRole = useMemo(() => {
        return roleName === "Admin" ? !!selectedRoleId : !!userRole;
    }, [roleName, selectedRoleId, userRole]);

    // Fetch roles (same as before)
    const fetchRoles = useCallback(async () => {
        try {
            const response = await api.get("roles");
            if (response.success) {
                if (roleName === "Admin") {
                    const filteredRoles = response.data.data
                        .filter((role: any) => !EXCLUDED_ROLES.includes(role.name))
                        .map((role: any) => ({
                            ...role,
                            id: role.id.toString(),
                        }));

                    setAvailableRoles(filteredRoles);

                    if (filteredRoles.length > 0) {
                        const defaultRoleId = selectedRoleId || filteredRoles[0].id;
                        setSelectedRoleId(defaultRoleId);
                        const defaultRole = filteredRoles.find((role: any) => role.id === defaultRoleId) || filteredRoles[0];
                        setUserRole(defaultRole);
                        dispatch(setRoleId(defaultRoleId));
                    }
                } else {
                    const role = response.data.data.find(
                        (role: any) => role.name === roleName
                    );
                    if (role) {
                        const roleWithStringId = {
                            ...role,
                            id: role.id.toString(),
                        };
                        setUserRole(roleWithStringId);
                        dispatch(setRoleId(roleWithStringId.id));
                        console.log(`🎯 Set role_id for ${roleName}:`, roleWithStringId.id);
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to fetch roles:`, error);
        }
    }, [api, roleName, selectedRoleId, dispatch]);

    // Role change handler
    const handleRoleChange = useCallback((roleId: string) => {
        if (!roleId) return;

        const selectedRole = availableRoles.find((role) => role.id == roleId);

        if (selectedRole) {
            setSelectedRoleId(roleId);
            setUserRole(selectedRole);
            dispatch(setRoleId(roleId));
            dispatch(setPage(1));
        }
    }, [availableRoles, dispatch]);

    // Search handlers - SIMPLIFIED
    const handleSearch = useCallback(() => {
        console.log('🔍 SEARCH - Applying filters:', {
            search: localSearchTerm,
            accountStatus: localAccountStatus
        });

        dispatch(setPage(1));
        dispatch(setSearch(localSearchTerm));
        dispatch(setAccountStatus(localAccountStatus)); // CHANGED
    }, [dispatch, localSearchTerm, localAccountStatus]);

    const handleClearSearch = useCallback(() => {
        setLocalSearchTerm("");
        setLocalAccountStatus("all");
        dispatch(setSearch(""));
        dispatch(setAccountStatus("all")); // CHANGED
        dispatch(setPage(1));
    }, [dispatch]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }, [handleSearch]);

    // Handle account status change
    const handleAccountStatusChange = useCallback((value: string) => {
        console.log('🔄 Account status changed to:', value);
        setLocalAccountStatus(value);

        if (hasValidRole) {
            setTimeout(() => {
                dispatch(setAccountStatus(value)); // CHANGED
                dispatch(setPage(1));
            }, 100);
        }
    }, [dispatch, hasValidRole]);

    // Handle search term change
    const handleSearchTermChange = useCallback((value: string) => {
        setLocalSearchTerm(value);
    }, []);

    // Refresh users
    const refreshUsers = useCallback(() => {
        if (hasValidRole) {
            dispatch(
                fetchUsers({
                    page: usersState.currentPage,
                    limit,
                    search: usersState.searchTerm,
                    accountStatus: usersState.accountStatus, // CHANGED
                    role_id: roleName === "Admin" ? selectedRoleId : userRole?.id,
                }),
            );
        }
    }, [dispatch, usersState.currentPage, usersState.searchTerm, usersState.accountStatus, roleName, selectedRoleId, userRole, hasValidRole]);

    // Effects
    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    // Sync local state with Redux state
    useEffect(() => {
        setLocalSearchTerm(usersState.searchTerm);
        setLocalAccountStatus(usersState.accountStatus); // CHANGED
    }, [usersState.searchTerm, usersState.accountStatus]);

    // Main effect - trigger API calls when filters change
    useEffect(() => {
        if (hasValidRole) {
            dispatch(
                fetchUsers({
                    page: usersState.currentPage,
                    limit,
                    search: usersState.searchTerm,
                    accountStatus: usersState.accountStatus, // CHANGED
                    role_id: roleName === "Admin" ? selectedRoleId : userRole?.id,
                }),
            );
            setIsInitialLoad(false);
        }
    }, [
        dispatch,
        usersState.currentPage,
        usersState.searchTerm,
        usersState.accountStatus, // CHANGED
        roleName,
        selectedRoleId,
        userRole,
        hasValidRole,
    ]);

    return {
        // State
        isCreateModalOpen,
        setIsCreateModalOpen,
        userRole,
        availableRoles,
        selectedRoleId,
        isInitialLoad,
        processingUserId,
        setProcessingUserId,
        localSearchTerm,
        setLocalSearchTerm: handleSearchTermChange,
        localAccountStatus,
        setLocalAccountStatus: handleAccountStatusChange,

        // Redux state
        usersState,

        // Memoized values
        totalCount,
        activeCount,
        inactiveCount,

        // Handlers
        handleRoleChange,
        handleSearch,
        handleClearSearch,
        handleKeyPress,
        refreshUsers,

        // Constants
        roleName,
        hasValidRole,
    };
};