"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Code, Save } from "lucide-react";
import api from "@/lib/api";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";

export default function UpdateCodingQuestion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  const id = searchParams.get("question_id");
  console.log("[[[[[[[[[[[[[[[[[[object]]]]]]]]]]]]]]]]]]",id)
  const mode = searchParams.get("mode");
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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

  // Fetch existing question data
  useEffect(() => {
// Update the fetchQuestionData function - Line ~57



const fetchQuestionData = async () => {
  if (!id) return;
  
  setFetchLoading(true);
  try {
    console.log(`🔍 Fetching question data for ID-----------: ${id}`);
    
  
    const response = await api.get(`coding/code/${id}`)  // ✅ Correct
    console.log("📡 Full API Response:", response);
    
    if (response.data && response.data.success) {
      const questionData = response.data.data;
      console.log("✅ Question data loaded:", questionData);
      
      if (!questionData) {
        toasterError("No question data found", 3000, "fetch-error");
        return;
      }
      
      // Populate form with existing data
      setFormData({
        title: questionData.title || "",
        description: questionData.description || "",
        difficulty: questionData.difficulty || "medium",
        chapter_id: questionData.chapter_id?.toString() || "",
        time_limit: questionData.time_limit || 2000,
        memory_limit: questionData.memory_limit || 128000,
        hints: questionData.hints && Array.isArray(questionData.hints) && questionData.hints.length > 0 
          ? questionData.hints 
          : [""],
        tags: questionData.tags && Array.isArray(questionData.tags) && questionData.tags.length > 0 
          ? questionData.tags 
          : [""],
        allowed_languages: questionData.allowed_languages || ["javascript", "python", "java", "cpp"],
        starter_code: questionData.starter_code || {
          javascript: "// Write your solution here",
          python: "# Write your solution here",
          java: "// Write your solution here",
          cpp: "// Write your solution here"
        },
        solution_code: questionData.solution_code || {
          javascript: "// Solution code",
          python: "# Solution code",
          java: "// Solution code",
          cpp: "// Solution code"
        }
      });

      // ✅ Load test cases from JSONB field
      if (questionData.test_cases && Array.isArray(questionData.test_cases) && questionData.test_cases.length > 0) {
        setTestCases(questionData.test_cases.map((tc: any, index: number) => ({
          id: tc.id || index + 1,
          input: tc.input || "",
          expected_output: tc.expected_output || "",
          is_sample: tc.is_sample || false
        })));
      } else {
        setTestCases([{ id: 1, input: "", expected_output: "", is_sample: true }]);
      }

      // ✅ Optionally load chapter data if included in response
      if (questionData.Chapter) {
        console.log("📚 Chapter info:", questionData.Chapter);
      }

      // ✅ Optionally load course data if included in response
      if (questionData.Course) {
        console.log("📖 Course info:", questionData.Course);
      }

    } else {
      toasterError(response.data?.message || "Failed to load question data", 3000, "fetch-error");
    }
  } catch (error: any) {
    console.error("❌ Failed to fetch question data:", error);
    
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      
      const status = error.response.status;
      const errorMessage = error.response.data?.message || "Failed to load question data";
      
      if (status === 404) {
        toasterError("Question not found. It may have been deleted.", 3000, "not-found-error");
      } else if (status === 401) {
        toasterError("You are not authorized. Please login again.", 3000, "auth-error");
      } else {
        toasterError(errorMessage, 3000, "fetch-error");
      }
    } else if (error.request) {
      toasterError("Network error. Please check your connection.", 3000, "network-error");
    } else {
      toasterError(error?.message || "An unexpected error occurred.", 3000, "unknown-error");
    }
  } finally {
    setFetchLoading(false);
  }
};

    if (id && mode === "edit") {
      fetchQuestionData();
    } else {
      setFetchLoading(false);
    }
  }, [id, mode, courseId, router]);

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

  const updateTestCase = (id: number, field: string, value: string | boolean) => {
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
    
    if (!courseId || !formData.chapter_id || !id) {
      toasterError("Course, chapter, and question ID are required", 3000, "validation-error");
      return;
    }

    if (testCases.some(tc => !tc.input.trim() || !tc.expected_output.trim())) {
      toasterError("All test cases must have input and expected output", 3000, "validation-error");
      return;
    }

    if (formData.allowed_languages.length === 0) {
      toasterError("At least one programming language must be selected", 3000, "validation-error");
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        course_id: parseInt(courseId),
        chapter_id: parseInt(formData.chapter_id),
        test_cases: testCases.map((tc, index) => ({
          id: tc.id,
          input: tc.input.trim(),
          expected_output: tc.expected_output.trim(),
          is_sample: tc.is_sample || false
        })),
        hints: formData.hints.filter(hint => hint.trim() !== ""),
        tags: formData.tags.filter(tag => tag.trim() !== "")
      };

      console.log("Updating question data:", submissionData);

      // Update endpoint - using PUT method with question ID
      const response = await api.put(`coding/${id}`, submissionData);
      
      if (response.success || response.status === 200) {
        toasterSuccess("Coding question updated successfully!", 3000, "update-success");
        
             router.push(`/code/code-questions-page?course_id=${courseId}`);
        
      } else {
        toasterError(response.error?.message || response.message || "Failed to update question", 3000, "update-error");
      }
    } catch (error: any) {
      console.log("Error updating coding question:", error);
      
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error || "Failed to update coding question";
        
        if (status === 401) {
          toasterError("You are not authorized to perform this action. Please login again.", 3000, "auth-error");
        } else if (status === 403) {
          toasterError("You don't have permission to update this coding question.", 3000, "permission-error");
        } else if (status === 404) {
          toasterError("Question not found or API endpoint not available.", 3000, "not-found-error");
        } else {
          toasterError(errorMessage, 3000, "update-error");
        }
      } else if (error.request) {
        toasterError("Network error. Please check your connection.", 3000, "network-error");
      } else {
        toasterError("An unexpected error occurred.", 3000, "unknown-error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Validation checks
  if (!courseId || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Course ID and Question ID are required</div>
      </div>
    );
  }

  if (mode !== "edit") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Invalid mode. Expected 'edit' mode.</div>
      </div>
    );
  }

  // Loading state while fetching question data
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading question data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
             onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Coding Questions
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Code className="inline mr-3" size={32} />
            Update Coding Question
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Modify the existing coding challenge
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
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save size={16} className="mr-2" />
              {loading ? "Updating..." : "Update Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}