// In sidebar-filter.ts
export function filterSidebarItems(navData: any[], role: string, permissions: string[]) {

    const result = navData.map(section => {

        const filteredItems = section.items.filter((item: any) => {

            // Check role restrictions
            if (item.roles && item.roles.length > 0) {
                const hasRole = item.roles.includes(role);
                if (!hasRole) return false;
            }

            // Check permission restrictions
            if (item.permissions && item.permissions.length > 0) {
                const hasPermission = item.permissions.some((permission: string) =>
                    permissions.includes(permission)
                );
                if (!hasPermission) return false;
            }

            return true;
        });

        return {
            ...section,
            items: filteredItems
        };
    }).filter(section => section.items.length > 0);



    return result;
}