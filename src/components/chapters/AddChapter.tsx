"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { BookOpen, ListOrdered } from "lucide-react";
import { useApiClient } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

const AddChapter = ({ basePath }: { basePath: string }) => {
  const router = useRouter();
  const api = useApiClient();
  const [courses, setCourses] = useState<any>([]);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  const courseName = searchParams.get("course");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    course_id: courseId ?? "",
    order: "",
  });

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null]);
  const [videoFiles, setVideoFiles] = useState<(File | null)[]>([null]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("course/list");
      setCourses(res.data?.data?.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    if (type === "image") {
      setImageUploadLoading(true);
    } else {
      setVideoUploadLoading(true);
    }

    try {
      const res = await api.postFile("upload", form);

      if (res.success && res.data?.data?.fileUrl) {
        const fileUrl = res.data.data?.fileUrl;

        if (type === "image") {
          const updatedFiles = [...imageFiles];
          updatedFiles[index] = file;
          setImageFiles(updatedFiles);

          const updatedUrls = [...uploadedImageUrls];
          updatedUrls[index] = fileUrl;
          setUploadedImageUrls(updatedUrls);
        } else {
          const updatedFiles = [...videoFiles];
          updatedFiles[index] = file;
          setVideoFiles(updatedFiles);

          const updatedUrls = [...uploadedVideoUrls];
          updatedUrls[index] = fileUrl;
          setUploadedVideoUrls(updatedUrls);
        }
      } else {
        toasterError("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toasterError("Upload failed");
    } finally {
      if (type === "image") {
        setImageUploadLoading(false);
      } else {
        setVideoUploadLoading(false);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { title, content, course_id, order } = formData;

    let newErrors: any = {};
    if (!title) newErrors.title = "Title is required";
    if (!content) newErrors.content = "Course Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toasterError(
`Please fill ${Object.keys(newErrors).length} required field(s)`
);
      return;
    }
    setErrors({});

    if (!title.trim() || !content.trim() || !course_id) {
      return;
    }


    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        course_id: Number(course_id),
        order: Number(order),
        // images: uploadedImageUrls,
        // videos: uploadedVideoUrls,
      };

      const res = await api.post("chapter", payload);

      if (res.success) {
        toasterSuccess("Chapter created successfully", 2000, "id");
        router.push(
          `/${basePath}/lessons/list/create-lessons?chapter_id=${res.data?.data?.chapter.id}&course_id=${courseId}&courseName=${courseName}`,
        )
      } else {
        toasterError(res.error?.code || "Something went wrong ❌", 2000, "id");
      }
    } catch (error) {
      console.error("Chapter creation failed", error);
      toasterError("Failed to create chapter ❌");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Chapters" />
      <ShowcaseSection title="Add Chapter" className="!p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full">
              <InputGroup
                type="text"
                name="title"
                label="Chapter Title*"
                placeholder="Enter Chapter Title"
                value={formData.title}
                onChange={handleChange}
                icon={<BookOpen />}
                iconPosition="left"
                height="sm"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            {/* <div className="w-full sm:w-1/2">
              <InputGroup
                type="number"
                name="order"
                label="Chapter Order*"
                placeholder="Enter Order Number"
                value={formData.order}
                onChange={handleChange}
                icon={<ListOrdered />}
                iconPosition="left"
                height="sm"
                min={1}
                step={1}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-500">{errors.order}</p>
              )}
            </div> */}

          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Select Course
            </label>
            <select
              name="course_id"
              value={formData.course_id}
              disabled
              onChange={handleChange}
              className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none disabled:cursor-not-allowed dark:border-dark-3"
            >
              <option value="">-- Select Course --</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <RichTextEditor
            label="Course Description *"
            value={formData.content}
            onChange={(value) => handleChange({ target: { name: 'content', value: value } } as any)}
            placeholder="Write chapter content..."
            minHeight="300px"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
          {/* <div className="mb-10">
            <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
              📷 Upload Chapter Images
            </label>
            <div className="space-y-5">
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleDynamicFileChange(e, index, "image")
                      }
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {imageFiles[index]?.name || "Click to upload image"}
                    </span>
                  </label>

                  {imageUploadLoading && index === uploadedImageUrls.length ? (
                    <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-lg border bg-gray-100">
                      <div className="loader h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : (
                    uploadedImageUrls[index] && (
                      <a
                        href={uploadedImageUrls[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={uploadedImageUrls[index]}
                          alt={`preview-${index}`}
                          className="h-20 w-20 cursor-pointer rounded-lg object-cover shadow"
                        />
                      </a>
                    )
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const lastIndex = imageFiles.length - 1;
                if (!uploadedImageUrls[lastIndex]) {
                  toasterError(
                    "Please upload the current image before adding another.",
                    2000,
                    "id",
                  );
                  return;
                }
                setImageFiles([...imageFiles, null]);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
            >
              ➕ Add Image
            </button>
          </div>

          <div className="mb-10">
            <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
              🎥 Upload Chapter Videos
            </label>
            <div className="space-y-5">
              {videoFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        handleDynamicFileChange(e, index, "video")
                      }
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {videoFiles[index]?.name || "Click to upload video"}
                    </span>
                  </label>

                  {videoUploadLoading && index === uploadedVideoUrls.length ? (
                    <div className="flex h-20 w-28 animate-pulse items-center justify-center rounded-lg border bg-gray-100">
                      <div className="loader h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                  ) : (
                    uploadedVideoUrls[index] && (
                      <a
                        href={uploadedVideoUrls[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-20 w-28 overflow-hidden rounded-lg border shadow"
                      >
                        <video className="pointer-events-none h-full w-full cursor-pointer object-cover">
                          <source
                            src={uploadedVideoUrls[index]}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </a>
                    )
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const lastIndex = videoFiles.length - 1;
                if (!uploadedVideoUrls[lastIndex]) {
                  toasterError(
                    "Please upload the current video before adding another.",
                    2000,
                    "id",
                  );
                  return;
                }
                setVideoFiles([...videoFiles, null]);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#02517b]px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-[#1A6A93]"
            >
              ➕ Add Video
            </button>
          </div> */}

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-[#1A6A93] hover:bg-[#02517b] px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={imageUploadLoading || videoUploadLoading}
            >
              {imageUploadLoading || videoUploadLoading
                ? "Uploading..."
                : "Create Chapter"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default AddChapter;
