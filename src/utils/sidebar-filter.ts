export const filterSidebarItems = (navData: any[], userRole: string, userPermissions: string[]) => {
    return navData.map((section: any) => ({
        ...section,
        items: section.items.filter((item: any) => {
            const hasRole = !item.roles || item.roles.includes(userRole);

            const hasPermissions = !item.permissions ||
                item.permissions.some((permission: string) =>
                    userPermissions.includes(permission)
                );

            return hasRole && hasPermissions;
        })
    })).filter((section: any) => section.items.length > 0);
};