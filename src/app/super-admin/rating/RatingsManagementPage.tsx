import React from 'react'

export default function RatingsManagementPage() {
  return (
    <div></div>
  )
}

// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Star,
//   User,
//   Mail,
//   Calendar,
//   Eye,
//   EyeOff,
//   Check,
//   X,
//   Info,
// } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useApiClient } from "@/lib/api";
// import { toasterError, toasterSuccess } from "@/components/core/Toaster";
// import { updateReviewVisibility } from "@/store/slices/adminslice/ratingsoftdelete";
// import { useAppDispatch } from "@/store";
// import { getDecryptedItem } from "@/utils/storageHelper";
// interface Rating {
//   id: number;
//   user_id: number;
//   course_id: number;
//   score: number;
//   review: string;
//   status: "showtoeveryone" | "hidebyadmin" | "hidebysuperadmin";
//   isactive: boolean;
//   createdAt: string;
//   rating_user: {
//     id: number;
//     username: string;
//     email: string;
//     profileImage?: string;
//   };
// }

// export default function RatingsManagementPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const api = useApiClient();
// const role = getDecryptedItem("role");
//   const courseId = searchParams.get("course_id");

//   const [ratings, setRatings] = useState<Rating[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<number | null>(null);
//   const dispatch = useAppDispatch();
//   const fetchRatings = async () => {
//     try {
//       setLoading(true);
//       let url = "rating";
//       if (courseId) url = `rating/course/${courseId}`;
//       const res = await api.get(url);

//       if (res.success) {
//         setRatings(res.data?.data || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch ratings:", error);
//       toasterError("Failed to fetch ratings", 2000, "id");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRatings();
//   }, [courseId]);

//   const formatDate = (dateString: string) => {
//     return new Intl.DateTimeFormat("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     }).format(new Date(dateString));
//   };

//   // Actions
//   const handleHideRating = async (ratingId: number) => {
//     setActionLoading(ratingId);
//     try {
//       const res = await api.patch(`rating/${ratingId}/hide`);
//       if (res.success) {
//         toasterSuccess("Rating hidden", 2000, "id");
//         fetchRatings();
//       }
//     } catch {
//       toasterError("Failed to hide rating", 2000, "id");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleUnhideRating = async (ratingId: number) => {
//     setActionLoading(ratingId);
//     try {
//       const res = await api.patch(`rating/${ratingId}/unhide`);
//       if (res.success) {
//         toasterSuccess("Rating shown", 2000, "id");
//         fetchRatings();
//       }
//     } catch {
//       toasterError("Failed to show rating", 2000, "id");
//     } finally {
//       setActionLoading(null);
//     }
//   };



//   const handleDeleteRating = async (ratingId: number , role:any) => {
//     await dispatch(updateReviewVisibility({
//       ratingId: ratingId,
//       role: role,
//     }));
//     fetchRatings();
//   };

//   const handleAddRating = async (ratingId: number) => {
//     setActionLoading(ratingId);
//     try {
//   // Add empty object as second argument
//   const res = await api.put(`rating/${ratingId}/visibilityactive`, {});
  
//   if (res.success) {
//     toasterSuccess("Rating activated", 2000, "id");
//     fetchRatings();
//   } else {
//     toasterError(res.error || "Failed to activate rating");
//   }
// } catch {
//       toasterError("Failed to activate rating", 2000, "id");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
//       </div>
//     );

//   return (
//     <div className="mx-auto max-w-5xl ">
//       {ratings.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
//         >
//           <Star className="h-12 w-12 text-gray-300 dark:text-gray-600" />
//           <p className="mt-4 text-gray-500 dark:text-gray-300">
//             No ratings found
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-3   lg:grid-cols-1">
//           {ratings.slice(0, 9).map((rating) => (
//             <div
//               key={rating.id}
//               className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
//             >
//               {/* User Info */}
//               <div className="flex items-center gap-3">
//                 {rating.rating_user?.profileImage ? (
//                   <img
//                     src={rating.rating_user.profileImage}
//                     alt={rating.rating_user.username}
//                     className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-600"
//                   />
//                 ) : (
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white">
//                     <User className="h-5 w-5" />
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                     {rating.rating_user?.username || "Unknown User"}
//                   </p>
//                   <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//                     <Mail className="h-3 w-3" />
//                     {rating.rating_user?.email || "No email"}
//                   </p>
//                 </div>
//               </div>

//               {/* Rating Stars */}
//               <div className="mt-3 flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${i < rating.score
//                       ? "fill-yellow-400 text-yellow-400"
//                       : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-700"
//                       }`}
//                   />
//                 ))}
//                 <span className="ml-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
//                   {rating.score}
//                 </span>
//               </div>

//               {/* Review */}
//               <p className="mt-2 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
//                 {rating.review || (
//                   <span className="italic text-gray-500 dark:text-gray-400">
//                     No review
//                   </span>

//                 )}
//               </p>

//               {/* Footer */}
//               <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//                 <div className="flex items-center gap-1">
//                   <Calendar className="h-3.5 w-3.5" />
//                   {formatDate(rating.createdAt)}
//                 </div>
//                 {rating.status === "showtoeveryone" ? (
//                   <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
//                     <Eye className="h-3.5 w-3.5" /> Visible
//                   </span>
//                 ) : rating.status === "hidebyadmin" ? (
//                   <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
//                     <EyeOff className="h-3.5 w-3.5" /> Hidden by Admin
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
//                     <Info className="h-3.5 w-3.5" /> Hidden
//                   </span>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="mt-3 flex flex-wrap gap-2">
//                 {rating.status === "showtoeveryone" ? (
//                   <button
//                     onClick={() => handleHideRating(rating.id)}
//                     disabled={actionLoading === rating.id}
//                     className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
//                   >
//                     <EyeOff className="h-3 w-3" />
//                     Hide
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleUnhideRating(rating.id)}
//                     disabled={actionLoading === rating.id}
//                     className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
//                   >
//                     <Eye className="h-3 w-3" />
//                     Show
//                   </button>
//                 )}

//                 {(rating.review_visibility === "visible" )? (
//                   <button
//                     onClick={() => handleDeleteRating(rating.id , role)}
//                     disabled={actionLoading === rating.id}
//                     className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
//                   >
//                     <X className="h-3 w-3" />
//                     Deactivate
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleAddRating(rating.id)}
//                     disabled={actionLoading === rating.id}
//                     className="flex items-center gap-1 rounded-md bg-[#02517b]px-2 py-1 text-xs text-white hover:bg-[#1A6A93] disabled:opacity-50"
//                   >
//                     <Check className="h-3 w-3" />
//                     Activate
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
