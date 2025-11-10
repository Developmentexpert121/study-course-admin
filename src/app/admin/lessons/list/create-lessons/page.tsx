"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon } from "@/assets/icons";
import { BookOpen, ListOrdered, Image, Video, FileText } from "lucide-react";
import { useApiClient } from "@/lib/api";

const CreateLessons = () => {
  const api = useApiClient();

  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [chapter, setChapter] = useState<any>(null);
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapter_id");
  const courseId = searchParams.get("course_id");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    chapter_id: chapterId ?? "",
    course_id: courseId ?? "",
    order: "",
    duration: "",
    video_url: "",
    resources: [] as string[],
    is_free: true,
  });

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null]);
  const [videoFiles, setVideoFiles] = useState<(File | null)[]>([null]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);
  const [resourceInput, setResourceInput] = useState("");

  // Auto-detect lesson type based on content
  const detectLessonType = (): string => {
    const hasImages = uploadedImageUrls.length > 0;
    const hasVideos = uploadedVideoUrls.length > 0;
    const hasContent = formData.content.trim().length > 0;
    const hasVideoUrl = formData.video_url.trim().length > 0;

    if (hasVideos || hasVideoUrl) {
      return "video";
    } else if (hasImages && hasContent) {
      return "text"; // Text lessons can have images
    } else if (hasImages) {
      return "text"; // Consider image-only as text lesson
    } else if (hasContent) {
      return "text";
    } else {
      return "text"; // Default to text
    }
  };

  // Get lesson type display for UI
  const getLessonTypeDisplay = (): {
    type: string;
    label: string;
    icon: any;
    color: string;
  } => {
    const type = detectLessonType();

    switch (type) {
      case "video":
        return {
          type,
          label: "Video Lesson",
          icon: <Video size={16} />,
          color: "text-red-600 bg-red-50 dark:bg-red-900/20",
        };
      case "text":
      default:
        return {
          type,
          label: "Text Lesson",
          icon: <FileText size={16} />,
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        };
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("course/list");
      setCourses(res.data?.data?.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toasterError("Failed to load courses");
    }
  };

  const fetchChapter = async (chapterId: string) => {
    if (!chapterId) return;

    try {
      const res = await api.get(`chapter/${Number(chapterId)}`);
      setChapter(res.data?.data?.chapter || null);
    } catch (err) {
      console.error("Failed to fetch chapter:", err);
      toasterError("Failed to load chapter");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (chapterId) {
      fetchChapter(chapterId);
    }
  }, [chapterId]);

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

    const maxSize = type === "image" ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toasterError(
        `File too large. Max ${type === "image" ? "5MB" : "100MB"} allowed.`,
      );
      return;
    }

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
        const fileUrl = res.data.data.fileUrl;

        if (type === "image") {
          const updatedUrls = [...uploadedImageUrls];
          updatedUrls[index] = fileUrl;
          setUploadedImageUrls(updatedUrls);
        } else {
          const updatedUrls = [...uploadedVideoUrls];
          updatedUrls[index] = fileUrl;
          setUploadedVideoUrls(updatedUrls);

          // Auto-set video_url for the first video
          if (index === 0 && !formData.video_url) {
            setFormData((prev) => ({ ...prev, video_url: fileUrl }));
          }
        }

        toasterSuccess(
          `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`,
        );
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

  const addResource = () => {
    if (
      resourceInput.trim() &&
      !formData.resources.includes(resourceInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        resources: [...prev.resources, resourceInput.trim()],
      }));
      setResourceInput("");
    }
  };

  const removeResource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, content, chapter_id, order } = formData;

    if (!title.trim() || !content.trim() || !chapter_id || !order || !content) {
      toasterError("Please fill in all required fields ❌");
      return;
    }

    const lessonType = detectLessonType();

    if (
      lessonType === "video" &&
      !formData.video_url.trim() &&
      uploadedVideoUrls.length === 0
    ) {
      toasterError(
        "Please add at least one video or video URL for video lessons",
      );
      return;
    }

    if (
      !uploadedImageUrls.length &&
      !uploadedVideoUrls.length &&
      !formData.video_url && 
      !formData.content
    ) {
      toasterError("Please add at least one image, video, or video URL");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        chapter_id: Number(chapter_id),
        order: Number(order),
        lesson_type: lessonType,
        duration: formData.duration ? Number(formData.duration) : undefined,
        video_url: formData.video_url.trim(),
        resources: formData.resources,
        is_free: formData.is_free,
        images: uploadedImageUrls.filter((url) => url),
        videos: uploadedVideoUrls.filter((url) => url),
      };

      const res = await api.post("lessons", payload);

      if (res.success) {
        toasterSuccess("Lesson created successfully", 2000);
        router.push(
          `/admin/lessons/list?chapter_id=${chapter_id}&course_id=${formData.course_id}`,
        );
      } else {
        toasterError(res.error?.code || "Something went wrong ❌");
      }
    } catch (error) {
      console.error("Lesson creation failed", error);
      toasterError("Failed to create lesson ❌");
    }
  };

  const removeMedia = (index: number, type: "image" | "video") => {
    if (type === "image") {
      const updatedFiles = [...imageFiles];
      const updatedUrls = [...uploadedImageUrls];

      updatedFiles.splice(index, 1);
      updatedUrls.splice(index, 1);

      setImageFiles(updatedFiles);
      setUploadedImageUrls(updatedUrls);
    } else {
      const updatedFiles = [...videoFiles];
      const updatedUrls = [...uploadedVideoUrls];

      updatedFiles.splice(index, 1);
      updatedUrls.splice(index, 1);

      setVideoFiles(updatedFiles);
      setUploadedVideoUrls(updatedUrls);
      if (formData.video_url === uploadedVideoUrls[index]) {
        setFormData((prev) => ({ ...prev, video_url: "" }));
      }
    }
  };

  const lessonTypeDisplay = getLessonTypeDisplay();

  return (
    <>
      <Breadcrumb pageName="Create Lesson" />
      <ShowcaseSection title="Add New Lesson" className="!p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${lessonTypeDisplay.color}`}>
                  {lessonTypeDisplay.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Lesson Type: {lessonTypeDisplay.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatically detected based on your content
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content Summary
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {uploadedImageUrls.length > 0 &&
                    `📷 ${uploadedImageUrls.length} image(s) `}
                  {uploadedVideoUrls.length > 0 &&
                    `🎥 ${uploadedVideoUrls.length} video(s) `}
                  {formData.video_url && `🔗 Video URL `}
                  {formData.content.trim() && `📝 Text content`}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="title"
              label="Lesson Title"
              placeholder="Enter Lesson Title"
              value={formData.title}
              onChange={handleChange}
              icon={<BookOpen />}
              iconPosition="left"
              height="sm"
              required
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="number"
              name="order"
              label="Lesson Order"
              placeholder="Enter Order Number"
              value={formData.order}
              onChange={handleChange}
              icon={<ListOrdered />}
              iconPosition="left"
              height="sm"
              min={1}
              step={1}
              required
            />
          </div>

          <div className="mb-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Course Name *
              </label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                disabled
                className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed dark:border-dark-3"
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Chapter Name *
              </label>
              <select
                name="chapter_id"
                value={formData.chapter_id}
                onChange={handleChange}
                disabled
                className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3"
                required
              >
                <option value="">-- Select Chapter --</option>
                {chapter && <option value={chapter.id}>{chapter.title}</option>}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-5.5">
            <InputGroup
              type="number"
              name="duration"
              label="Duration (minutes)"
              placeholder="Enter duration in minutes"
              value={formData.duration}
              onChange={handleChange}
              iconPosition="left"
              height="sm"
              min={1}
              step={1}
            />
          </div>

          <div className="mb-5.5">
            <InputGroup
              type="url"
              name="video_url"
              label="Video URL (Optional)"
              placeholder="Enter external video URL (YouTube, Vimeo, etc.)"
              value={formData.video_url}
              onChange={handleChange}
              icon={<Video size={16} />}
              iconPosition="left"
              height="sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Add an external video URL or upload video files below
            </p>
          </div>

          <TextAreaGroup
            className="mb-5.5"
            label="Lesson Content *"
            name="content"
            placeholder="Enter Lesson Content"
            icon={<PencilSquareIcon />}
            value={formData.content}
            onChange={handleChange}
            rows={6}
            required
          />

          <div className="mb-5.5">
            <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
              📎 Additional Resources
            </label>
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={resourceInput}
                onChange={(e) => setResourceInput(e.target.value)}
                placeholder="Enter resource URL"
                className="dark:bg-boxdark flex-1 rounded-lg border border-stroke px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-3"
              />
              <button
                type="button"
                onClick={addResource}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
              >
                Add Resource
              </button>
            </div>
            {formData.resources.length > 0 && (
              <div className="space-y-2">
                {formData.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2 dark:border-dark-3"
                  >
                    <span className="truncate text-sm">{resource}</span>
                    <button
                      type="button"
                      onClick={() => removeResource(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-10">
            <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
              📷 Lesson Images
            </label>
            <div className="space-y-5">
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleDynamicFileChange(e, index, "image")
                      }
                      className="hidden"
                    />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {uploadedImageUrls[index]
                          ? "Change Image"
                          : "Click to upload image"}
                      </div>
                      {uploadedImageUrls[index] && (
                        <div className="mt-1 text-xs text-green-600">
                          ✓ Uploaded
                        </div>
                      )}
                    </div>
                  </label>

                  {imageUploadLoading && index === uploadedImageUrls.length ? (
                    <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-lg border bg-gray-100">
                      <div className="loader h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : (
                    uploadedImageUrls[index] && (
                      <div className="relative">
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
                        <button
                          type="button"
                          onClick={() => removeMedia(index, "image")}
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setImageFiles([...imageFiles, null])}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
            >
              ➕ Add Another Image
            </button>
          </div>

          <div className="mb-10">
            <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
              🎥 Lesson Videos
            </label>
            <div className="space-y-5">
              {videoFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        handleDynamicFileChange(e, index, "video")
                      }
                      className="hidden"
                    />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {uploadedVideoUrls[index]
                          ? "Change Video"
                          : "Click to upload video"}
                      </div>
                      {uploadedVideoUrls[index] && (
                        <div className="mt-1 text-xs text-green-600">
                          ✓ Uploaded
                        </div>
                      )}
                    </div>
                  </label>

                  {videoUploadLoading && index === uploadedVideoUrls.length ? (
                    <div className="flex h-20 w-28 animate-pulse items-center justify-center rounded-lg border bg-gray-100">
                      <div className="loader h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                  ) : (
                    uploadedVideoUrls[index] && (
                      <div className="relative">
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
                        <button
                          type="button"
                          onClick={() => removeMedia(index, "video")}
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setVideoFiles([...videoFiles, null])}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
            >
              ➕ Add Another Video
            </button>
          </div>

          <div className="mb-5.5 flex items-center gap-3">
            <input
              type="checkbox"
              id="is_free"
              name="is_free"
              checked={formData.is_free}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_free: e.target.checked }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="is_free"
              className="text-sm font-medium text-gray-700 dark:text-white"
            >
              This lesson is free
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-primary px-6 py-3 font-medium text-gray-2 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={imageUploadLoading || videoUploadLoading}
            >
              {imageUploadLoading || videoUploadLoading
                ? "Uploading..."
                : "Create Lesson"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default CreateLessons;
