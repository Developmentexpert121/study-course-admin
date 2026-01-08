"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchActiveCourses,
  selectAllCourses,
  selectCoursesLoading,
  selectCoursesError,
} from "@/store/slices/homepage/homepage";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import {
  Search,
  Filter,
  X,
  Star,
  Clock,
  PlayCircle,
  BookOpen,
  ChevronDown,
  Grid3X3,
  List,
} from "lucide-react";
import { getDecryptedItem } from "@/utils/storageHelper";
import { clearLogoutState } from "@/store/slices/adminslice/adminlogout";

const CoursesPage = () => {

  console.log("jffabf")
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const name: any = getDecryptedItem("name");
  const role: any = getDecryptedItem("role");

  const courses = useSelector(selectAllCourses);
  const loading = useSelector(selectCoursesLoading);

  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract categories from actual course data
  const categories = useMemo(() => {
    if (!courses || courses.length === 0) return ["DESIGNING", "FULL STACK"];

    const uniqueCategories = Array.from(
      new Set(courses.map((course) => course.category).filter(Boolean)),
    );
    return uniqueCategories.length > 0
      ? uniqueCategories
      : ["DESIGNING", "FULL STACK"];
  }, [courses]);

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const prices = ["Free", "Paid"];

  useEffect(() => {
    dispatch(fetchActiveCourses());
  }, [dispatch]);

  // Filter and sort courses - UPDATED: Using actual API fields
  // Filter and sort courses - UPDATED: Using actual API fields with proper array handling
  const filteredCourses = useMemo(() => {
    let filtered = courses ? [...courses] : []; // Create a copy of the array

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter - UPDATED: Using category field from API
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((course) =>
        selectedCategories.includes(course.category || ""),
      );
    }

    // Price filter - UPDATED: Using price_type and price fields
    if (priceFilter === "free") {
      filtered = filtered.filter(
        (course) => course.price_type === "free" || Number(course.price) === 0,
      );
    } else if (priceFilter === "paid") {
      filtered = filtered.filter(
        (course) => course.price_type === "paid" && Number(course.price) > 0,
      );
    }

    // Level filter - DISABLED: No level field in API
    if (levelFilter !== "all") {
      // Since there's no level field in the API, we'll skip this filter
      // filtered = filtered.filter((course) => course.level === levelFilter);
    }

    // Rating filter - UPDATED: Using ratings field
    if (ratingFilter > 0) {
      filtered = filtered.filter(
        (course) => (course.ratings || 0) >= ratingFilter,
      );
    }

    // Sort courses - UPDATED: Create a new array for sorting to avoid mutation issues
    const sortedCourses = [...filtered]; // Create a copy for sorting

    switch (sortBy) {
      case "newest":
        sortedCourses.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;
      case "rating":
        sortedCourses.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      case "price-low":
        sortedCourses.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0),
        );
        break;
      case "price-high":
        sortedCourses.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0),
        );
        break;
      case "popular":
      default:
        // Using ID as fallback for popularity
        sortedCourses.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    return sortedCourses;
  }, [
    courses,
    searchQuery,
    selectedCategories,
    priceFilter,
    levelFilter,
    ratingFilter,
    sortBy,
  ]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceFilter("all");
    setLevelFilter("all");
    setRatingFilter(0);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Your existing email submission logic
  };

  const activeFiltersCount = [
    selectedCategories.length,
    priceFilter !== "all" ? 1 : 0,
    levelFilter !== "all" ? 1 : 0,
    ratingFilter > 0 ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header name={name} role={role} />

      {/* Compact Hero Section */}
      {/* <section
        className="relative overflow-hidden py-12 text-white md:py-16 lg:py-20"
        style={{
          backgroundImage: "url('/images/img1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#02517b]/50 via-[#036b9b]/40 to-[#048bbf]/30"></div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <span className="text-xs font-medium md:text-sm">
                🎓 {courses?.length || 0}+ Courses Available
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Learn Without
              <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Limits
              </span>
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-base text-blue-100 md:text-lg lg:text-xl">
              Start, switch, or advance your career with thousands of courses
              from industry experts
            </p>

            <div className="mx-auto mb-6 flex max-w-md justify-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold md:text-xl">10K+</div>
                <div className="text-xs text-blue-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold md:text-xl">500+</div>
                <div className="text-xs text-blue-200">Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold md:text-xl">
                  {categories.length}+
                </div>
                <div className="text-xs text-blue-200">Categories</div>
              </div>
            </div>

            <div className="relative mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for courses, skills, or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-2 border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder-blue-200 backdrop-blur-md focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    selectedCategories.includes(category)
                      ? "bg-white text-blue-700 shadow-md"
                      : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 bg[#f9fafb]">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters - Desktop */}
          <aside className="flex-shrink-0 lg:w-72">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-[#8b5cf6]   flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal w-5 h-5 text-white"><line x1="21" x2="14" y1="4" y2="4"></line><line x1="10" x2="3" y1="4" y2="4"></line><line x1="21" x2="12" y1="12" y2="12"></line><line x1="8" x2="3" y1="12" y2="12"></line><line x1="21" x2="16" y1="20" y2="20"></line><line x1="12" x2="3" y1="20" y2="20"></line><line x1="14" x2="14" y1="2" y2="6"></line><line x1="8" x2="8" y1="10" y2="14"></line><line x1="16" x2="16" y1="18" y2="22"></line></svg>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-foreground">Filters</h2>
                </div>
                {/* {activeFiltersCount > 0 && ( */}
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
                {/* )} */}
              </div>

              {activeFiltersCount > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {category}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleCategoryToggle(category)}
                        />
                      </span>
                    ))}
                    {priceFilter !== "all" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {priceFilter === "free" ? "Free" : "Paid"}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setPriceFilter("all")}
                        />
                      </span>
                    )}
                    {ratingFilter > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {ratingFilter}+ Stars
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setRatingFilter(0)}
                        />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-900">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-900">Price</h3>
                <div className="space-y-2">
                  {prices.map((price) => (
                    <label key={price} className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        checked={priceFilter === price.toLowerCase()}
                        onChange={() => setPriceFilter(price.toLowerCase())}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {price}
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === "all"}
                      onChange={() => setPriceFilter("all")}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      All Prices
                    </span>
                  </label>
                </div>
              </div> */}

              {/* Remove Level Filter since it's not in API */}
              {/* <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-900">Level</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        checked={levelFilter === level.toLowerCase()}
                        onChange={() => setLevelFilter(level.toLowerCase())}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {level}
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      checked={levelFilter === "all"}
                      onChange={() => setLevelFilter("all")}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      All Levels
                    </span>
                  </label>
                </div>
              </div> */}

              {/* <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-900">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingFilter === rating}
                        onChange={() => setRatingFilter(rating)}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 flex items-center text-sm text-gray-700">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating
                                ? "fill-current text-yellow-400"
                                : "text-gray-300"
                              }`}
                          />
                        ))}
                        <span className="ml-1">& Up</span>
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={ratingFilter === 0}
                      onChange={() => setRatingFilter(0)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      All Ratings
                    </span>
                  </label>
                </div>
              </div> */}
              <div className="border-b border-border pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
                <button
                  className="flex items-center justify-between w-full text-left font-heading font-semibold text-foreground mb-4 group"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span className="group-hover:text-secondary transition-colors">Categories</span>
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-chevron-up w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    >
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isCategoriesOpen
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="space-y-2">
                    {/* All Categories option */}
                    <label className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="h-5 w-5 accent-secondary"
                      />
                      <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        All Categories
                      </span>
                    </label>

                    {/* Individual category options */}
                    {categories.map((category) => (
                      <label key={category} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-5 w-5 accent-secondary"
                        />
                        <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>


              {/* Price Accordion - Native Radio Buttons */}
              <div className="border-b border-border pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
                <button
                  className="flex items-center justify-between w-full text-left font-heading font-semibold text-foreground mb-4 group"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                  <span className="group-hover:text-secondary transition-colors">Price</span>
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-chevron-up w-4 h-4 transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    >
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isPriceOpen
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="space-y-2">
                    {prices.map((price) => (
                      <label key={price} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={priceFilter === price.toLowerCase()}
                          onChange={() => setPriceFilter(price.toLowerCase())}
                          className="h-4 w-4 text-secondary border-gray-300 focus:ring-secondary"
                        />
                        <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {price}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceFilter === "all"}
                        onChange={() => setPriceFilter("all")}
                        className="h-4 w-4 text-secondary border-gray-300 focus:ring-secondary"
                      />
                      <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        All Prices
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Rating Accordion - Native Radio Buttons */}
              <div className="border-b border-border pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
                <button
                  className="flex items-center justify-between w-full text-left font-heading font-semibold text-foreground mb-4 group"
                  onClick={() => setIsRatingOpen(!isRatingOpen)}
                >
                  <span className="group-hover:text-secondary transition-colors">Rating</span>
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-chevron-up w-4 h-4 transition-transform duration-300 ${isRatingOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    >
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isRatingOpen
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={ratingFilter === rating}
                          onChange={() => setRatingFilter(rating)}
                          className="h-5 w-5 text-secondary focus:ring-secondary"
                        />
                        <span className="ml-3 flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={i < rating ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`lucide lucide-star w-3 h-3 ${i < rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                          <span className="ml-1">& Up</span>
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingFilter === 0}
                        onChange={() => setRatingFilter(0)}
                        className="h-5 w-5 text-secondary focus:ring-secondary"
                      />
                      <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        All Ratings
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-6 ">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    {filteredCourses.length} Courses Found
                  </h2>
                  {activeFiltersCount > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                      With {activeFiltersCount} active filter
                      {activeFiltersCount > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex rounded-lg border border-gray-300 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded-md p-2 ${viewMode === "grid"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded-md p-2 ${viewMode === "list"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  </div>

                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#02517b]text-xs text-white">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Courses Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="h-48 bg-gray-300"></div>
                    <div className="space-y-3 p-6">
                      <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                      <div className="h-3 w-1/2 rounded bg-gray-300"></div>
                      <div className="h-3 w-1/4 rounded bg-gray-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="py-12 text-center">
                <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm">
                  <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No courses found
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="rounded-lg bg-[#02517b]px-6 py-2 font-medium text-white transition-colors hover:bg-[#1A6A93]"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} view="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} view="list" />
                ))}
              </div>
            )}

            {/* Highlight Sections */}
            <div className="bg-gray-50 py-16">
              <div className="container mx-auto px-6">
                <section className="mb-16">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Trending Courses
                    </h2>
                    <button className="font-medium text-blue-600 hover:text-blue-700">
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredCourses.slice(0, 4).map((course) => (
                      <CourseCard key={course.id} course={course} view="grid" />
                    ))}
                  </div>
                </section>

                {/* Free Courses Section */}
                <section>
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Free Courses</h2>
                    <button className="font-medium text-blue-600 hover:text-blue-700">
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredCourses
                      .filter(
                        (course) =>
                          course.price_type === "free" || Number(course.price) === 0,
                      )
                      .slice(0, 4)
                      .map((course) => (
                        <CourseCard key={course.id} course={course} view="grid" />
                      ))}
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>



      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center shadow-lg mx-4 md:mx-12 lg:mx-24">

          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-4 h-4"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg><span className="text-sm font-semibold">Start Learning Today</span></div>
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
            Join thousands of learners who are advancing their careers with our
            courses
          </p>
          <div className="flex flex-col justify-center gap-2 ">
            <button
              onClick={() => router.push("/auth/register")}
              className="w-max mx-auto inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-body bg-white text-primary button-shadow hover:bg-secondary/90 hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.98] h-14 rounded-xl px-10 text-lg group"
            >
              Sign Up Free
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
            <p className="text-primary-foreground/60 text-sm mt-6">
              Already have an account?
              <button
                onClick={() => router.push("/auth/login")}
                className=" ml-1 font-medium text-white underline hover:text-white/80"
              >
                <span>Login</span>
              </button>
            </p>

          </div>
        </div>
      </section>

      <Footer
        email={email}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-6">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 font-medium text-gray-900">
                        Categories
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-medium text-gray-900">Price</h3>
                      <div className="space-y-2">
                        {prices.map((price) => (
                          <label key={price} className="flex items-center">
                            <input
                              type="radio"
                              name="mobile-price"
                              checked={priceFilter === price.toLowerCase()}
                              onChange={() =>
                                setPriceFilter(price.toLowerCase())
                              }
                              className="border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {price}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <div className="flex gap-3">
                    <button
                      onClick={clearAllFilters}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="flex-1 rounded-lg bg-[#02517b]px-4 py-2 font-medium text-white hover:bg-[#1A6A93]"
                    >
                      Apply filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UPDATED CourseCard Component - Using correct API fields
const CourseCard = ({
  course,
  view,
}: {
  course: any;
  view: "grid" | "list";
}) => {
  const router = useRouter();
  
  // Helper function to determine if course is free
  const isFreeCourse =
    course.price_type === "free" || Number(course.price) === 0;

  // Get course image or use placeholder
  const courseImage = course.image || "/images/course-placeholder.jpg";

  // Get instructor name - using creator field from your data
  const instructorName = course.creator || "Unknown Instructor";

  // Strip HTML from description for display
  const stripHtml = (html: string) => {
    if (!html) return "No description available";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "No description available";
  };

  const cleanDescription = stripHtml(course.description || "");

  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 md:w-48 lg:w-56">
            <img
              src={courseImage}
              alt={course.title}
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex h-full flex-col">
              <div className="flex-1">
                <h3 className="mb-2 cursor-pointer text-xl font-semibold text-gray-900 hover:text-blue-600">
                  {course.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {cleanDescription}
                </p>

                <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.category || "Uncategorized"}</span>
                  </div>
                  {course.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.floor(course.ratings || 0)
                          ? "fill-current text-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({course.ratings ? course.ratings.toFixed(1) : "No"}{" "}
                    ratings)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/user2.png"
                    alt={instructorName}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700">
                    {instructorName}
                  </span>
                </div>
                <div className="text-right">
                  {isFreeCourse ? (
                    <span className="text-lg font-bold text-green-600">
                      Free
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      ${Number(course.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      onClick={() => router.push(`/auth/courses/${course.id}`)}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="relative">
        <img
          src={courseImage}
          alt={course.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          {isFreeCourse ? (
            <span className=" bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-full">
              FREE
            </span>
          ) : (
            <span className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
              PREMIUM
            </span>
          )}
        </div>
        {/* <button className="absolute right-3 top-3 rounded-full bg-black bg-opacity-50 p-2 text-white opacity-0 transition-all hover:bg-opacity-70 group-hover:opacity-100">
          <PlayCircle className="h-5 w-5" />
        </button> */}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#2ec2b333] flex items-center justify-center">
          <span className="text-xs font-bold text-secondary">KS</span>
        </div>
        <span className="text-xs text-muted-foreground font-medium capitalize">Karanveer singh</span>
        </div>
        <div className="mb-3 flex items-start justify-between">
          <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            {course.category || "General"}
          </span>
          {course.duration && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2  cursor-pointer font-semibold text-gray-900 group-hover:text-blue-600">
          {course.title}
        </h3>

        <p className="mb-4 line-clamp-2  text-sm text-gray-600">
          {cleanDescription}
        </p>



        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">

          <div className="flex items-center gap-2 bg-[#f3f4f6] px-2 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-400" />

              <span className="text-sm font-medium ">
                {course.ratings ? course.ratings.toFixed(1) : "0.0"}
              </span>


            </div>

          </div>
          <div className="flex items-center gap-2">
            {/* <img
              src="/images/user2.png"
              alt={instructorName}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm text-gray-700">{instructorName}</span> */}
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-3.5 h-3.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span className="text-sm">12,500</span></div>
          </div>
          <div className="flex items-center gap-1.5">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open w-4 h-4"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3-3z"></path></svg>
            <span className="text-sm">48 lessons</span></div>

        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="">
            {isFreeCourse ? (
              <span className="  text-black text-xs font-bold  py-1 ">
                FREE
              </span>
            ) : (
              <span className=" text-black  py-1 text-xs font-medium ">
                PREMIUM
              </span>
            )}
          </div>

          <button
            onClick={() => router.push(`/auth/courses/${course.id}`)}
            className="bg-gradient-to-r from-primary to-[#8b5cf6] text-white inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-body bg-secondary text-secondary-foreground button-shadow hover:bg-secondary/90 active:scale-[0.98] h-8 rounded-md px-3"
          >
            {isFreeCourse ? "Enroll Now" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
