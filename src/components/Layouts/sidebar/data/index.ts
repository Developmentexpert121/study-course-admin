import * as Icons from "../icons";

export const getDynamicNavData = (roles: any) => {
  const rolesArray = Array.isArray(roles) ? roles : [];


  const baseNavItems = [
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

    // Super Admin permissions
    {
      title: "Dashboard",
      url: "/super-admin/dashboard",
      icon: Icons.HomeIcon,
      items: [],
      type: "Super-Admin",
      permissions: ["dashboard"],
      roles: ["Super-Admin"]
    },
    {
      title: "Manage Roles",
      url: "/super-admin/manage-roles",
      icon: Icons.HomeIcon,
      items: [],
      type: "Super-Admin",
      permissions: ["manageRoles"],
      roles: ["Super-Admin"]
    },
    {
      title: "Admins",
      url: "/super-admin/admins",
      icon: Icons.User,
      items: [],
      type: "Super-Admin",
      permissions: ["teacher"],
      roles: ["Super-Admin"]
    },
    {
      title: "Teachers",
      url: "/super-admin/teachers",
      icon: Icons.User,
      items: [],
      type: "Super-Admin",
      permissions: ["teacher"],
      roles: ["Super-Admin"]
    },
    {
      title: "Students",
      url: "/super-admin/students",
      icon: Icons.User,
      items: [],
      type: "Super-Admin",
      permissions: ["student"],
      roles: ["Super-Admin"]
    },
    {
      title: "Courses",
      url: "/super-admin/courses",
      icon: Icons.Calendar,
      items: [],
      type: "Super-Admin",
      permissions: ["courses"],
      roles: ["Super-Admin"]
    },
    {
      title: "Activity Logs",
      url: "/super-admin/audit-logs",
      icon: Icons.Calendar,
      items: [],
      type: "Super-Admin",
      permissions: ["activitylogs"],
      roles: ["Super-Admin"]
    },
    {
      title: "Newsletter",
      url: "/super-admin/mails",
      icon: Icons.Calendar,
      items: [],
      type: "Super-Admin",
      permissions: ["newsletter"],
      roles: ["Super-Admin"]
    },
  ];

  const dynamicRoleItems = rolesArray
    .filter((role: any) => {
      if (!role || !role.name) return false;
      return !['Student', 'Teacher', 'Super-Admin'].includes(role.name);
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


  return [
    {
      label: "MAIN MENU",
      items: [...baseNavItems, ...dynamicRoleItems]
    }
  ];
};

export const NAV_DATA = getDynamicNavData([]);