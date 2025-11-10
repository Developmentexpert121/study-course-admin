"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon, UserIcon } from "@/assets/icons";
import RichTextEditor from "@/components/RichTextEditor";

import {
  DollarSign,
  ListIcon,
  TicketsPlaneIcon,
  TypeIcon,
  Plus,
  Trash2,
  Clock,
  PlayCircle,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  description?: string;
}

const AddCourse = () => {
  const api = useApiClient();

  const router = useRouter();
  const name = getDecryptedItem("userId");
  const naam: any = getDecryptedItem("name");
  const userNames = naam.charAt(0).toUpperCase() + naam.slice(1).toLowerCase();
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    category: "",
    subtitle: "",
    creator: name,
    price: "0",
    priceType: "free",
    duration: "",
    status: "draft",
    image: null as File | string | null,
    introVideo: null as File | string | null,
  });
  const [courseFeatures, setCourseFeatures] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await api.get("categories");

      if (response.data?.data?.categories) {
        setCategories(response.data.data.categories);
      } else if (response.data?.categories) {
        setCategories(response.data.categories);
      } else {
        console.warn(
          "Unexpected categories response structure:",
          response.data,
        );
        toasterError("Unexpected categories format");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toasterError("Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!formData.category.trim()) {
      toasterError("Please enter a category name");
      return;
    }

    const categoryExists = categories.some(
      (cat) =>
        cat.name.toLowerCase() === formData.category.trim().toLowerCase(),
    );

    if (categoryExists) {
      toasterError(`Category '${formData.category}' already exists`);
      return;
    }

    try {
      setIsCreatingCategory(true);
      const response = await api.post("categories", {
        name: formData.category.trim(),
        description: `Category for ${formData.category.trim()} courses`,
      });

      const createdCategory =
        response.data?.data?.category || response.data?.category;

      if (createdCategory) {
        setCategories((prev) => [...prev, createdCategory]);
        setFormData((prev: any) => ({ ...prev, category: "" }));
        setShowCategoryDropdown(true);
        toasterSuccess("Category created successfully");
        await fetchCategories();
      } else {
        toasterError("Failed to create category - invalid response");
      }
    } catch (error: any) {
      console.error("Failed to create category:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create category";
      toasterError(errorMessage);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setFormData((prev: any) => ({ ...prev, category: categoryName }));
    setShowCategoryDropdown(false);
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setFormData((prev: any) => ({ ...prev, category: value }));

    if (value.trim() && !showCategoryDropdown) {
      setShowCategoryDropdown(true);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if ((name === "image" || name === "introVideo") && files && files[0]) {
      await handleFileUpload(name, files[0]);
    } else if (name !== "category") {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (fieldName: string, file: File) => {
    const isImage = fieldName === "image";
    const isVideo = fieldName === "introVideo";

    if (isImage && !file.type.startsWith("image/")) {
      toasterError("Only image files are allowed ❌");
      return;
    }

    if (isVideo && !file.type.startsWith("video/")) {
      toasterError("Only video files are allowed ❌");
      return;
    }

    try {
      if (isImage) setIsUploading(true);
      if (isVideo) setIsVideoUploading(true);

      const fileForm = new FormData();
      fileForm.append("file", file);

      const uploadRes = await api.postFile("upload", fileForm);
      const fileUrl = uploadRes.data?.data?.fileUrl;

      if (fileUrl) {
        setFormData((prev: any) => ({ ...prev, [fieldName]: fileUrl }));
        toasterSuccess(
          `${isImage ? "Image" : "Video"} uploaded successfully`,
          2000,
          "id",
        );
      } else {
        toasterError("Upload failed ❌");
      }
    } catch (err) {
      console.error("Upload failed", err);
      toasterError("Upload failed ❌");
    } finally {
      if (isImage) setIsUploading(false);
      if (isVideo) setIsVideoUploading(false);
    }
  };

  // Rich Text Editor Handlers
  const handleDescriptionChange = (htmlContent: string) => {
    setFormData((prev: any) => ({ ...prev, description: htmlContent }));
  };

  const handleFeatureChange = (htmlContent: string, index: number) => {
    const updatedFeatures = [...courseFeatures];
    updatedFeatures[index] = htmlContent;
    setCourseFeatures(updatedFeatures);
  };

  // Add rich text feature
  const addRichTextFeature = () => {
    setCourseFeatures([...courseFeatures, ""]);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...courseFeatures];
    updatedFeatures.splice(index, 1);
    setCourseFeatures(updatedFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      title,
      description,
      category,
      subtitle,
      creator,
      price,
      priceType,
      duration,
      status,
    } = formData;

    if (
      !title
     
    ) {
      toasterError("Please fill all the title fields ❌", 2000, "id");
      return;
    }

    if (priceType === "paid" && (!price || Number(price) <= 0)) {
      toasterError(
        "Please enter a valid price for paid courses ❌",
        2000,
        "id",
      );
      return;
    }

    if (courseFeatures.length === 0) {
      toasterError("Please add at least one course feature ❌", 2000, "id");
      return;
    }

    if (!formData.image) {
      toasterError("Please upload a thumbnail image ❌", 2000, "id");
      return;
    }

    try {
      const payload = {
        title,
        description,
        category,
        subtitle,
        creator,
        price: priceType === "free" ? 0 : Number(price),
        priceType,
        duration,
        status,
        features: courseFeatures,
        image: formData.image,
        introVideo: formData.introVideo || "",
      };

      const data = await api.post("course/create-course", payload);
      if (data.success) {
        toasterSuccess("Course created successfully", 2000, "id");
        router.push("/admin/courses");
      } else {
        toasterError(data.error?.code || "Failed to create course", 2000, "id");
      }
    } catch (error) {
      console.error("Course creation failed", error);
      toasterError("Failed to create course ❌");
    }
  };

  // Filter categories based on search input - show all when no search term
  const filteredCategories = formData.category.trim()
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(formData.category.toLowerCase()),
      )
    : categories;

  return (
    <>
      <Breadcrumb pageName="Create Course" />
      <ShowcaseSection title="Create Course" className="!p-7">
        <form onSubmit={handleSubmit}>
          {/* Title and Creator Row */}
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="creator"
              label="Creator Name"
              placeholder="Add Your Name Here"
              value={userNames}
              disabled
              onChange={handleChange}
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
              required
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="title"
              label="Title"
              placeholder="Add Title Here"
              value={formData.title}
              onChange={handleChange}
              icon={<TicketsPlaneIcon />}
              iconPosition="left"
              height="sm"
              required
            />
          </div>

          {/* Subtitle and Category Row */}
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="subtitle"
              label="Subtitle"
              placeholder="Add course subtitle here"
              value={formData.subtitle}
              onChange={handleChange}
              icon={<TypeIcon className="h-4 w-4" />}
              iconPosition="left"
              height="sm"
            />

            {/* Creatable Category Select */}
            <div className="w-full sm:w-1/2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Category Type *
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={handleCategoryInputChange}
                      onFocus={() => setShowCategoryDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowCategoryDropdown(false), 200)
                      }
                      placeholder="Select or create a category"
                      className="w-full rounded-lg border border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      required
                    />
                    {formData.category && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev: any) => ({
                            ...prev,
                            category: "",
                          }));
                          setShowCategoryDropdown(true);
                        }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                        title="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory || !formData.category.trim()}
                    className="flex items-center gap-2 rounded-lg bg-[#02517b82] px-4 py-3 text-white hover:bg-[#02517bc9] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCreatingCategory ? "Creating..." : "Create New"}
                  </button>
                </div>

                {/* Category Dropdown */}
                {showCategoryDropdown && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
                    {isLoadingCategories ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Loading categories...
                      </div>
                    ) : filteredCategories.length > 0 ? (
                      <>
                        <div className="border-b border-stroke px-4 py-2 text-xs font-medium text-gray-500 dark:border-dark-3">
                          {formData.category.trim()
                            ? "Filtered categories"
                            : "All categories"}
                        </div>
                        {filteredCategories.map((category) => (
                          <div
                            key={category.id}
                            onClick={() => handleCategorySelect(category.name)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-3"
                          >
                            <div className="font-medium text-dark dark:text-white">
                              {category.name}
                            </div>
                            {category.description && (
                              <div className="text-sm text-gray-500">
                                {category.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No categories found. Type to create a new one.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Price Type *
              </label>
              <select
                name="priceType"
                value={formData.priceType}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {formData.priceType === "paid" && (
              <InputGroup
                className="w-full sm:w-1/2"
                type="number"
                name="price"
                label="Price ($)"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                icon={<DollarSign />}
                iconPosition="left"
                height="sm"
                min="0.01"
                step="0.01"
                required={formData.priceType === "paid"}
              />
            )}

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="duration"
              label="Duration"
              placeholder="e.g., 8 weeks, 30 hours"
              value={formData.duration}
              onChange={handleChange}
              icon={<Clock className="h-4 w-4" />}
              iconPosition="left"
              height="sm"
              required
            />
          </div>

          {/* Status */}
          {/* <div className="mb-5.5">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div> */}

          {/* Course Features with Rich Text Editor */}
          <div className="mb-5.5">
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Course Features/Highlights *
              </label>
              <button
                type="button"
                onClick={addRichTextFeature}
                className="flex items-center gap-2 rounded-lg bg-[#02517b] px-4 py-2 text-white hover:bg-[#55afdf]"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </button>
            </div>

            {/* Rich Text Features */}
            {courseFeatures.map((feature, index) => (
              <div
                key={index}
                className="mb-4 rounded-lg border border-gray-200 p-4 dark:border-dark-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-white">
                    Feature {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="flex items-center gap-1 rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>
                <RichTextEditor
                  value={feature}
                  onChange={(htmlContent) =>
                    handleFeatureChange(htmlContent, index)
                  }
                  placeholder="Describe this course feature in detail... (e.g., Certificate included, Lifetime access, Interactive quizzes, etc.)"
                  minHeight="200px"
                />
              </div>
            ))}

            {courseFeatures.length === 0 && (
              <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500 dark:bg-dark-3 dark:text-gray-400">
                <ListIcon className="mx-auto mb-2 h-8 w-8" />
                <p>No features added yet.</p>
                <p className="text-sm">
                  Click "Add Feature" to create detailed features with rich text
                  formatting.
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail/Cover Image */}
          <div className="mb-5.5">
            <div className="mb-3">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Upload Thumbnail/Cover Image *
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                required
                disabled={isUploading}
              />
            </div>

            {/* Image Upload Loader */}
            {isUploading && (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <div>
                  <p className="font-medium text-dark dark:text-white">
                    Uploading image...
                  </p>
                  <p className="text-sm text-gray-500">
                    Please wait while we upload your image
                  </p>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {typeof formData.image === "string" &&
              formData.image &&
              !isUploading && (
                <div className="relative mb-5.5 mt-2 w-max">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                    Image Preview:
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev: any) => ({ ...prev, image: null }))
                    }
                    className="absolute right-2 top-2 z-10 rounded-full border bg-white p-1 text-black transition hover:bg-red-500 hover:text-white dark:bg-dark-3 dark:text-white"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <img
                    src={formData.image}
                    alt="Course"
                    className="h-32 w-48 rounded border object-cover"
                  />
                </div>
              )}
          </div>

          {/* Intro Video */}
          <div className="mb-5.5">
            <InputGroup
              type="file"
              name="introVideo"
              fileStyleVariant="style1"
              label="Intro Video (Optional)"
              placeholder="Upload Video"
              accept="video/*"
              onChange={handleChange}
            />
            {typeof formData.introVideo === "string" && (
              <div className="relative mb-5.5 mt-2 w-max">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                  Video Preview:
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev: any) => ({ ...prev, introVideo: null }))
                  }
                  className="absolute right-2 top-2 z-10 rounded-full border bg-white p-1 text-black transition hover:bg-red-500 hover:text-white dark:bg-dark-3 dark:text-white"
                  title="Remove video"
                >
                  ×
                </button>
                <div className="flex items-center gap-3 rounded border bg-gray-100 p-3 dark:bg-gray-800">
                  <PlayCircle className="h-8 w-8 text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Intro video uploaded
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description with Rich Text Editor */}
          <div className="mb-5.5">
            <RichTextEditor
              label="Course Description *"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Write detailed description about the course..."
              minHeight="300px"
              // error={
              //   !formData.description ? "Description is required" : undefined
              // }
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => router.back()}
            >
              BACK
            </button>

            <button
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              // disabled={
              //   isUploading ||
              //   isVideoUploading ||
              //   courseFeatures.length === 0 ||
              //   !formData.image
              // }
            >
              {isUploading || isVideoUploading ? "Uploading..." : "ADD COURSE"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default AddCourse;
