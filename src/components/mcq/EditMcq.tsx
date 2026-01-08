"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useApiClient } from "@/lib/api";

const EditMcq = ({ basePath }: { basePath: string }) => {
    const api = useApiClient();

    const router = useRouter();
    const searchParams = useSearchParams();
    const mcqId = searchParams.get("id");
    const chapterId = searchParams.get("chapter_id");
    const courseId = searchParams.get("course_id");
    const courseName = searchParams.get("name");
    const chapterName = searchParams.get("chapter_name");

    const [courses, setCourses] = useState<any[]>([]);
    const [chapters, setChapters] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        question: "",
        options: ["", "", "", ""],
        answer: "",
        course_id: courseId || "",
        chapter_id: chapterId || "",
    });

    const [errors, setErrors] = useState({
        question: "",
        options: ["", "", "", ""],
        answer: "",
        course_id: "",
        chapter_id: "",
    });

    // Fetch courses and initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!mcqId) {
                toasterError("MCQ ID is required");
                router.push(`/${basePath}/mcq`);
                return;
            }

            try {
                setFetching(true);

                // Fetch courses
                const coursesRes = await api.get("course/list?active=true");
                setCourses(coursesRes.data?.data?.courses || []);

                // Fetch MCQ data
                const mcqRes = await api.get(`mcq/${mcqId}`);
                const mcqData = mcqRes.data?.data;

                if (!mcqData) {
                    toasterError("MCQ not found");
                    router.push(`/${basePath}/mcq`);
                    return;
                }

                // Set form data from API response
                setFormData({
                    question: mcqData.question || "",
                    options: mcqData.options || ["", "", "", ""],
                    answer: mcqData.answer || "",
                    course_id: mcqData.course_id?.toString() || courseId || "",
                    chapter_id: mcqData.chapter_id?.toString() || chapterId || "",
                });

                // If we have course_id, fetch chapters for that course
                if (mcqData.course_id) {
                    await fetchChapters(mcqData.course_id.toString());
                }
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
                toasterError("Failed to load MCQ data");
                router.push(`/${basePath}/mcq`);
            } finally {
                setFetching(false);
            }
        };

        fetchInitialData();
    }, [mcqId, courseId, chapterId, router]);

    const fetchChapters = async (courseId: string) => {
        if (!courseId) {
            setChapters([]);
            return;
        }

        try {
            const res = await api.get(`chapter?course_id=${courseId}`);
            setChapters(res.data?.data?.chapters || []);
        } catch (err) {
            console.error("Failed to fetch chapters:", err);
            toasterError("Failed to load chapters");
            setChapters([]);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
        index?: number,
    ) => {
        const { name, value } = e.target;

        // Clear errors when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        if (name === "options" && typeof index === "number") {
            const updatedOptions = [...formData.options];
            updatedOptions[index] = value;

            // Clear option error when user types
            const updatedOptionErrors = [...errors.options];
            if (updatedOptionErrors[index]) {
                updatedOptionErrors[index] = "";
                setErrors((prev) => ({ ...prev, options: updatedOptionErrors }));
            }

            setFormData((prev) => ({ ...prev, options: updatedOptions }));
        } else if (name === "course_id") {
            // When course changes, fetch chapters and reset chapter_id
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                chapter_id: "", // Reset chapter when course changes
            }));
            fetchChapters(value);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            question: "",
            options: ["", "", "", ""],
            answer: "",
            course_id: "",
            chapter_id: "",
        };

        let isValid = true;

        // Validate question
        if (!formData.question.trim()) {
            newErrors.question = "Question is required";
            isValid = false;
        }

        // Validate options
        formData.options.forEach((option, index) => {
            if (!option.trim()) {
                newErrors.options[index] = `Option ${index + 1} is required`;
                isValid = false;
            }
        });

        // Validate answer
        if (!formData.answer.trim()) {
            newErrors.answer = "Correct answer is required";
            isValid = false;
        }

        // Validate course
        if (!formData.course_id) {
            newErrors.course_id = "Please select a course";
            isValid = false;
        }

        // Validate chapter
        if (!formData.chapter_id) {
            newErrors.chapter_id = "Please select a chapter";
            isValid = false;
        }

        // Check for unique options
        const trimmedOptions = formData.options.map((opt) => opt.trim());
        const uniqueOptions = new Set(trimmedOptions);
        if (uniqueOptions.size !== trimmedOptions.length) {
            toasterError("Options must be unique ❌");
            isValid = false;
        }

        // Check if answer matches one of the options
        if (!trimmedOptions.includes(formData.answer.trim())) {
            toasterError("Answer must match one of the options ❌");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                question: formData.question.trim(),
                options: formData.options.map((opt) => opt.trim()),
                answer: formData.answer.trim(),
                course_id: parseInt(formData.course_id),
                chapter_id: parseInt(formData.chapter_id),
            };

            const res = await api.put(`mcq/${mcqId}`, payload);

            if (res?.success) {
                toasterSuccess("MCQ updated successfully! 🎉");
                router.push(
                    `/${basePath}/mcq?course_id=${formData.course_id}&chapter_id=${formData.chapter_id}&name=${courseName}`,
                );
            } else {
                toasterError(res?.error?.code || "Update failed");
            }
        } catch (err: any) {
            console.error("Update failed:", err);
            toasterError(err?.response?.data?.error?.code || "Failed to update MCQ");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <>
                <Breadcrumb pageName="Edit MCQ" />
                <ShowcaseSection title="Edit MCQ">
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                                Loading MCQ data...
                            </p>
                        </div>
                    </div>
                </ShowcaseSection>
            </>
        );
    }

    return (
        <>
            <Breadcrumb
                pageName="Edit MCQ"
                links={[
                    {
                        label: "MCQs",
                        href: `/admin/mcq?course_id=${courseId}&name=${courseName}`,
                    },
                    { label: "Edit MCQ" },
                ]}
            />

            <ShowcaseSection title="Edit MCQ">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <TextAreaGroup
                        label="Question *"
                        name="question"
                        placeholder="Enter the MCQ question"
                        value={formData.question}
                        onChange={handleChange}
                        rows={3}
                    />

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Options *
                        </label>
                        {formData.options.map((option, idx) => (
                            <InputGroup
                                key={idx}
                                label={`Option ${idx + 1}`}
                                name="options"
                                value={option}
                                placeholder={`Enter option ${idx + 1}`}
                                onChange={(e) => handleChange(e, idx)}
                                type="text"
                            />
                        ))}
                    </div>

                    <InputGroup
                        label="Correct Answer *"
                        name="answer"
                        value={formData.answer}
                        placeholder="Enter the correct answer (must match one of the options exactly)"
                        onChange={handleChange}
                        type="text"
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                                Select Course *
                            </label>
                            <select
                                name="course_id"
                                value={formData.course_id}
                                disabled
                                onChange={handleChange}
                                className={`dark:bg-boxdark w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed dark:border-dark-3 ${errors.course_id ? "border-red-500" : "border-stroke"
                                    }`}
                                required
                            >
                                <option value="">-- Select Course --</option>
                                {courses.map((course: any) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title} {!course.is_active && "(Inactive)"}
                                    </option>
                                ))}
                            </select>
                            {errors.course_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.course_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                                Select Chapter *
                            </label>
                            <select
                                name="chapter_id"
                                value={formData.chapter_id}
                                onChange={handleChange}
                                disabled
                                className="dark:bg-boxdark ${ w-full rounded-lg border border-stroke px-4 py-2 text-sm opacity-50 outline-none focus:border-primary disabled:cursor-not-allowed dark:border-dark-3"
                                required
                            >
                                <option value="">-- Select Chapter --</option>
                                {chapters.map((chapter: any) => (
                                    <option key={chapter.id} value={chapter.id}>
                                        {chapter.title} (Order: {chapter.order})
                                    </option>
                                ))}
                            </select>
                            {errors.chapter_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.chapter_id}</p>
                            )}
                            {formData.course_id && chapters.length === 0 && (
                                <p className="mt-1 text-sm text-yellow-600">
                                    No chapters available for this course
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/${basePath}/mcq?course_id=${courseId}&name=${courseName}`,
                                )
                            }
                            className="rounded-lg border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white sm:px-8"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="hover:bg-[#1A6A93] hover:bg-[#02517b]-dark flex items-center justify-center rounded-lg bg-[#1A6A93] hover:bg-[#02517b] px-6 py-3 font-medium text-white disabled:opacity-50 sm:px-8"
                        >
                            {loading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update MCQ"
                            )}
                        </button>
                    </div>
                </form>
            </ShowcaseSection>
        </>
    );
};

export default EditMcq;
