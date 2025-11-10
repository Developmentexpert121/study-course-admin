
"use client";
// // components/learning-paths/LearningPathDetail.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useLearningPathApi } from "@/lib/api/learningPathApi";
// import {
//   BookOpen,
//   Clock,
//   Users,
//   Star,
//   ArrowRight,
//   CheckCircle,
//   Lock,
//   PlayCircle,
//   BarChart3,
// } from "lucide-react";

// export default function LearningPathDetail() {
//   const [learningPath, setLearningPath] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const params = useParams();
//   const router = useRouter();
//   const learningPathApi = useLearningPathApi();

//   useEffect(() => {
//     if (params.id) {
//       fetchLearningPath();
//     }
//   }, [params.id]);

//   const fetchLearningPath = async () => {
//     try {
//       setLoading(true);
//       const response = await learningPathApi.getLearningPathById(params.id);
//       if (response.success) {
//         setLearningPath(response.data.learningPath);
//       }
//     } catch (error) {
//       console.error("Failed to fetch learning path:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (hours: number) => {
//     if (hours < 1) return `${Math.round(hours * 60)}m`;
//     return `${hours}h`;
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "beginner":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//       case "intermediate":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
//       case "advanced":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!learningPath) {
//     return <div>Learning path not found</div>;
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-8">
//       {/* Header */}
//       <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
//         <div className="flex items-start gap-6">
//           {learningPath.image && (
//             <img
//               src={learningPath.image}
//               alt={learningPath.title}
//               className="h-32 w-32 rounded-lg object-cover"
//             />
//           )}
//           <div className="flex-1">
//             <div className="mb-4 flex items-center gap-3">
//               <span
//                 className={`rounded-full px-3 py-1 text-sm font-medium ${getDifficultyColor(learningPath.difficulty)}`}
//               >
//                 {learningPath.difficulty}
//               </span>
//               <span className="text-gray-500 dark:text-gray-400">
//                 {learningPath.courses.length} courses
//               </span>
//             </div>

//             <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
//               {learningPath.title}
//             </h1>

//             <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
//               {learningPath.description}
//             </p>

//             <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
//               <div className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 <span>
//                   {formatDuration(learningPath.estimated_duration)} total
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <BookOpen className="h-5 w-5" />
//                 <span>{learningPath.courses.length} courses</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Course Progress */}
//       <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
//         <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
//           Learning Path Progress
//         </h2>

//         <div className="space-y-4">
//           {learningPath.courses.map((course: any, index: number) => (
//             <div
//               key={course.id}
//               className={`flex items-center gap-4 rounded-lg border p-4 ${
//                 course.is_locked
//                   ? "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
//                   : "border-gray-200 dark:border-gray-700"
//               }`}
//             >
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                   course.is_locked
//                     ? "bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
//                     : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
//                 }`}
//               >
//                 {course.is_locked ? (
//                   <Lock className="h-4 w-4" />
//                 ) : (
//                   <span>{index + 1}</span>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-medium text-gray-900 dark:text-white">
//                   {course.title}
//                   {course.is_locked && (
//                     <span className="ml-2 text-sm text-gray-500">
//                       (Complete previous course to unlock)
//                     </span>
//                   )}
//                 </h3>
//                 <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
//                   {course.description}
//                 </p>

//                 {course.is_enrolled && (
//                   <div className="mt-2 flex items-center gap-4 text-sm">
//                     <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
//                       <CheckCircle className="h-4 w-4" />
//                       <span>Enrolled</span>
//                     </div>
//                     {course.completion_percentage > 0 && (
//                       <div className="flex items-center gap-2">
//                         <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
//                           <div
//                             className="h-full rounded-full bg-green-500 transition-all"
//                             style={{
//                               width: `${course.completion_percentage}%`,
//                             }}
//                           />
//                         </div>
//                         <span className="text-gray-500">
//                           {Math.round(course.completion_percentage)}%
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center gap-3">
//                 {!course.is_locked && (
//                   <button
//                     onClick={() => router.push(`/courses/${course.id}`)}
//                     className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
//                   >
//                     {course.is_enrolled ? (
//                       <>
//                         <PlayCircle className="h-4 w-4" />
//                         Continue
//                       </>
//                     ) : (
//                       "Enroll Now"
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Path Statistics */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//         <div className="rounded-lg bg-white p-6 text-center shadow-sm dark:bg-gray-800">
//           <BookOpen className="mx-auto mb-3 h-8 w-8 text-blue-500" />
//           <div className="text-2xl font-bold text-gray-900 dark:text-white">
//             {learningPath.courses.length}
//           </div>
//           <div className="text-gray-500 dark:text-gray-400">Total Courses</div>
//         </div>

//         <div className="rounded-lg bg-white p-6 text-center shadow-sm dark:bg-gray-800">
//           <Clock className="mx-auto mb-3 h-8 w-8 text-green-500" />
//           <div className="text-2xl font-bold text-gray-900 dark:text-white">
//             {formatDuration(learningPath.estimated_duration)}
//           </div>
//           <div className="text-gray-500 dark:text-gray-400">Estimated Time</div>
//         </div>

//         <div className="rounded-lg bg-white p-6 text-center shadow-sm dark:bg-gray-800">
//           <BarChart3 className="mx-auto mb-3 h-8 w-8 text-purple-500" />
//           <div className="text-2xl font-bold text-gray-900 dark:text-white">
//             {learningPath.difficulty}
//           </div>
//           <div className="text-gray-500 dark:text-gray-400">
//             Difficulty Level
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function page() {
  return (
    <div>
      <h1>hii</h1>
    </div>
  );
}
