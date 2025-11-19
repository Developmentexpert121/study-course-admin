// In sidebar-filter.ts
export function filterSidebarItems(navData: any[], role: string, permissions: string[]) {
    console.log("=== filterSidebarItems DEBUG ===");
    console.log("Input navData:", navData);

    const result = navData.map(section => {
        console.log(`Processing section: ${section.label}`, section);

        const filteredItems = section.items.filter((item: any) => {
            console.log(`Checking item: ${item.title}`, item);

            // Check role restrictions
            if (item.roles && item.roles.length > 0) {
                const hasRole = item.roles.includes(role);
                console.log(`Role check for ${item.title}: ${hasRole} (required: ${item.roles}, user: ${role})`);
                if (!hasRole) return false;
            }

            // Check permission restrictions
            if (item.permissions && item.permissions.length > 0) {
                const hasPermission = item.permissions.some((permission: string) =>
                    permissions.includes(permission)
                );
                console.log(`Permission check for ${item.title}: ${hasPermission} (required: ${item.permissions}, user: ${permissions})`);
                if (!hasPermission) return false;
            }

            console.log(`Item ${item.title} PASSED all checks`);
            return true;
        });

        console.log(`Section ${section.label} - filtered items:`, filteredItems);
        return {
            ...section,
            items: filteredItems
        };
    }).filter(section => section.items.length > 0);

    console.log("Final filtered result:", result);
    console.log("=== END DEBUG ===");

    return result;
}