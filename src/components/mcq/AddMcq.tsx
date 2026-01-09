"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useApiClient } from "@/lib/api";

const AddMcq = ({ basePath }: { basePath: string }) => {
    const api = useApiClient();

    const router = useRouter();
    const searchParams = useSearchParams();
    const chapterId = searchParams.get("chapter_id");
    const courseId = searchParams.get("course_id");

    const [courses, setCourses] = useState<any[]>([]);
    const [chapter, setChapter] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        question: "",
        options: ["", "", "", ""],
        answer: "", // This will store the index as string (e.g., "0", "1", "2", "3")
        course_id: courseId ?? "",
        chapter_id: chapterId ?? "",
    });

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

    const handleChange = (e: any, index?: number) => {
        const { name, value } = e.target;

        if (name === "options" && typeof index === "number") {
            const updatedOptions = [...formData.options];
            updatedOptions[index] = value;
            setFormData({ ...formData, options: updatedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const trimmedQuestion = formData.question.trim();
        const trimmedOptions = formData.options.map((opt) => opt.trim());

        // ✅ VALIDATION: Check required fields
        if (!trimmedQuestion) {
            toasterError("Question is required ❌");
            setLoading(false);
            return;
        }

        if (trimmedOptions.some((opt) => !opt)) {
            toasterError("All 4 options must be filled ❌");
            setLoading(false);
            return;
        }

        if (!formData.answer) {
            toasterError("Please select the correct answer ❌");
            setLoading(false);
            return;
        }

        if (!formData.course_id) {
            toasterError("Please select a course ❌");
            setLoading(false);
            return;
        }

        if (!formData.chapter_id) {
            toasterError("Please select a chapter ❌");
            setLoading(false);
            return;
        }

        // ✅ VALIDATION: Check for duplicate options
        const uniqueOptions = new Set(trimmedOptions);
        if (uniqueOptions.size !== trimmedOptions.length) {
            toasterError("Options must be unique ❌");
            setLoading(false);
            return;
        }

        try {
            // ✅ FIXED: Convert answer to number (index)
            const payload = {
                question: trimmedQuestion,
                options: trimmedOptions,
                answer: parseInt(formData.answer), // Convert to number (0, 1, 2, 3)
                course_id: parseInt(formData.course_id),
                chapter_id: parseInt(formData.chapter_id),
            };

            console.log("Sending payload:", payload); // For debugging

            const res = await api.post("mcq/create-mcq", payload);

            if (res?.success) {
                toasterSuccess("MCQ created successfully! ✅");
                router.push(
                    `/${basePath}/mcq?chapter_id=${formData.chapter_id}&course_id=${formData.course_id}`,
                );
            } else {
                toasterError(res.error?.message || "Failed to create MCQ ❌");
            }
        } catch (err: any) {
            console.error("MCQ creation failed:", err);
            toasterError(err.response?.data?.error || "Failed to create MCQ ❌");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Check if all options are filled to enable answer selection
    const canSelectAnswer = formData.options.every((opt) => opt.trim() !== "");

    return (
        <>
            <Breadcrumb pageName="Create MCQ" />
            <ShowcaseSection title="Add MCQ">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <TextAreaGroup
                        label="Question"
                        name="question"
                        placeholder="Enter the MCQ question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        rows={3}
                    />

                    {/* Options Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Options *
                        </label>
                        {formData.options.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1A6A93] hover:bg-[#02517b] text-xs font-medium text-white">
                                    {idx + 1}
                                </div>
                                <InputGroup
                                    label={`Option ${idx + 1}`}
                                    name="options"
                                    value={option}
                                    placeholder={`Enter option ${idx + 1}`}
                                    onChange={(e) => handleChange(e, idx)}
                                    type="text"
                                    required
                                    className="flex-1"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Correct Answer Selection */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-white">
                            Select Correct Answer *
                        </label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {formData.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, answer: idx.toString() })
                                    }
                                    disabled={!option.trim()}
                                    className={`rounded-lg border p-3 text-center transition-colors ${formData.answer === idx.toString()
                                        ? "border-primary bg-[#1A6A93] hover:bg-[#02517b] text-white"
                                        : "border-stroke bg-transparent text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
                                        } ${!option.trim()
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer"
                                        }`}
                                >
                                    <div className="text-sm font-medium">Option {idx + 1}</div>
                                    <div className="mt-1 truncate text-xs">
                                        {option.trim() || "Not set"}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {!canSelectAnswer && (
                            <p className="mt-2 text-sm text-orange-600">
                                Please fill all options first to select the correct answer
                            </p>
                        )}

                        {formData.answer && (
                            <p className="mt-2 text-sm text-green-600">
                                Selected:{" "}
                                <strong>Option {parseInt(formData.answer) + 1}</strong> - "
                                {formData.options[parseInt(formData.answer)]}"
                            </p>
                        )}
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                            Course *
                        </label>
                        <select
                            name="course_id"
                            value={formData.course_id}
                            onChange={handleChange}
                            className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-dark-3"
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

                    {/* Chapter Selection */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                            Chapter *
                        </label>
                        <select
                            name="chapter_id"
                            value={formData.chapter_id}
                            onChange={handleChange}
                            className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-dark-3"
                            required
                        >
                            <option value="">-- Select Chapter --</option>
                            {chapter && <option value={chapter.id}>{chapter.title}</option>}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            className="rounded-lg border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.answer}
                            className="flex items-center gap-2 rounded-lg bg-[#1A6A93] hover:bg-[#02517b] px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Creating...
                                </>
                            ) : (
                                "Create MCQ"
                            )}
                        </button>
                    </div>
                </form>
            </ShowcaseSection>
        </>
    );
};

export default AddMcq;
