"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Code } from "lucide-react";
import api from "@/lib/api";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";

export default function AddCodingQuestion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    chapter_id: "",
    time_limit: 2000,
    memory_limit: 128000,
    hints: [""],
    tags: [""],
    allowed_languages: ["javascript", "python", "java", "cpp"],
    starter_code: {
      javascript: "// Write your solution here",
      python: "# Write your solution here",
      java: "// Write your solution here",
      cpp: "// Write your solution here"
    },
    solution_code: {
      javascript: "// Solution code",
      python: "# Solution code",
      java: "// Solution code",
      cpp: "// Solution code"
    }
  });

  const [testCases, setTestCases] = useState([
    { id: 1, input: "", expected_output: "", is_sample: true }
  ]);

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "scala", label: "Scala" },
    { value: "csharp", label: "C#" }
  ];

  // Fetch chapters for the course
  useEffect(() => {
    const fetchChapters = async () => {
      if (!courseId) return;
      
      try {
        const res = await api.get(`chapter/course/?course_id=${courseId}`);
        if (res.success) {
          setChapters(res.data?.data?.data?.chapters || []);
        }
      } catch (err) {
        console.log("Failed to fetch chapters:", err);
      }
    };

    fetchChapters();
  }, [courseId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStarterCodeChange = (language: string, code: string) => {
    setFormData(prev => ({
      ...prev,
      starter_code: {
        ...prev.starter_code,
        [language]: code
      }
    }));
  };

  const handleSolutionCodeChange = (language: string, code: string) => {
    setFormData(prev => ({
      ...prev,
      solution_code: {
        ...prev.solution_code,
        [language]: code
      }
    }));
  };

  const addTestCase = () => {
    setTestCases(prev => [
      ...prev,
      { id: Date.now(), input: "", expected_output: "", is_sample: false }
    ]);
  };

  const removeTestCase = (id: number) => {
    if (testCases.length > 1) {
      setTestCases(prev => prev.filter(tc => tc.id !== id));
    }
  };

  const updateTestCase = (id: number, field: string, value: string) => {
    setTestCases(prev => prev.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const addHint = () => {
    setFormData(prev => ({
      ...prev,
      hints: [...prev.hints, ""]
    }));
  };

  const removeHint = (index: number) => {
    if (formData.hints.length > 1) {
      setFormData(prev => ({
        ...prev,
        hints: prev.hints.filter((_, i) => i !== index)
      }));
    }
  };

  const updateHint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.map((hint, i) => i === index ? value : hint)
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, ""]
    }));
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index)
      }));
    }
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => {
      const currentLanguages = [...prev.allowed_languages];
      const index = currentLanguages.indexOf(language);
      
      if (index > -1) {
        currentLanguages.splice(index, 1);
      } else {
        currentLanguages.push(language);
      }
      
      return {
        ...prev,
        allowed_languages: currentLanguages
      };
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!courseId || !formData.chapter_id) {
    toasterError("Course and chapter are required", 3000, "id");
    return;
  }

  if (testCases.some(tc => !tc.input.trim() || !tc.expected_output.trim())) {
    toasterError("All test cases must have input and expected output", 3000, "id");
    return;
  }

  // Validate that at least one language is selected
  if (formData.allowed_languages.length === 0) {
    toasterError("At least one programming language must be selected", 3000, "id");
    return;
  }

  setLoading(true);

  try {
    const submissionData = {
      ...formData,
      course_id: parseInt(courseId), // Ensure it's a number
      chapter_id: parseInt(formData.chapter_id), // Ensure it's a number
      test_cases: testCases.map((tc, index) => ({
        id: index + 1, // Add sequential IDs for test cases
        input: tc.input.trim(),
        expected_output: tc.expected_output.trim(),
        is_sample: tc.is_sample || false
      })),
      hints: formData.hints.filter(hint => hint.trim() !== ""),
      tags: formData.tags.filter(tag => tag.trim() !== "")
    };

    console.log("Submitting data:", submissionData); // Debug log

    // The correct endpoint path based on your backend routes
    const response = await api.post("coding/createquestion/code", submissionData);
    
    if (response.success || response.status === 200) {
      toasterSuccess("Coding question created successfully!", 3000, "id");
      // Redirect to coding questions list instead of the same page
      // router.push(`coding/questions?course_id=${courseId}`);
    } else {
      toasterError(response.error?.message || response.message || "Failed to create question", 3000, "id");
    }
  } catch (error: any) {
    console.log("Error creating coding question:", error);
    
    // Handle different types of errors
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message || error.response.data?.error || "Failed to create coding question";
      
      if (status === 401) {
        toasterError("You are not authorized to perform this action. Please login again.", 3000, "id");
      } else if (status === 403) {
        toasterError("You don't have permission to create coding questions.", 3000, "id");
      } else if (status === 404) {
        toasterError("API endpoint not found. Please check the server configuration.", 3000, "id");
      } else {
        toasterError(errorMessage, 3000, "id");
      }
    } else if (error.request) {
      toasterError("Network error. Please check your connection.", 3000, "id");
    } else {
      toasterError("An unexpected error occurred.", 3000, "id");
    }
  } finally {
    setLoading(false);
  }
};

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Course ID is required</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/coding/createquestion/?course_id=${courseId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Coding Questions
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Code className="inline mr-3" size={32} />
            Add New Coding Question
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a new coding challenge for your students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter question title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Describe the problem statement, constraints, and requirements..."
                />
              </div>

              {/* Chapter Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter *
                </label>
                <select
                  required
                  value={formData.chapter_id}
                  onChange={(e) => handleInputChange("chapter_id", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title} (Order: {chapter.order})
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange("difficulty", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Right Column - Configuration */}
            <div className="space-y-6">
              {/* Allowed Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allowed Languages *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {languageOptions.map((lang) => (
                    <label key={lang.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allowed_languages.includes(lang.value)}
                        onChange={() => handleLanguageToggle(lang.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{lang.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time and Memory Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Limit (ms)
                  </label>
                  <input
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => handleInputChange("time_limit", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Memory Limit (KB)
                  </label>
                  <input
                    type="number"
                    value={formData.memory_limit}
                    onChange={(e) => handleInputChange("memory_limit", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Hints */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hints
                  </label>
                  <button
                    type="button"
                    onClick={addHint}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    <Plus size={16} className="inline mr-1" />
                    Add Hint
                  </button>
                </div>
                {formData.hints.map((hint, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={`Hint ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      disabled={formData.hints.length === 1}
                      className="px-3 py-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    <Plus size={16} className="inline mr-1" />
                    Add Tag
                  </button>
                </div>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={`Tag ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      disabled={formData.tags.length === 1}
                      className="px-3 py-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Cases Section */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Test Cases *
              </h3>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <Plus size={16} className="mr-1" />
                Add Test Case
              </button>
            </div>

            {testCases.map((testCase, index) => (
              <div key={testCase.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Test Case {index + 1} {testCase.is_sample && "(Sample)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTestCase(testCase.id)}
                    disabled={testCases.length === 1}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Input
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={testCase.input}
                      onChange={(e) => updateTestCase(testCase.id, "input", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder="Test input..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expected Output
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={testCase.expected_output}
                      onChange={(e) => updateTestCase(testCase.id, "expected_output", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder="Expected output..."
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={testCase.is_sample}
                      onChange={(e) => updateTestCase(testCase.id, "is_sample", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Show this as sample test case to students
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Starter Code Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Starter Code
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languageOptions.map((lang) => (
                formData.allowed_languages.includes(lang.value) && (
                  <div key={lang.value} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {lang.label}
                    </label>
                    <textarea
                      rows={6}
                      value={formData.starter_code[lang.value] || ""}
                      onChange={(e) => handleStarterCodeChange(lang.value, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white font-mono text-sm"
                      placeholder={`${lang.label} starter code...`}
                    />
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Solution Code Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Solution Code
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languageOptions.map((lang) => (
                formData.allowed_languages.includes(lang.value) && (
                  <div key={lang.value} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {lang.label}
                    </label>
                    <textarea
                      rows={6}
                      value={formData.solution_code[lang.value] || ""}
                      onChange={(e) => handleSolutionCodeChange(lang.value, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white font-mono text-sm"
                      placeholder={`${lang.label} solution code...`}
                    />
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`coding-questions?course_id=${courseId}`)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Coding Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}