import * as Icons from "../icons";

export const getDynamicNavData = (roles: any, userPermissions: any[] = [], currentRole?: string) => {
  const rolesArray = Array.isArray(roles) ? roles : [];

  const coreRoles = ['Student', 'Teacher', 'Super-Admin', 'HR'];

  // If current role is not a core role, use Super-Admin navigation
  const effectiveRole = currentRole && !coreRoles.includes(currentRole) ? 'Super-Admin' : currentRole;



  const baseNavItems = [
    // Student permissions
    {
      title: "Dashboard",
      url: "/user/dashboard",
      icon: Icons.HomeIcon,
      items: [],
      type: "Student",
      permissions: ["dashboard"],
      roles: ["Student"]
    },
    {
      title: "My Courses",
      url: "/user/courses",
      icon: Icons.BookOpen,
      items: [],
      type: "Student",
      permissions: ["courses"],
      roles: ["Student"]
    },
    {
      title: "Wishlist",
      url: "/user/wishlist",
      icon: Icons.Heart,
      items: [],
      type: "Student",
      permissions: ["wishlist"],
      roles: ["Student"]
    },
    {
      title: "Certificates",
      url: "/user/certificates",
      icon: Icons.Award,
      items: [],
      type: "Student",
      permissions: ["certificates"],
      roles: ["Student"]
    },

    // Teacher permissions
    {
      title: "Dashboard",
      icon: Icons.HomeIcon,
      url: "/admin/dashboard",
      items: [],
      type: "Admin",
      permissions: ["dashboard"],
      roles: ["Teacher"]
    },
    {
      title: "COURSES",
      url: "/admin/courses",
      icon: Icons.Calendar,
      items: [],
      type: "Admin",
      permissions: ["courses"],
      roles: ["Teacher"]
    },
    {
      title: "COURSES ENGAGEMENT",
      url: "/admin/engagement",
      icon: Icons.Calendar,
      items: [],
      type: "Admin",
      permissions: ["engagement"],
      roles: ["Teacher"]
    },

    // Super Admin permissions - Also used for HR and other non-core roles
    {
      title: "Dashboard",
      url: "/platform-manager/dashboard",
      icon: Icons.HomeIcon,
      items: [],
      type: "Super-Admin",
      permissions: ["dashboard"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Manage Roles",
      url: "/platform-manager/manage-roles",
      icon: Icons.HomeIcon,
      items: [],
      type: "Super-Admin",
      permissions: ["manageRoles"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Certificates",
      url: "/platform-manager/certificates",
      icon: Icons.Award,
      items: [],
      type: "Super-Admin",
      permissions: ["certificates"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Admins",
      url: "/platform-manager/admins",
      icon: Icons.User,
      items: [],
      type: "Super-Admin",
      permissions: ["Teacher"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Teachers",
      url: "/platform-manager/teachers",
      icon: Icons.User,
      items: [],
      type: "Super-Admin",
      permissions: ["Teacher"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Students",
      url: "/platform-manager/students",
      icon: Icons.User,
      items: [],
      type: "Super-Admin",
      permissions: ["Student"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Courses",
      url: "/platform-manager/courses",
      icon: Icons.Calendar,
      items: [],
      type: "Super-Admin",
      permissions: ["courses"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Activity Logs",
      url: "/platform-manager/audit-logs",
      icon: Icons.Calendar,
      items: [],
      type: "Super-Admin",
      permissions: ["activitylogs"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
    {
      title: "Newsletter",
      url: "/platform-manager/mails",
      icon: Icons.Calendar,
      items: [],
      type: "Super-Admin",
      permissions: ["newsletter"],
      roles: ["Super-Admin", "HR", "Management Role"]
    },
  ];

  const filteredNavItems = baseNavItems.filter(item => {
    const roleMatch = effectiveRole ?
      item.roles.includes(effectiveRole) :
      false;


    const permissionMatch = item.permissions.length === 0 ||
      item.permissions.some(permission =>
        userPermissions.includes(permission)
      );



    return roleMatch && permissionMatch;
  });

  const dynamicRoleItems = rolesArray
    .filter((role: any) => {
      if (!role || !role.name) return false;
      return !['Student', 'Teacher', 'Super-Admin', 'HR', 'Management Role'].includes(role.name);
    })
    .map((role: any) => {
      const menuItems = [];

      if (role.permissions && role.permissions.dashboard) {
        menuItems.push({
          title: "Dashboard",
          url: `/${role.name.toLowerCase()}/dashboard`,
          icon: Icons.HomeIcon,
          items: [],
          type: role.name,
          permissions: ["dashboard"],
          roles: [role.name]
        });
      }

      if (role.permissions && role.permissions.users) {
        menuItems.push({
          title: "Users",
          url: `/${role.name.toLowerCase()}/users`,
          icon: Icons.User,
          items: [],
          type: role.name,
          permissions: ["users"],
          roles: [role.name]
        });
      }

      if (role.permissions && role.permissions.courses) {
        menuItems.push({
          title: "Courses",
          url: `/${role.name.toLowerCase()}/courses`,
          icon: Icons.Calendar,
          items: [],
          type: role.name,
          permissions: ["courses"],
          roles: [role.name]
        });
      }

      if (role.permissions && role.permissions.newsletter) {
        menuItems.push({
          title: "Newsletter",
          url: `/${role.name.toLowerCase()}/newsletter`,
          icon: Icons.Calendar,
          items: [],
          type: role.name,
          permissions: ["newsletter"],
          roles: [role.name]
        });
      }

      if (role.permissions && role.permissions.activitylogs) {
        menuItems.push({
          title: "Activity Logs",
          url: `/${role.name.toLowerCase()}/activity-logs`,
          icon: Icons.Calendar,
          items: [],
          type: role.name,
          permissions: ["activitylogs"],
          roles: [role.name]
        });
      }

      return menuItems;
    }).flat();

  const finalNavItems = [
    {
      label: "MAIN MENU",
      items: [...filteredNavItems, ...dynamicRoleItems]
    }
  ];

  return finalNavItems;
};

// Export a function that properly handles user data
export const getNavigationData = (user: any, allRoles: any[] = []) => {
  if (!user) {
    return [{
      label: "MAIN MENU",
      items: []
    }];
  }

  return getDynamicNavData(
    allRoles,
    user.permissions || [],
    user.role
  );
};

// Initialize with empty array for initial render
export const INITIAL_NAV_DATA = [{
  label: "MAIN MENU",
  items: []
}];