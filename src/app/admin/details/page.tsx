"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, PlayCircle, Lock } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

// Types
interface Lesson {
  id: string;
  name: string;
  duration: string;
  videoUrl?: string;
  completed: boolean;
}

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  attempted: boolean;
  passed: boolean;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
  mcqs: MCQ[];
  completed: boolean;
  locked: boolean;
}

interface CourseProgress {
  currentChapter: string;
  completedChapters: string[];
  completedLessons: string[];
  passedMCQs: string[];
}

export default function Page() {
  const [openSections, setOpenSections] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [currentMCQChapter, setCurrentMCQChapter] = useState<Chapter | null>(
    null,
  );
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [courseProgress, setCourseProgress] = useState<CourseProgress>({
    currentChapter: "chapter1",
    completedChapters: [],
    completedLessons: [],
    passedMCQs: [],
  });

  // Sample course data
  const chapters: Chapter[] = [
    {
      id: "chapter1",
      title: "Section 1: Understanding ReactJS",
      lessons: [
        {
          id: "lesson1-1",
          name: "Introduction",
          duration: "12 min",
          videoUrl: "/videos/intro.mp4",
          completed: false,
        },
        {
          id: "lesson1-2",
          name: "Why React?",
          duration: "21 min",
          videoUrl: "/videos/why-react.mp4",
          completed: false,
        },
      ],
      mcqs: [
        {
          id: "mcq1-1",
          question: "What is React?",
          options: [
            "A programming language",
            "A JavaScript library for building user interfaces",
            "A database management system",
            "An operating system",
          ],
          correctAnswer: 1,
          attempted: false,
          passed: false,
        },
        {
          id: "mcq1-2",
          question: "Which company maintains React?",
          options: ["Google", "Facebook", "Microsoft", "Amazon"],
          correctAnswer: 1,
          attempted: false,
          passed: false,
        },
      ],
      completed: false,
      locked: false,
    },
    {
      id: "chapter2",
      title: "Section 2: ReactJs As A Service",
      lessons: [
        {
          id: "lesson2-1",
          name: "React in Action",
          duration: "3 min",
          videoUrl: "/videos/react-action.mp4",
          completed: false,
        },
      ],
      mcqs: [
        {
          id: "mcq2-1",
          question: "What is JSX?",
          options: [
            "A new programming language",
            "A syntax extension for JavaScript",
            "A CSS framework",
            "A testing library",
          ],
          correctAnswer: 1,
          attempted: false,
          passed: false,
        },
      ],
      completed: false,
      locked: true,
    },
    {
      id: "chapter3",
      title: "Section 3: React Hooks And Context API",
      lessons: [
        {
          id: "lesson3-1",
          name: "Using Hooks",
          duration: "1 min",
          videoUrl: "/videos/hooks.mp4",
          completed: false,
        },
      ],
      mcqs: [
        {
          id: "mcq3-1",
          question: "Which hook is used for state management?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          correctAnswer: 1,
          attempted: false,
          passed: false,
        },
      ],
      completed: false,
      locked: true,
    },
  ];

  // Initialize open sections
  useEffect(() => {
    setOpenSections(chapters.map(() => true));

    // Load progress from localStorage
    const savedProgress = localStorage.getItem("courseProgress");
    if (savedProgress) {
      setCourseProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("courseProgress", JSON.stringify(courseProgress));
    updateChaptersStatus();
  }, [courseProgress]);

  // Update chapter completion and locking status
  const updateChaptersStatus = () => {
    chapters.forEach((chapter) => {
      // Check if all lessons are completed
      const allLessonsCompleted = chapter.lessons.every((lesson) =>
        courseProgress.completedLessons.includes(lesson.id),
      );

      // Check if all MCQs are passed
      const allMCQsPassed = chapter.mcqs.every((mcq) =>
        courseProgress.passedMCQs.includes(mcq.id),
      );

      // Chapter is completed if both conditions are met
      chapter.completed = allLessonsCompleted && allMCQsPassed;

      // Chapter is locked if it's not the first chapter and previous chapter isn't completed
      if (chapter.id !== "chapter1") {
        const prevChapter = chapters.find(
          (ch) =>
            ch.id ===
            `chapter${parseInt(chapter.id.replace("chapter", "")) - 1}`,
        );
        chapter.locked = !prevChapter?.completed;
      }
    });
  };

  const toggleSection = (index: number) => {
    const newOpenSections = [...openSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenSections(newOpenSections);
  };

  const handleLessonClick = (chapter: Chapter, lesson: Lesson) => {
    if (chapter.locked) return;

    setCurrentVideo(lesson.videoUrl || "");

    // Mark lesson as completed when video ends (simulated)
    setTimeout(() => {
      if (!courseProgress.completedLessons.includes(lesson.id)) {
        setCourseProgress((prev) => ({
          ...prev,
          completedLessons: [...prev.completedLessons, lesson.id],
        }));
      }
    }, 1000);
  };

  const handleChapterComplete = (chapter: Chapter) => {
    // Check if all lessons are completed
    const allLessonsCompleted = chapter.lessons.every((lesson) =>
      courseProgress.completedLessons.includes(lesson.id),
    );

    if (allLessonsCompleted && !chapter.completed) {
      setCurrentMCQChapter(chapter);
      setCurrentMCQIndex(0);
      setShowMCQModal(true);
    }
  };

  const handleMCQAnswer = (selectedOption: number) => {
    if (!currentMCQChapter) return;

    const currentMCQ = currentMCQChapter.mcqs[currentMCQIndex];
    const isCorrect = selectedOption === currentMCQ.correctAnswer;

    // Update MCQ attempt
    const updatedMCQs = currentMCQChapter.mcqs.map((mcq, index) =>
      index === currentMCQIndex
        ? {
            ...mcq,
            attempted: true,
            passed: isCorrect,
            userAnswer: selectedOption,
          }
        : mcq,
    );

    // Update progress
    if (isCorrect && !courseProgress.passedMCQs.includes(currentMCQ.id)) {
      setCourseProgress((prev) => ({
        ...prev,
        passedMCQs: [...prev.passedMCQs, currentMCQ.id],
      }));
    }

    // Move to next MCQ or close modal if all MCQs are attempted
    if (currentMCQIndex < currentMCQChapter.mcqs.length - 1) {
      setCurrentMCQIndex((prev) => prev + 1);
    } else {
      // Check if all MCQs are passed
      const allMCQsPassed = updatedMCQs.every((mcq) => mcq.passed);

      if (
        allMCQsPassed &&
        !courseProgress.completedChapters.includes(currentMCQChapter.id)
      ) {
        setCourseProgress((prev) => ({
          ...prev,
          completedChapters: [...prev.completedChapters, currentMCQChapter.id],
          currentChapter: `chapter${parseInt(currentMCQChapter.id.replace("chapter", "")) + 1}`,
        }));
      }

      setShowMCQModal(false);
      setCurrentMCQChapter(null);
    }
  };

  const tabs = [
    "Overview",
    // "Notes",
    // "Announcements",
    "Reviews",
    // "Learning tools",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">
          React Masterclass: From Zero to Hero
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <button className="hover:text-gray-300">Share</button>
          <button className="hover:text-gray-300">Leave a rating</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col lg:flex-row">
        {/* Left: Video + Tabs + Content */}
        <div className="w-full flex-1 overflow-y-auto">
          {/* Video */}
          <div className="aspect-video w-full bg-black">
            <video
              className="h-full w-full object-cover"
              controls
              poster="https://placehold.co/1200x700?text=Course+Video"
              src={currentVideo}
            >
              Your browser does not support HTML video.
            </video>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-start gap-4 border-b border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-3 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 dark:bg-gray-900">
            {activeTab === "Overview" && (
              <div>
                <h1 className="mb-2 text-2xl font-semibold">
                  React ka Asli Raaz: Zero se Hero tak ka Safar Hinglish mein!
                </h1>
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">⭐ 2.5</span>
                  <span>418 Students</span>
                  <span>39 mins Total</span>
                </div>
                <p className="max-w-3xl text-gray-700 dark:text-gray-300">
                  Learn ReactJS from scratch to advanced level in Hinglish! This
                  course covers the entire journey — from understanding
                  components and hooks to building industrial-grade projects.
                </p>
              </div>
            )}
            {/* {activeTab === "Notes" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">My Notes</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  You can add your personal notes here for quick revision later.
                </p>
              </div>
            )} */}
            {activeTab === "Announcements" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Announcements</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Stay tuned for the latest updates and news about the course!
                </p>
              </div>
            )}
            {activeTab === "Reviews" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Student Reviews</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  ⭐⭐⭐⭐☆ – "Very detailed and easy to understand course!"
                </p>
              </div>
            )}
            {activeTab === "Learning tools" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Learning Tools</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Access additional resources, exercises, and code snippets
                  here.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 py-12 text-white">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
              {/* Logo & Description */}
              <div>
                <h2 className="mb-2 text-2xl font-bold">YourLogo</h2>
                <p className="text-gray-400">
                  We provide the best services and solutions to help your
                  business grow.
                </p>
                <div className="mt-4 flex space-x-4">
                  <a href="#" className="hover:text-blue-500">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="hover:text-blue-400">
                    <FaTwitter />
                  </a>
                  <a href="#" className="hover:text-pink-500">
                    <FaInstagram />
                  </a>
                  <a href="#" className="hover:text-blue-600">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Contact Us</h3>
                <p className="text-gray-400">123 Main Street, City, Country</p>
                <p className="mt-2 text-gray-400">Email: info@example.com</p>
                <p className="mt-2 text-gray-400">Phone: +123 456 7890</p>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Subscribe</h3>
                <p className="mb-4 text-gray-400">
                  Get our latest updates and offers.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-l-md px-4 py-2 text-gray-900 focus:outline-none"
                  />
                  <button className="rounded-r-md bg-orange-500 px-4 py-2 transition hover:bg-orange-600">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} YourLogo. All rights reserved.
            </div>
          </footer>
        </div>

        {/* Right: Accordion */}
        <div className="mt-6 w-full lg:mt-0 lg:h-[calc(100vh-72px)] lg:w-1/3 lg:pl-4">
          <div className="fixed top-[12%] h-full overflow-y-auto border-l border-gray-300 bg-transparent p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Course Content</h2>
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="mb-2 border-b border-gray-300 dark:border-gray-700"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="flex w-full items-center justify-between py-2 text-left font-medium transition hover:text-blue-500"
                >
                  <div className="flex items-center gap-2">
                    {chapter.locked && <Lock size={16} />}
                    <span>{chapter.title}</span>
                    {chapter.completed && (
                      <span className="text-xs text-green-500">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  {openSections[index] ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openSections[index] && (
                  <div className="space-y-1 pb-2 pl-4">
                    {/* Lessons */}
                    {chapter.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() =>
                          !chapter.locked && handleLessonClick(chapter, lesson)
                        }
                        className={`flex cursor-pointer items-center justify-between text-sm ${
                          chapter.locked
                            ? "cursor-not-allowed text-gray-400"
                            : courseProgress.completedLessons.includes(
                                  lesson.id,
                                )
                              ? "text-green-500 hover:text-green-600"
                              : "text-gray-700 hover:text-blue-500 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <PlayCircle size={14} />
                          <span>{lesson.name}</span>
                          {courseProgress.completedLessons.includes(
                            lesson.id,
                          ) && <span className="text-xs">✓</span>}
                        </div>
                        <span>{lesson.duration}</span>
                      </div>
                    ))}

                    {/* MCQ Section */}
                    <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Chapter MCQs
                        </span>
                        {chapter.locked ? (
                          <span className="text-xs text-gray-400">Locked</span>
                        ) : chapter.lessons.every((lesson) =>
                            courseProgress.completedLessons.includes(lesson.id),
                          ) ? (
                          <button
                            onClick={() => handleChapterComplete(chapter)}
                            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                          >
                            Attempt MCQs
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Complete lessons first
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {
                          chapter.mcqs.filter((mcq) =>
                            courseProgress.passedMCQs.includes(mcq.id),
                          ).length
                        }{" "}
                        of {chapter.mcqs.length} passed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MCQ Modal */}
      {showMCQModal && currentMCQChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">
              MCQ {currentMCQIndex + 1} of {currentMCQChapter.mcqs.length}
            </h3>
            <p className="mb-4">
              {currentMCQChapter.mcqs[currentMCQIndex].question}
            </p>
            <div className="space-y-2">
              {currentMCQChapter.mcqs[currentMCQIndex].options.map(
                (option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMCQAnswer(index)}
                    className="w-full rounded border border-gray-300 p-3 text-left transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Progress: {currentMCQIndex + 1} / {currentMCQChapter.mcqs.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
