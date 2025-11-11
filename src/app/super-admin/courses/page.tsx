import CoursesList from "@/components/courses/CoursesList";

export default function Courses({ className }: any) {
  return <CoursesList basePath="super-admin" className={className} />;
}
