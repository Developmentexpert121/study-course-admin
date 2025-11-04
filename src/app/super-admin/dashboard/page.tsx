"use client";

import { version } from "os";

// import React, { useEffect } from "react";
// import {
//   Book,
//   User,
//   Users,
//   BarChart3,
//   CheckCircle,
//   XCircle,
//   Clock,
//   FileText,
//   RefreshCw,
//   Eye,
//   Mail,
//   Star,
// } from "lucide-react";
// import { useAppDispatch, useAppSelector } from "@/store";
// import {
//   fetchDashboardStats,
//   selectDashboardStats,
//   selectDashboardStatsLoading,
//   selectDashboardStatsError,
//   selectTotalUsers,
//   selectTotalAdmins,
//   selectTotalCourses,
//   selectActiveCourses,
//   selectTotalChapters,
//   selectVerifiedUsers,
//   selectUnverifiedUsers,
//   selectApprovedAdmins,
//   selectRejectedAdmins,
//   selectPendingAdmins,
//   selectDraftCourses,
//   clearError,
// } from "@/store/slices/adminslice/dashboardStatsSlice";
// import { useRouter } from "next/navigation";

// export default function DashboardStatsPage() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   // Redux selectors
//   const stats = useAppSelector(selectDashboardStats);
//   const loading = useAppSelector(selectDashboardStatsLoading);
//   const error = useAppSelector(selectDashboardStatsError);

//   // Summary stats
//   const totalUsers = useAppSelector(selectTotalUsers);
//   const totalAdmins = useAppSelector(selectTotalAdmins);
//   const totalCourses = useAppSelector(selectTotalCourses);
//   const activeCourses = useAppSelector(selectActiveCourses);
//   const totalChapters = useAppSelector(selectTotalChapters);
//   // Detailed stats
//   const verifiedUsers = useAppSelector(selectVerifiedUsers);
//   const unverifiedUsers = useAppSelector(selectUnverifiedUsers);
//   const approvedAdmins = useAppSelector(selectApprovedAdmins);
//   const rejectedAdmins = useAppSelector(selectRejectedAdmins);
//   const pendingAdmins = useAppSelector(selectPendingAdmins);
//   const draftCourses = useAppSelector(selectDraftCourses);

//   console.log("object", stats?.data);
//   useEffect(() => {
//     dispatch(fetchDashboardStats());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         dispatch(clearError());
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRefresh = () => {
//     dispatch(fetchDashboardStats());
//   };

//   // Loading state
//   if (loading && !stats) {
//     return (
//       <div className="flex min-h-screen items-center justify-center p-6">
//         <div className="text-center">
//           <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
//           <p className="font-medium text-gray-600 dark:text-gray-300">
//             Loading dashboard statistics...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center p-6">
//         <div className="w-full max-w-md">
//           <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center dark:border-red-500/50 dark:bg-red-900/20">
//             <BarChart3 className="mx-auto mb-3 h-12 w-12 text-red-500" />
//             <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-400">
//               Error Loading Statistics
//             </h3>
//             <p className="mb-4 text-red-700 dark:text-red-300">{error}</p>
//             <button
//               onClick={handleRefresh}
//               className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
//             >
//               <RefreshCw className="mr-2 h-4 w-4" />
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
//                 <BarChart3 className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#3e8f5c]" />
//                 Dashboard Overview
//               </h1>
//               <p className="mt-2 text-gray-600 dark:text-white">
//                 Comprehensive statistics and insights about your platform
//               </p>
//             </div>
//             <button
//               onClick={handleRefresh}
//               disabled={loading}
//               className="mt-4 inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:bg-blue-400 dark:bg-[#43bf79] sm:mt-0"
//             >
//               <RefreshCw
//                 className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
//               />
//               {loading ? "Refreshing..." : "Refresh Stats"}
//             </button>
//           </div>
//         </div>

//         {/* Summary Statistics Grid */}
//         <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {/* Card Component */}
//           {[
//             {
//               title: "Total Users",
//               value: stats?.data?.summary?.totalUsers,
//               icon: (
//                 <Users className="h-6 w-6 text-[#02517b] dark:text-[#43bf79]" />
//               ),
//               bg: "bg-[#02517b]/10 dark:bg-[#43bf79]/10",
//               sub: `${stats?.data?.users?.adminStatus?.approved} admins`,
//             },
//             {
//               title: "Total Courses",
//               value: stats?.data?.summary?.totalCourses,
//               icon: (
//                 <Book className="h-6 w-6 text-[#43bf79] dark:text-[#43bf79]" />
//               ),
//               bg: "bg-[#43bf79]/10 dark:bg-[#02517b]/10",
//               sub: `${stats?.data?.summary?.activeCourses} active`,
//             },
//             {
//               title: "Total Chapters",
//               value: stats?.data?.summary?.totalChapters,
//               icon: (
//                 <FileText className="h-6 w-6 text-[#02517b] dark:text-[#43bf79]" />
//               ),
//               bg: "bg-[#02517b]/10 dark:bg-[#43bf79]/10",
//               sub: "Across all courses",
//             },
//             {
//               title: "Verified Users",
//               value: stats?.data?.users?.userVerification?.verified,
//               icon: (
//                 <CheckCircle className="h-6 w-6 text-[#43bf79] dark:text-[#43bf79]" />
//               ),
//               bg: "bg-[#43bf79]/10 dark:bg-[#02517b]/10",
//               sub: `${stats?.data?.users?.userVerification?.unverified} pending`,
//             },
//           ].map((card, i) => (
//             <div
//               key={i}
//               className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-900"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//                     {card.title}
//                   </p>
//                   <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
//                     {card.value}
//                   </p>
//                   <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
//                     <span className="text-sm">{card.sub}</span>
//                   </div>
//                 </div>
//                 <div
//                   className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bg}`}
//                 >
//                   {card.icon}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Detailed Statistics Grid */}
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//           {/* User Statistics */}
//           <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
//             <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
//               <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//                 <Users className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
//                 User Statistics
//               </h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-4">
//                 {/* User Roles */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-500/10">
//                     <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                       {stats?.data?.summary?.totalAdmins || 0}
//                     </p>
//                     <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-white">
//                       Admin Users
//                     </p>
//                   </div>
//                   <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-500/10">
//                     <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                       {stats?.data?.users?.byRole?.user || 0}
//                     </p>
//                     <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-white">
//                       Regular Users
//                     </p>
//                   </div>
//                 </div>

//                 {/* User Verification */}
//                 <div>
//                   <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
//                     User Verification Status
//                   </h3>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
//                       <div className="flex items-center">
//                         <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
//                         <span className="text-sm text-gray-600 dark:text-white">
//                           Verified
//                         </span>
//                       </div>
//                       <span className="font-semibold text-green-600 dark:text-green-400">
//                         {stats?.data?.users?.userVerification?.verified || 0}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-500/10">
//                       <div className="flex items-center">
//                         <Clock className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                         <span className="text-sm text-gray-600 dark:text-white">
//                           Unverified
//                         </span>
//                       </div>
//                       <span className="font-semibold text-yellow-600 dark:text-yellow-400">
//                         {stats?.data?.users?.userVerification?.unverified || 0}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Admin Status */}
//                 <div>
//                   <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-white">
//                     Admin Status
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
//                       <div className="flex items-center">
//                         <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
//                         <span className="text-sm text-gray-600 dark:text-white">
//                           Approved
//                         </span>
//                       </div>
//                       <span className="font-semibold text-green-600 dark:text-green-400">
//                         {stats?.data?.users?.adminStatus?.approved || 0}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 dark:bg-red-500/10">
//                       <div className="flex items-center">
//                         <XCircle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
//                         <span className="text-sm text-gray-600 dark:text-white">
//                           Rejected
//                         </span>
//                       </div>
//                       <span className="font-semibold text-red-600 dark:text-red-400">
//                         {stats?.data?.users?.adminStatus?.rejected || 0}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-500/10">
//                       <div className="flex items-center">
//                         <Clock className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                         <span className="text-sm text-gray-600 dark:text-white">
//                           Pending
//                         </span>
//                       </div>
//                       <span className="font-semibold text-yellow-600 dark:text-yellow-400">
//                         {stats?.data?.users?.adminStatus?.pending || 0}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Course & Chapter Statistics */}
//           <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
//             <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
//               <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//                 <Book className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
//                 Course & Chapter Statistics
//               </h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-6">
//                 {/* Course Status */}
//                 <div>
//                   <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-white">
//                     Course Status
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
//                       <div className="flex items-center">
//                         <CheckCircle className="mr-3 h-5 w-5 text-green-600 dark:text-green-400" />
//                         <div>
//                           <p className="font-semibold text-green-600 dark:text-green-400">
//                             Active Courses
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-white">
//                             Published and available
//                           </p>
//                         </div>
//                       </div>
//                       <span className="text-2xl font-bold text-green-600 dark:text-green-400">
//                         {stats?.data?.courses?.active || 0}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between rounded-lg bg-red-50 p-4 dark:bg-red-500/10">
//                       <div className="flex items-center">
//                         <XCircle className="mr-3 h-5 w-5 text-red-600 dark:text-red-400" />
//                         <div>
//                           <p className="font-semibold text-red-600 dark:text-red-400">
//                             Inactive Courses
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-white">
//                             Not available to users
//                           </p>
//                         </div>
//                       </div>
//                       <span className="text-2xl font-bold text-red-600 dark:text-red-400">
//                         {stats?.data?.courses?.inactive || 0}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
//                       <div className="flex items-center">
//                         <FileText className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" />
//                         <div>
//                           <p className="font-semibold text-blue-600 dark:text-blue-400">
//                             Draft Courses
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-white">
//                             In progress
//                           </p>
//                         </div>
//                       </div>
//                       <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                         {stats?.data?.courses?.draft || 0}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Chapter Statistics */}
//                 <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-500/10">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <FileText className="mr-3 h-8 w-8 text-purple-600 dark:text-purple-400" />
//                       <div>
//                         <p className="font-semibold text-purple-600 dark:text-purple-400">
//                           Total Chapters
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-white">
//                           Across all courses
//                         </p>
//                       </div>
//                     </div>
//                     <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
//                       {stats?.data?.courses?.total || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
//           <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
//             Quick Actions
//           </h3>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <button
//               onClick={() => router.push("/super-admin/all-user")}
//               className="flex items-center justify-center rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20"
//             >
//               <Users className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
//               <span className="font-medium text-blue-600 dark:text-blue-400">
//                 Manage Users
//               </span>
//             </button>
//             <button
//               onClick={() => router.push("/super-admin/courses")}
//               className="flex items-center justify-center rounded-lg bg-green-50 p-4 transition-colors hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20"
//             >
//               <Book className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
//               <span className="font-medium text-green-600 dark:text-green-400">
//                 View Courses
//               </span>
//             </button>
//             <button
//               onClick={() => router.push("/super-admin/rating")}
//               className="flex items-center justify-center rounded-lg bg-purple-50 p-4 transition-colors hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20"
//             >
//               <Star className="mr-2 h-5 w-5 text-orange-600 dark:text-orange-400" />
//               <span className="font-medium text-purple-600 dark:text-purple-400">
//                 Manage Rating
//               </span>
//             </button>
//             <button
//               onClick={() => router.push("/super-admin/mails")}
//               className="flex items-center justify-center rounded-lg bg-orange-50 p-4 transition-colors hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20"
//             >
//               <Mail className="mr-2 h-5 w-5 text-orange-600 dark:text-orange-400" />
//               <span className="font-medium text-orange-600 dark:text-orange-400">
//                 Mails
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// new version



// "use client";

// import React, { useEffect } from "react";
// import {
//   Book,
//   User,
//   Users,
//   BarChart3,
//   CheckCircle,
//   XCircle,
//   Clock,
//   FileText,
//   RefreshCw,
//   Eye,
//   Mail,
//   Star,
//   TrendingUp,
//   Activity,
// } from "lucide-react";
// import { useAppDispatch, useAppSelector } from "@/store";
// import {
//   fetchDashboardStats,
//   selectDashboardStats,
//   selectDashboardStatsLoading,
//   selectDashboardStatsError,
//   clearError,
// } from "@/store/slices/adminslice/dashboardStatsSlice";
// import { useRouter } from "next/navigation";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   Area,
//   AreaChart,
// } from "recharts";

// export default function DashboardStatsPage() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
  
//   // Redux selectors
//   const stats = useAppSelector(selectDashboardStats);
//   const loading = useAppSelector(selectDashboardStatsLoading);
//   const error = useAppSelector(selectDashboardStatsError);

//   console.log("Dashboard Stats Data:", stats?.data);

//   useEffect(() => {
//     dispatch(fetchDashboardStats());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         dispatch(clearError());
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRefresh = () => {
//     dispatch(fetchDashboardStats());
//   };

//   // Prepare chart data from API
//   const userVerificationData = [
//     {
//       name: "Verified",
//       value: stats?.data?.users?.userVerification?.verified || 0,
//       color: "#10b981",
//     },
//     {
//       name: "Unverified",
//       value: stats?.data?.users?.userVerification?.unverified || 0,
//       color: "#f59e0b",
//     },
//   ];

//   const adminStatusData = [
//     {
//       name: "Approved",
//       value: stats?.data?.users?.adminStatus?.approved || 0,
//       fill: "#10b981",
//     },
//     {
//       name: "Pending",
//       value: stats?.data?.users?.adminStatus?.pending || 0,
//       fill: "#f59e0b",
//     },
//     {
//       name: "Rejected",
//       value: stats?.data?.users?.adminStatus?.rejected || 0,
//       fill: "#ef4444",
//     },
//   ];

//   const courseStatusData = [
//     {
//       name: "Active",
//       value: stats?.data?.courses?.active || 0,
//       fill: "#10b981",
//     },
//     {
//       name: "Inactive",
//       value: stats?.data?.courses?.inactive || 0,
//       fill: "#ef4444",
//     },
//     {
//       name: "Draft",
//       value: stats?.data?.courses?.draft || 0,
//       fill: "#3b82f6",
//     },
//   ];

//   const userRoleData = [
//     {
//       name: "Admins",
//       count: stats?.data?.summary?.totalAdmins || 0,
//     },
//     {
//       name: "Users",
//       count: stats?.data?.users?.byRole?.user || 0,
//     },
//   ];

//   // Calculate growth percentages (you can modify these based on your historical data)
//   const calculateTrend = (current, previous = 0) => {
//     if (!previous) return "+0%";
//     const growth = ((current - previous) / previous) * 100;
//     return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
//   };

//   // Loading state
//   if (loading && !stats) {
//     return (
//       <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//         <div className="text-center">
//           <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600"></div>
//           <p className="font-medium text-gray-600 dark:text-gray-300">
//             Loading dashboard statistics...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
//         <div className="w-full max-w-md">
//           <div className="rounded-2xl border-2 border-red-200 bg-white/80 backdrop-blur-sm p-8 text-center shadow-2xl dark:border-red-500/50 dark:bg-gray-800/80">
//             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
//               <BarChart3 className="h-8 w-8 text-red-500" />
//             </div>
//             <h3 className="mb-2 text-xl font-bold text-red-800 dark:text-red-400">
//               Error Loading Statistics
//             </h3>
//             <p className="mb-6 text-red-700 dark:text-red-300">{error}</p>
//             <button
//               onClick={handleRefresh}
//               className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
//             >
//               <RefreshCw className="mr-2 h-5 w-5" />
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       <div className="mx-auto max-w-7xl">
//         {/* Header with Gradient */}
//         <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#02517b] to-[#43bf79] p-8 shadow-2xl">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="flex items-center text-3xl font-bold text-white">
//                 <BarChart3 className="mr-3 h-10 w-10" />
//                 Dashboard Overview
//               </h1>
//               <p className="mt-2 text-blue-100">
//                 Comprehensive statistics and insights about your platform
//               </p>
//             </div>
//             <button 
//               onClick={handleRefresh}
//               disabled={loading}
//               className="mt-4 inline-flex items-center rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 text-white shadow-lg transition-all hover:bg-white/30 hover:scale-105 disabled:opacity-50 sm:mt-0"
//             >
//               <RefreshCw className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
//               {loading ? "Refreshing..." : "Refresh Stats"}
//             </button>
//           </div>
//         </div>

//         {/* Summary Statistics Grid with API Data */}
//         <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {[
//             {
//               title: "Total Users",
//               value: stats?.data?.users?.byRole?.user || 0,
//               icon: <Users className="h-8 w-8" />,
//               gradient: "from-blue-500 to-blue-600",
//               iconBg: "bg-blue-500",
//               sub: `${stats?.data?.users?.userVerification?.verified || 0} Verified`,
//               trend: calculateTrend(stats?.data?.summary?.totalUsers),
//             },
//             {
//               title: "Total Courses",
//               value: stats?.data?.summary?.totalCourses || 0,
//               icon: <Book className="h-8 w-8" />,
//               gradient: "from-green-500 to-green-600",
//               iconBg: "bg-green-500",
//               sub: `${stats?.data?.summary?.activeCourses || 0} active`,
//               trend: calculateTrend(stats?.data?.summary?.totalCourses),
//             },
//             {
//               title: "Total Chapters",
//               value: stats?.data?.summary?.totalChapters || 0,
//               icon: <FileText className="h-8 w-8" />,
//               gradient: "from-purple-500 to-purple-600",
//               iconBg: "bg-purple-500",
//               sub: "Across all courses",
//               trend: calculateTrend(stats?.data?.summary?.totalChapters),
//             },
//             {
//               title: "Total Certificates",
//               value: stats?.data?.summary?.totalCertificates || 0,
//               icon: <CheckCircle className="h-8 w-8" />,
//               // gradient: "from-orange-500 to-orange-600",
//               iconBg: "bg-orange-500",
//               // sub: `${stats?.data?.users?.userVerification?.unverified || 0} pending`,
//               // trend: calculateTrend(stats?.data?.users?.userVerification?.verified),
//             },
//           ].map((card, i) => (
//             <div
//               key={i}
//               className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
//             >
//               <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
//                 <div className={`h-full w-full rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`}></div>
//               </div>
              
//               <div className="relative">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                       {card.title}
//                     </p>
//                     <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
//                       {card.value}
//                     </p>
//                     <div className="mt-3 flex items-center space-x-2">
//                       <span className="text-xs text-gray-500 dark:text-gray-400">
//                         {card.sub}
//                       </span>
//                     </div>
//                     <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
//                       <TrendingUp className="h-4 w-4 mr-1" />
//                       <span className="text-xs font-semibold">{card.trend}</span>
//                     </div>
//                   </div>
//                   <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-lg transition-transform group-hover:scale-110`}>
//                     {card.icon}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts Section with Real API Data */}
//         <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
//           {/* User Verification Pie Chart */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
//             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//               <Activity className="mr-2 h-5 w-5 text-blue-600" />
//               User Verification Status
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={userVerificationData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {userVerificationData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Admin Status Bar Chart */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
//             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//               <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
//               Admin Status Overview
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={adminStatusData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//                   {adminStatusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Course Status Horizontal Bar Chart */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
//             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//               <Book className="mr-2 h-5 w-5 text-purple-600" />
//               Course Status Distribution
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={courseStatusData} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis type="number" stroke="#6b7280" />
//                 <YAxis dataKey="name" type="category" stroke="#6b7280" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" radius={[0, 8, 8, 0]}>
//                   {courseStatusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* User Roles Area Chart */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
//             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//               <Users className="mr-2 h-5 w-5 text-orange-600" />
//               User Roles Distribution
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={userRoleData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="count"
//                   stroke="#8b5cf6"
//                   fill="#8b5cf6"
//                   fillOpacity={0.6}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>






        

//         </div>

//         {/* Detailed Statistics Grid with Real Data */}
//         <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* User Stats Card */}
//           <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg dark:border-gray-700 dark:from-blue-900/20 dark:to-blue-800/20">
//             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//               <Users className="mr-2 h-5 w-5 text-blue-600" />
//               User Insights
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Total Users
//                 </span>
//                 <span className="text-xl font-bold text-blue-600">
//                   {stats?.data?.summary?.totalUsers || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Verified
//                 </span>
//                 <span className="text-xl font-bold text-green-600">
//                   {stats?.data?.users?.userVerification?.verified || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Pending
//                 </span>
//                 <span className="text-xl font-bold text-yellow-600">
//                   {stats?.data?.users?.userVerification?.unverified || 0}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Admin Stats Card */}
//           <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg dark:border-gray-700 dark:from-green-900/20 dark:to-green-800/20">
//             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//               <User className="mr-2 h-5 w-5 text-green-600" />
//               Admin Status
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Approved
//                 </span>
//                 <span className="text-xl font-bold text-green-600">
//                   {stats?.data?.users?.adminStatus?.approved || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Pending
//                 </span>
//                 <span className="text-xl font-bold text-yellow-600">
//                   {stats?.data?.users?.adminStatus?.pending || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Rejected
//                 </span>
//                 <span className="text-xl font-bold text-red-600">
//                   {stats?.data?.users?.adminStatus?.rejected || 0}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Course Stats Card */}
//           <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg dark:border-gray-700 dark:from-purple-900/20 dark:to-purple-800/20">
//             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
//               <Book className="mr-2 h-5 w-5 text-purple-600" />
//               Course Overview
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Active
//                 </span>
//                 <span className="text-xl font-bold text-green-600">
//                   {stats?.data?.courses?.active || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Draft
//                 </span>
//                 <span className="text-xl font-bold text-blue-600">
//                   {stats?.data?.courses?.draft || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Inactive
//                 </span>
//                 <span className="text-xl font-bold text-red-600">
//                   {stats?.data?.courses?.inactive || 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
//           <h3 className="mb-6 flex items-center text-xl font-bold text-gray-900 dark:text-white">
//             <Activity className="mr-2 h-6 w-6 text-blue-600" />
//             Quick Actions
//           </h3>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {[
//               {
//                 label: "Manage Users",
//                 icon: <Users className="h-6 w-6" />,
//                 gradient: "from-blue-500 to-blue-600",
//                 path: "/super-admin/all-user",
//               },
//               {
//                 label: "View Courses",
//                 icon: <Book className="h-6 w-6" />,
//                 gradient: "from-green-500 to-green-600",
//                 path: "/super-admin/courses",
//               },
//               {
//                 label: "Manage Ratings",
//                 icon: <Star className="h-6 w-6" />,
//                 gradient: "from-purple-500 to-purple-600",
//                 path: "/super-admin/rating",
//               },
//               {
//                 label: "View Mails",
//                 icon: <Mail className="h-6 w-6" />,
//                 gradient: "from-orange-500 to-orange-600",
//                 path: "/super-admin/mails",
//               },
//             ].map((action, i) => (
//               <button
//                 key={i}
//                 onClick={() => router.push(action.path)}
//                 className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${action.gradient} p-6 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105`}
//               >
//                 <div className="absolute top-0 right-0 h-20 w-20 opacity-20">
//                   <div className="h-full w-full rounded-full bg-white blur-xl"></div>
//                 </div>
//                 <div className="relative flex flex-col items-center">
//                   <div className="mb-3 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
//                     {action.icon}
//                   </div>
//                   <span className="font-semibold">{action.label}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client";

import React, { useEffect } from "react";
import {
  Book,
  User,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
  Eye,
  Mail,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectDashboardStatsLoading,
  selectDashboardStatsError,
  clearError,
} from "@/store/slices/adminslice/dashboardStatsSlice";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export default function DashboardStatsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Redux selectors
  const stats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectDashboardStatsLoading);
  const error = useAppSelector(selectDashboardStatsError);

  console.log("Dashboard Stats Data:", stats?.data);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  // Prepare chart data from API
  const userVerificationData = [
    {
      name: "Verified",
      value: stats?.data?.users?.userVerification?.verified || 0,
      color: "#10b981",
    },
    {
      name: "Unverified",
      value: stats?.data?.users?.userVerification?.unverified || 0,
      color: "#f59e0b",
    },
  ];

  const adminStatusData = [
    {
      name: "Approved",
      value: stats?.data?.users?.adminStatus?.approved || 0,
      fill: "#10b981",
    },
    {
      name: "Pending",
      value: stats?.data?.users?.adminStatus?.pending || 0,
      fill: "#f59e0b",
    },
    {
      name: "Rejected",
      value: stats?.data?.users?.adminStatus?.rejected || 0,
      fill: "#ef4444",
    },
  ];

  const courseStatusData = [
    {
      name: "Active",
      value: stats?.data?.courses?.active || 0,
      fill: "#10b981",
    },
    {
      name: "Inactive",
      value: stats?.data?.courses?.inactive || 0,
      fill: "#ef4444",
    },
    {
      name: "Draft",
      value: stats?.data?.courses?.draft || 0,
      fill: "#3b82f6",
    },
  ];

  const userRoleData = [
    {
      name: "Admins",
      count: stats?.data?.summary?.totalAdmins || 0,
    },
    {
      name: "Users",
      count: stats?.data?.users?.byRole?.user || 0,
    },
  ];

  // Enrollment metrics data
  const enrollmentMetricsData = [
    {
      name: "Total Enrollments",
      value: stats?.data?.summary?.totalEnrollments || 0,
      fill: "#3b82f6",
    },
    {
      name: "Total Courses",
      value: stats?.data?.summary?.totalCourses || 0,
      fill: "#10b981",
    },
    {
      name: "Avg Per Course",
      value: stats?.data?.summary?.totalCourses 
        ? Math.round((stats?.data?.summary?.totalEnrollments || 0) / stats?.data?.summary?.totalCourses)
        : 0,
      fill: "#8b5cf6",
    },
  ];

  // Calculate growth percentages (you can modify these based on your historical data)
  const calculateTrend = (current, previous = 0) => {
    if (!previous) return "+0%";
    const growth = ((current - previous) / previous) * 100;
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading dashboard statistics...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border-2 border-red-200 bg-white/80 backdrop-blur-sm p-8 text-center shadow-2xl dark:border-red-500/50 dark:bg-gray-800/80">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <BarChart3 className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-red-800 dark:text-red-400">
              Error Loading Statistics
            </h3>
            <p className="mb-6 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header with Gradient */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#02517b] to-[#43bf79] p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center text-3xl font-bold text-white">
                <BarChart3 className="mr-3 h-10 w-10" />
                Dashboard Overview
              </h1>
              <p className="mt-2 text-blue-100">
                Comprehensive statistics and insights about your platform
              </p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="mt-4 inline-flex items-center rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 text-white shadow-lg transition-all hover:bg-white/30 hover:scale-105 disabled:opacity-50 sm:mt-0"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh Stats"}
            </button>
          </div>
        </div>

        {/* Summary Statistics Grid with API Data */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Users",
              value: stats?.data?.users?.byRole?.user || 0,
              icon: <Users className="h-8 w-8" />,
              gradient: "from-blue-500 to-blue-600",
              iconBg: "bg-blue-500",
              sub: `${stats?.data?.users?.userVerification?.verified || 0} Verified`,
              trend: calculateTrend(stats?.data?.summary?.totalUsers),
            },
            {
              title: "Total Courses",
              value: stats?.data?.summary?.totalCourses || 0,
              icon: <Book className="h-8 w-8" />,
              gradient: "from-green-500 to-green-600",
              iconBg: "bg-green-500",
              sub: `${stats?.data?.summary?.activeCourses || 0} active`,
              trend: calculateTrend(stats?.data?.summary?.totalCourses),
            },
            {
              title: "Total Chapters",
              value: stats?.data?.summary?.totalChapters || 0,
              icon: <FileText className="h-8 w-8" />,
              gradient: "from-purple-500 to-purple-600",
              iconBg: "bg-purple-500",
              sub: "Across all courses",
              trend: calculateTrend(stats?.data?.summary?.totalChapters),
            },
            {
              title: "Total Certificates",
              value: stats?.data?.summary?.totalCertificates || 0,
              icon: <CheckCircle className="h-8 w-8" />,
              gradient: "from-orange-500 to-orange-600",
              iconBg: "bg-orange-500",
              sub: "Issued to users",
              trend: calculateTrend(stats?.data?.summary?.totalCertificates),
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <div className={`h-full w-full rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`}></div>
              </div>
              
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.title}
                    </p>
                    <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {card.sub}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-xs font-semibold">{card.trend}</span>
                    </div>
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-lg transition-transform group-hover:scale-110`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section with Real API Data */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* User Verification Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              User Verification Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userVerificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userVerificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Admin Status Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
              Admin Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {adminStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Course Status Horizontal Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Book className="mr-2 h-5 w-5 text-purple-600" />
              Course Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles Area Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Users className="mr-2 h-5 w-5 text-orange-600" />
              User Roles Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Enrollment Metrics Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:col-span-2 xl:col-span-1">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Enrollment Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={enrollmentMetricsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {enrollmentMetricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Statistics Grid with Real Data */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* User Stats Card */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg dark:border-gray-700 dark:from-blue-900/20 dark:to-blue-800/20">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              User Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Users
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {stats?.data?.summary?.totalUsers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verified
                </span>
                <span className="text-xl font-bold text-green-600">
                  {stats?.data?.users?.userVerification?.verified || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pending
                </span>
                <span className="text-xl font-bold text-yellow-600">
                  {stats?.data?.users?.userVerification?.unverified || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Stats Card */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg dark:border-gray-700 dark:from-green-900/20 dark:to-green-800/20">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <User className="mr-2 h-5 w-5 text-green-600" />
              Admin Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Approved
                </span>
                <span className="text-xl font-bold text-green-600">
                  {stats?.data?.users?.adminStatus?.approved || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pending
                </span>
                <span className="text-xl font-bold text-yellow-600">
                  {stats?.data?.users?.adminStatus?.pending || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rejected
                </span>
                <span className="text-xl font-bold text-red-600">
                  {stats?.data?.users?.adminStatus?.rejected || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Course Stats Card */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg dark:border-gray-700 dark:from-purple-900/20 dark:to-purple-800/20">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Book className="mr-2 h-5 w-5 text-purple-600" />
              Course Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active
                </span>
                <span className="text-xl font-bold text-green-600">
                  {stats?.data?.courses?.active || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Draft
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {stats?.data?.courses?.draft || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inactive
                </span>
                <span className="text-xl font-bold text-red-600">
                  {stats?.data?.courses?.inactive || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 flex items-center text-xl font-bold text-gray-900 dark:text-white">
            <Activity className="mr-2 h-6 w-6 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Manage Users",
                icon: <Users className="h-6 w-6" />,
                gradient: "from-blue-500 to-blue-600",
                path: "/super-admin/all-user",
              },
              {
                label: "View Courses",
                icon: <Book className="h-6 w-6" />,
                gradient: "from-green-500 to-green-600",
                path: "/super-admin/courses",
              },
              {
                label: "Manage Ratings",
                icon: <Star className="h-6 w-6" />,
                gradient: "from-purple-500 to-purple-600",
                path: "/super-admin/rating",
              },
              {
                label: "View Mails",
                icon: <Mail className="h-6 w-6" />,
                gradient: "from-orange-500 to-orange-600",
                path: "/super-admin/mails",
              },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.path)}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${action.gradient} p-6 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105`}
              >
                <div className="absolute top-0 right-0 h-20 w-20 opacity-20">
                  <div className="h-full w-full rounded-full bg-white blur-xl"></div>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="mb-3 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
                    {action.icon}
                  </div>
                  <span className="font-semibold">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}