"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { BookOpen, ListOrdered, Image, Video, FileText } from "lucide-react";
import { useApiClient } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

const EditLesson = ({ basePath }: { basePath: string }) => {
    const router = useRouter();
    const api = useApiClient();

    const searchParams = useSearchParams();
    const lessonId = searchParams.get("lesson_id");
    const chapterId = searchParams.get("chapter_id");
    const courseId = searchParams.get("course_id");

    const [courses, setCourses] = useState<any[]>([]);
    const [chapter, setChapter] = useState<any>(null);
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        chapter_id: chapterId ?? "",
        course_id: courseId ?? "",
        order: "",
        duration: "",
        video_urls: [] as string[],
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
    const [videoUrlInputs, setVideoUrlInputs] = useState<string[]>([""]);

    // Validate video URL
    const isValidVideoUrl = (url: string): boolean => {
        if (!url.trim()) return false;
        try {
            const parsedUrl = new URL(url);
            // Check for YouTube
            if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
                return true;
            }
            // Check for Vimeo
            if (parsedUrl.hostname.includes('vimeo.com')) {
                return true;
            }
            // For direct video URLs, check extension
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
            return videoExtensions.some(ext => url.toLowerCase().includes(ext));
        } catch {
            return false;
        }
    };

    // Get embed URL for video preview
    const getEmbedUrl = (url: string): string | null => {
        if (!url.trim()) return null;
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
                const videoId = parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop();
                return `https://www.youtube.com/embed/${videoId}`;
            }
            if (parsedUrl.hostname.includes('vimeo.com')) {
                const videoId = parsedUrl.pathname.split('/').pop();
                return `https://player.vimeo.com/video/${videoId}`;
            }
            return url; // for direct video
        } catch {
            return null;
        }
    };

    // Auto-detect lesson type based on content
    const detectLessonType = (): string => {
        const hasImages = uploadedImageUrls.length > 0;
        const hasVideos = uploadedVideoUrls.length > 0;
        const hasContent = formData.content.trim().length > 0;
        const hasVideoUrls = formData.video_urls.length > 0;

        if (hasVideos || hasVideoUrls) {
            return "video";
        } else if (hasImages && hasContent) {
            return "text";
        } else if (hasImages) {
            return "text";
        } else if (hasContent) {
            return "text";
        } else {
            return "text";
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

    // Fetch lesson data
    const fetchLesson = async () => {
        if (!lessonId) return;

        try {
            setLoading(true);
            const res = await api.get(`lessons/${Number(lessonId)}`);

            if (res.success && res.data?.data?.lesson) {
                const lessonData = res.data.data.lesson;
                setLesson(lessonData);

                // Set form data
                setFormData({
                    title: lessonData.title || "",
                    content: lessonData.content || "",
                    chapter_id: lessonData.chapter_id || chapterId || "",
                    course_id: courseId || "",
                    order: lessonData.order?.toString() || "",
                    duration: lessonData.duration?.toString() || "",
                    video_urls: lessonData.video_urls || [],
                    resources: lessonData.resources || [],
                    is_free: lessonData.is_free ?? true,
                });



                // Set existing media
                if (lessonData.images && lessonData.images.length > 0) {
                    setUploadedImageUrls(lessonData.images);
                    setImageFiles(Array(lessonData.images.length).fill(null));
                }

                if (lessonData.videos && lessonData.videos.length > 0) {
                    setUploadedVideoUrls(lessonData.videos);
                    setVideoFiles(Array(lessonData.videos.length).fill(null));
                }

                if (lessonData.video_urls && lessonData.video_urls.length > 0) {
                    setVideoUrlInputs(lessonData.video_urls);
                }

                if (lessonData.resources || lessonData.resources.length > 0) {
                    setFormData((prev) => ({ ...prev, resources: lessonData.resources }));
                }

            } else {
                toasterError("Failed to load lesson data");
            }
        } catch (err) {
            console.error("Failed to fetch lesson:", err);
            toasterError("Failed to load lesson data");
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses and chapter
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
        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId]);

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
                    if (index === 0 && !formData.video_urls) {
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

    const addVideoUrl = () => {
        setVideoUrlInputs([...videoUrlInputs, ""]);
    };

    const removeVideoUrl = (index: number) => {
        const updatedInputs = videoUrlInputs.filter((_, i) => i !== index);
        setVideoUrlInputs(updatedInputs);

        // Also update formData.video_urls
        const updatedUrls = formData.video_urls.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, video_urls: updatedUrls }));
    };

    const updateVideoUrl = (index: number, value: string) => {
        const updatedInputs = [...videoUrlInputs];
        updatedInputs[index] = value;
        setVideoUrlInputs(updatedInputs);

        // Update formData.video_urls
        const updatedUrls = [...formData.video_urls];
        updatedUrls[index] = value.trim();
        setFormData((prev) => ({ ...prev, video_urls: updatedUrls }));
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

        // Validation
        const { title, content, chapter_id, order } = formData;

        if (!title.trim() || !content.trim() || !chapter_id || !order) {
            toasterError("Please fill in all required fields ❌");
            return;
        }

        // Auto-detect lesson type
        const lessonType = detectLessonType();

        // // Validate video_url for video lessons
        // if (
        //     lessonType === "video" &&
        //     formData.video_urls.length === 0 &&
        //     uploadedVideoUrls.length === 0
        // ) {
        //     toasterError(
        //         "Please add at least one video or video URL for video lessons",
        //     );
        //     return;
        // }

        if (
            !uploadedImageUrls.length &&
            !uploadedVideoUrls.length &&
            formData.video_urls.length === 0 && !formData.content.trim()
        ) {
            toasterError("Please add at least one content, image, video, or video URL");
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
                video_urls: formData.video_urls.filter((url) => url),
                resources: formData.resources,
                is_free: formData.is_free,
                images: uploadedImageUrls.filter((url) => url),
                videos: uploadedVideoUrls.filter((url) => url),
            };

            const res = await api.put(`lessons/${Number(lessonId)}`, payload);

            if (res.success) {
                toasterSuccess("Lesson updated successfully", 2000);
                router.push(
                    `/${basePath}/lessons/list?chapter_id=${chapter_id}&course_id=${formData.course_id}`,
                );
            } else {
                toasterError(res.error?.code || "Something went wrong ❌");
            }
        } catch (error) {
            console.error("Lesson update failed", error);
            toasterError("Failed to update lesson ❌");
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

        }
    };

    const lessonTypeDisplay = getLessonTypeDisplay();

    if (loading) {
        return (
            <>
                <Breadcrumb pageName="Edit Lesson" />
                <ShowcaseSection title="Edit Lesson" className="!p-7">
                    <div className="flex items-center justify-center py-20">
                        <div className="loader h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <span className="ml-3 text-gray-600">Loading lesson data...</span>
                    </div>
                </ShowcaseSection>
            </>
        );
    }

    if (!lesson && !loading) {
        return (
            <>
                <Breadcrumb pageName="Edit Lesson" />
                <ShowcaseSection title="Edit Lesson" className="!p-7">
                    <div className="py-20 text-center">
                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                            Lesson not found
                        </h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-300">
                            The lesson you are trying to edit does not exist or you don't have
                            access to it.
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
                        >
                            Go Back
                        </button>
                    </div>
                </ShowcaseSection>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Edit Lesson" />
            <ShowcaseSection title="Edit Lesson" className="!p-7">
                <form onSubmit={handleSubmit}>
                    {/* Auto-detected Lesson Type Display */}
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
                                    {formData.video_urls.length > 0 &&
                                        `🔗 ${formData.video_urls.length} video URL(s) `}
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
                        <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
                            🔗 Video URLs
                        </label>
                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                            Add external video URLs (YouTube, Vimeo, etc.). Each valid URL will show a preview iframe below.
                        </p>
                        <div className="space-y-4">
                            {videoUrlInputs.map((url, index) => (
                                <div key={index} className="rounded-lg border border-stroke p-4 dark:border-dark-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => updateVideoUrl(index, e.target.value)}
                                            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                                            className="dark:bg-boxdark flex-1 rounded-lg border border-stroke px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-3"
                                        />
                                        {videoUrlInputs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVideoUrl(index)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                    {url.trim() && isValidVideoUrl(url.trim()) && (
                                        <div className="relative">
                                            <iframe
                                                src={getEmbedUrl(url.trim()) || undefined}
                                                title={`Video preview ${index + 1}`}
                                                className="w-full h-32 rounded-lg border"
                                                allowFullScreen
                                            ></iframe>
                                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                ✓ Valid
                                            </div>
                                        </div>
                                    )}
                                    {url.trim() && !isValidVideoUrl(url.trim()) && (
                                        <div className="text-red-500 text-sm">
                                            Invalid video URL
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addVideoUrl}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
                        >
                            ➕ Add Another Video URL
                        </button>
                    </div>

                    <div className="mb-5.5">

                        <RichTextEditor
                            label="Lesson Content *"
                            value={formData.content}
                            onChange={(value) => handleChange({ target: { name: 'content', value: value } } as any)}
                            placeholder="Write Lesson content..."
                            minHeight="300px"
                        />
                    </div>

                    {/* Resources Section */}
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

                    {/* Images Section */}
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
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#015379] px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-[#01537969]"
                        >
                            ➕ Add Another Image
                        </button>
                    </div>

                    {/* Videos Section */}
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

                    {/* Free Lesson Toggle */}
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
                                : "Update Lesson"}
                        </button>
                    </div>
                </form>
            </ShowcaseSection>
        </>
    );
};

export default EditLesson;

