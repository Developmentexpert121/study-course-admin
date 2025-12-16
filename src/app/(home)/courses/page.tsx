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
      <section
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
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters - Desktop */}
          <aside className="flex-shrink-0 lg:w-80">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
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

              <div className="mb-6">
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
              </div>

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

              <div className="mb-6">
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
                            className={`h-4 w-4 ${
                              i < rating
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
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
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
                      className={`rounded-md p-2 ${
                        viewMode === "grid"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded-md p-2 ${
                        viewMode === "list"
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
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Courses Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          </main>
        </div>
      </div>

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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#02517b] via-[#045a81] to-[#078cc0] py-16 text-white shadow-md">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
            Join thousands of learners who are advancing their careers with our
            courses
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/auth/register")}
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600"
            >
              Already have an account? Login
            </button>
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
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
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
                        className={`h-4 w-4 ${
                          star <= Math.floor(course.ratings || 0)
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
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={courseImage}
          alt={course.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          {isFreeCourse ? (
            <span className="rounded bg-green-500 px-2 py-1 text-xs font-medium text-white">
              FREE
            </span>
          ) : (
            <span className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
              PREMIUM
            </span>
          )}
        </div>
        <button className="absolute right-3 top-3 rounded-full bg-black bg-opacity-50 p-2 text-white opacity-0 transition-all hover:bg-opacity-70 group-hover:opacity-100">
          <PlayCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5">
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

        <h3 className="mb-2 line-clamp-2 h-14 cursor-pointer font-semibold text-gray-900 group-hover:text-blue-600">
          {course.title}
        </h3>

        <p className="mb-4 line-clamp-2 h-10 text-sm text-gray-600">
          {cleanDescription}
        </p>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(course.ratings || 0)
                    ? "fill-current text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({course.ratings ? course.ratings.toFixed(1) : "No ratings"})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/user2.png"
              alt={instructorName}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm text-gray-700">{instructorName}</span>
          </div>
          <div className="text-right">
            {isFreeCourse ? (
              <span className="text-lg font-bold text-green-600">Free</span>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${Number(course.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => router.push(`/auth/courses/${course.id}`)}
          className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          {isFreeCourse ? "Enroll Now" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default CoursesPage;
