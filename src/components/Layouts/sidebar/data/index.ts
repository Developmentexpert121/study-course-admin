import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/user/dashboard",
        icon: Icons.HomeIcon,
        items: [],
        type: "user",
      },
      {
        title: "My Courses",
        url: "/user-panel/courses",
        icon: Icons.BookOpen,
        items: [],
        type: "user",
      },
      // {
      //   title: "Learning Path",
      //   url: "/user-panel/learning-path",
      //   icon: Icons.Target,
      //   items: [],
      //   type: "user",
      // },
      {
        title: "Wishlist",
        url: "/user-panel/wishlist",
        icon: Icons.Heart,
        items: [],
        type: "user",
      },
      {
        title: "Certificates",
        url: "/user-panel/certificates",
        icon: Icons.Award,
        items: [],
        type: "user",
      },

      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/admin/dashboard",
        items: [],
        type: "admin",
      },
      {
        title: "COURSES",
        url: "/admin/courses",
        icon: Icons.Calendar,
        items: [],
        type: "admin",
      },

      {
        title: "USER DETAILS",
        icon: Icons.Alphabet,
        items: [
          {
            title: "User List",
            url: "/users",
          },
        ],
        type: "admin",
      },

      // Super Admin items (keep existing)
      {
        title: "Dashboard",
        url: "/super-admin/dashboard",
        icon: Icons.HomeIcon,
        items: [],
        type: "Super-Admin",
      },
      {
        title: "Admins",
        url: "/super-admin/admins-requests",
        icon: Icons.User,
        items: [],
        type: "Super-Admin",
      },

      {
        title: "User",
        url: "/super-admin/all-user",
        icon: Icons.User,
        items: [],
        type: "Super-Admin",
      },

      // Common items for all users
      {
        title: "Profile",
        url: "/view-profile",
        icon: Icons.User,
        items: [],
        type: "both",
      },




      {
        title: "Courses",
        url: "/super-admin/courses",
        icon: Icons.Calendar,
        items: [],
        type: "Super-Admin",
      },

      {
        title: "Courses Log",
        url: "/super-admin/courses-creation",
        icon: Icons.Calendar,
        items: [],
        type: "Super-Admin",
      },
      {
        title: "Rating",
        url: "/super-admin/rating",
        icon: Icons.Calendar,
        items: [],
        type: "Super-Admin",
      },

      {
        title: "Mails",
        url: "/super-admin/mails",
        icon: Icons.Calendar,
        items: [],
        type: "Super-Admin",
      },

      {
        title: "Rating",
        url: "/admin/rating",
        icon: Icons.Calendar,
        items: [],
        type: "admin",
      },

    ],
  },
];