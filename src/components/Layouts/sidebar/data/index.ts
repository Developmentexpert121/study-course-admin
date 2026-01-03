import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/user/dashboard",
        icon: Icons.Dashboard,
        items: [],
        type: "user",
      },
      {
        title: "My Courses",
        url: "/user/courses",
        icon: Icons.BookOpen,
        items: [],
        type: "user",
      },
      // {
      //   title: "Learning Path",
      //   url: "/user/learning-path",
      //   icon: Icons.Target,
      //   items: [],
      //   type: "user",
      // },
      {
        title: "Wishlist",
        url: "/user/wishlist",
        icon: Icons.Heart,
        items: [],
        type: "user",
      },
      {
        title: "Certificates",
        url: "/user/certificates",
        icon: Icons.Certificate,
        items: [],
        type: "user",
      },

      {
        title: "Dashboard",
        icon: Icons.Dashboard,
        url: "/admin/dashboard",
        items: [],
        type: "admin",
      },
      {
        title: "COURSES",
        url: "/admin/courses",
        icon: Icons.Course,
        items: [],
        type: "admin",
      },
      {
        title: "COURSES ENANGEMENT",
        url: "/admin/enangement",
        icon: Icons.Calendar,
        items: [],
        type: "admin",
      },

      // Super Admin items (keep existing)
      {
        title: "Dashboard",
        url: "/super-admin/dashboard",
        icon: Icons.Dashboard,
        items: [],
        type: "Super-Admin",
      },
      {
        title: "Teacher",
        url: "/super-admin/admins-requests",
        icon: Icons.AdminUser,
        items: [],
        type: "Super-Admin",
      },

      {
        title: "Student",
        url: "/super-admin/all-user",
        icon: Icons.User,
        items: [],
        type: "Super-Admin",
      },

      



      {
        title: "Courses",
        url: "/super-admin/courses",
        icon: Icons.Course,
        items: [],
        type: "Super-Admin",
      },

      {
        title: "Activity Logs",
        url: "/super-admin/audit-logs",
        icon: Icons.ActivityLog,
        items: [],
        type: "Super-Admin",
      },
    

      {
        title: "Newsletter",
        url: "/super-admin/mails",
        icon: Icons.Newsletter,
        items: [],
        type: "Super-Admin",
      },

      
      {
        title: "Certificate",
        url: "/super-admin/certificate",
        icon: Icons.Certificate,
        items: [],
        type: "Super-Admin",
      },

      {
        title: "Certificate",
        url: "/admin/certificate",
        icon: Icons.Certificate,
        items: [],
        type: "admin",
      },

    ],
  },
];