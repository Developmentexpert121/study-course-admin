"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUserById,
  updateUserProfile,
  clearUpdateError,
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  selectUpdateLoading,
  selectUpdateError,
} from "@/store/slices/profile/profileedit";
import {
  getUserById,
  selectCurrentUser as selectCurrentUserProfile,
  selectUserLoading as selectUserLoadingProfile,
  selectUserError as selectUserErrorProfile,
} from "@/store/slices/profile/profileinfo";
import {
  resetPassword,
  selectIsResetting,
  selectResetSuccess,
  selectResetError,
  clearError as clearPasswordError,
  resetPasswordResetState,
} from "@/store/slices/password/password";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton1";
import {
  ArrowLeft,
  Mail,
  Calendar,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw,
  Camera,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDecryptedItem, updateEncryptedItem } from "@/utils/storageHelper";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useApiClient } from "@/lib/api";

export default function UserProfilePage({ className }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const api = useApiClient();

  // Edit mode selectors
  const currentUser = useAppSelector(selectCurrentUser);
  const updateLoading = useAppSelector(selectUpdateLoading);
  const updateError = useAppSelector(selectUpdateError);

  // View mode selectors (fallback)
  const userProfile = useAppSelector(selectCurrentUserProfile);
  const loadingProfile = useAppSelector(selectUserLoadingProfile);
  const errorProfile = useAppSelector(selectUserErrorProfile);

  const isResetting = useAppSelector(selectIsResetting);
  const resetSuccess = useAppSelector(selectResetSuccess);
  const resetError = useAppSelector(selectResetError);

  // Use edit data if available, fallback to view data
  const userData = currentUser?.data || userProfile;
  const loading = updateLoading || loadingProfile;
  const error = updateError || errorProfile;

  const userId = getDecryptedItem<any>("userId");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState<any>(false);
  const [formData, setFormData] = useState<any>({
    username: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState<any>(false);
  const [showResetForm, setShowResetForm] = useState<any>(false);
  const [showPasswords, setShowPasswords] = useState<any>({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    userId: userId,
  });

  // Fetch user data on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(Number(userId)));

      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  // Initialize form data
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        bio: userData.bio || "",
      });
      setProfileImage(userData.profileImage || null);
    }
  }, [userData]);

  // Handle password reset
  useEffect(() => {
    if (resetSuccess) {
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        userId: userId,
      });
      setShowResetForm(false);
      const timer = setTimeout(() => {
        dispatch(resetPasswordResetState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [resetSuccess, dispatch, userId]);

  // Show errors
  useEffect(() => {
    if (updateError) {
      toasterError(updateError, 3000);
    }
  }, [updateError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearUpdateError());
      dispatch(clearPasswordError());
    };
  }, [dispatch]);

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toasterError("Please select a valid image file", 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toasterError("Image size must be less than 5MB", 3000);
      return;
    }

    // Just preview the image, don't upload yet
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setSelectedFile(file);
    dispatch(clearUpdateError());
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setProfileImage(userData?.profileImage || null);
    dispatch(clearUpdateError());
  };

  const handleSave = async () => {
    if (!userId) {
      toasterError("User ID not found", 3000);
      return;
    }

    try {
      if (formData.username.trim().length === 0) {
        toasterError("Username cannot be empty", 3000);
        return;
      }

      if (formData.username.length < 3 || formData.username.length > 30) {
        toasterError("Username must be between 3 and 30 characters", 3000);
        return;
      }

      const updateData: any = {};

      if (formData.username.trim() !== userData?.username) {
        updateData.username = formData.username.trim();
      }

      if (formData.bio !== userData?.bio) {
        updateData.bio = formData.bio;
      }

      // Handle image upload if a new image is selected
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", selectedFile);
        formDataUpload.append("userId", userId || "");

        setImageLoading(true);
        try {
          const res = await api.postFile("upload/update-profile-image", formDataUpload);
          const profileImageUrl = res?.data?.data?.profileImage;
          if (res?.data?.success && profileImageUrl) {
            updateData.profileImage = profileImageUrl;
            toasterSuccess(res?.data?.data?.message || "Image uploaded successfully", 3000);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toasterError("Failed to upload image", 3000);
          setImageLoading(false);
          return;
        } finally {
          setImageLoading(false);
        }
      }

      if (Object.keys(updateData).length === 0) {
        toasterError("No changes to save", 3000);
        return;
      }

      const result = await dispatch(
        updateUserProfile({
          userId: Number(userId),
          updateData: {
            username: updateData.username,
            bio: updateData.bio,
          },
        })
      ).unwrap();

      toasterSuccess("Profile updated successfully!", 3000);
      updateEncryptedItem("name", () => formData.username);
      setEditMode(false);
      setSelectedFile(null);
      dispatch(fetchUserById(Number(userId)));
      dispatch(getUserById(userId));
    } catch (error: any) {
      console.error("Update failed:", error);
    }
  };

  const handleReset = () => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        bio: userData.bio || "",
      });
    }
    setSelectedFile(null);
    setProfileImage(userData?.profileImage || null);
    setEditMode(false);
    dispatch(clearUpdateError());
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(resetPassword(passwordForm));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "inactive":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-violet-100 text-violet-800 border-violet-300";
      case "super-admin":
        return "bg-red-100 text-red-800 border-red-300";
      case "user":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6",
          className
        )}
      >
        <Skeleton className="h-10 w-24 mb-8" />
        <div className=" mx-auto space-y-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6",
          className
        )}
      >
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-red-900 mb-2">
                  Unable to Load Profile
                </h3>
                <p className="text-red-700 mb-6">{error}</p>
                <Button onClick={() => userId && dispatch(fetchUserById(Number(userId)))}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6",
          className
        )}
      >
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                User Not Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                The requested user profile could not be found.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6",
        className
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <div className="flex gap-2">

            <Badge className={cn("px-4 py-1", getRoleColor(userData.role))}>
              {userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg border-0 bg-white dark:bg-slate-900">


              <CardContent className="px-6 py-6">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#02517b] to-[#0a6da0] flex items-center justify-center">
                        {profileImage ? (
                          <>
                            <Image
                              src={profileImage}
                              alt={userData.username}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                              priority
                            />
                            {editMode && (
                              <button
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-200 cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                                type="button"
                              >
                                <Camera className="w-8 h-8 text-white" />
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#02517b] to-[#0a6da0]">
                            <span className="text-white text-5xl font-bold">
                              {userData.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Indicator */}
                      {userData.status === "active" && !editMode && (
                        <div className="absolute bottom-3 right-3">
                          <div className="w-5 h-5 bg-emerald-500 rounded-full border-3 border-white shadow-lg relative">
                            <div className="absolute inset-1 bg-emerald-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}

                      {/* Edit Photo Button */}
                      {editMode && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-[#02517b] shadow-lg hover:shadow-xl transition-all duration-200 group/photo"
                          type="button"
                        >
                          <Camera className="w-5 h-5 text-[#02517b] group-hover/photo:scale-110 transition-transform" />
                        </button>
                      )}

                      {/* New Image Badge */}
                      {selectedFile && !imageLoading && editMode && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-[#02517b] text-white px-2 py-1 text-xs font-semibold shadow-md">
                            New
                          </Badge>
                        </div>
                      )}

                      {/* Loading Spinner */}
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                          <div className="h-10 w-10 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                        </div>
                      )}
                    </div>


                  </div>

                  {/* User Info Section */}
                  <div className="flex-1 space-y-6">
                    {/* Header Row */}
                    <div className="flex flex-col  gap-4">
                      <div className="space-y-2">
                        {editMode ? (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Username
                            </label>
                            <Input
                              value={formData.username}
                              onChange={(e) => handleInputChange("username", e.target.value)}
                              placeholder="Enter username"
                              className="text-xl font-bold border-[#02517b]/30 focus:border-[#02517b] focus:ring-[#02517b]/20"
                              disabled={updateLoading}
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {formData.username}
                              </h1>
                              {userData.verified && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-2 py-1">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm md:text-base">{userData.email}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {!editMode ? (
                          <Button
                            onClick={() => setEditMode(true)}
                            className="bg-[#02517b] hover:bg-[#024a6f] text-white shadow-md hover:shadow-lg transition-all"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={handleReset}
                              disabled={updateLoading || imageLoading}
                              className="border-gray-300 hover:border-gray-400"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSave}
                              disabled={updateLoading || imageLoading}
                              className="bg-[#02517b] hover:bg-[#024a6f] text-white shadow-md hover:shadow-lg transition-all"
                            >
                              {updateLoading || imageLoading ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error Display */}
                    {updateError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in duration-200">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-medium text-red-900">Update Failed</p>
                          <p className="text-sm text-red-800">{updateError}</p>
                        </div>
                      </div>
                    )}

                    {/* Success Message (if any) */}
                    {!updateError && !editMode && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Last updated:{" "}
                          {userData.updatedAt
                            ? new Date(userData.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            : "Recently"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Email Display in Edit Mode */}
                {editMode && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-2 bg-white rounded border border-gray-300">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{userData.email}</span>
                      <Badge className="ml-auto bg-gray-100 text-gray-600 text-xs hover:bg-[#02517b] hover:text-white">
                        Cannot change
                      </Badge>
                    </div>
                  </div>
                )}
                {/* Bio Section */}
                <div className="space-y-2 mb-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Bio
                  </label>
                  {editMode ? (
                    <div className="space-y-2">
                      <Textarea
                        value={formData.bio || ""}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="min-h-[120px] resize-none border-gray-300 focus:border-[#02517b] focus:ring-[#02517b]/20"
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-500">
                          Brief description about yourself
                        </p>
                        <p className={`font-medium ${(formData.bio?.length || 0) >= 500
                          ? "text-red-600"
                          : "text-gray-500"
                          }`}>
                          {formData.bio?.length || 0}/500
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line">
                        {formData.bio || "No bio provided yet. Add a bio to tell others about yourself."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {updateError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900">Error</h4>
                      <p className="text-sm text-red-800 mt-0.5">{updateError}</p>
                    </div>
                  </div>
                )}

                {/* Bio Section */}
                {/* <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                    <User className="w-4 h-4" />
                    About
                  </h3>
                  {editMode ? (
                    <div className="space-y-3">
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px] resize-none"
                        disabled={updateLoading}
                      />
                      <p className="text-sm text-slate-500">
                        {formData.bio?.length || 0}/500 characters
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      {formData.bio ? (
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {formData.bio}
                        </p>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 italic">
                          No bio provided yet.
                        </p>
                      )}
                    </div>
                  )}
                </div> */}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Member Since
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Last Updated
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {userData.updatedAt
                        ? new Date(userData.updatedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Role
                    </p>
                    <Badge className={cn("text-xs", getRoleColor(userData.role))}>
                      {userData.role?.charAt(0).toUpperCase() +
                        userData.role?.slice(1)}
                    </Badge>
                  </div>


                  <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Verification
                    </p>
                    <div className="flex items-center gap-2">
                      {userData.verified ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                            Not Verified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

       {/* Security Section */}
<Card className="border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-900">
  <CardHeader className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#02517b] flex items-center justify-center shadow-sm">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Account Security
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            Manage your password and secure your account
          </CardDescription>
        </div>
      </div>
      
      {!showResetForm && (
        <Button
          onClick={() => setShowResetForm(true)}
          variant="outline"
          className="border border-[#02517b] text-[#02517b] hover:bg-blue-50  dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 shadow-sm"
        >
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </Button>
      )}
    </div>
  </CardHeader>

  {showResetForm && (
    <CardContent className="p-6">
      {/* Success Message */}
      {resetSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-300">
                Password Updated Successfully
              </h4>
              <p className="text-sm text-emerald-800 dark:text-emerald-400 mt-0.5">
                Your password has been changed. Please use your new password for future logins.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {resetError && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-300">
                Update Failed
              </h4>
              <p className="text-sm text-red-800 dark:text-red-400 mt-0.5">
                {resetError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Password Form */}
      <div className="space-y-5">
        {/* Current Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Current Password
          </label>
          <div className="relative group">
            <Input
              type={showPasswords.old ? "text" : "password"}
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your current password"
              className="pr-12 h-11 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-gray-400 transition-colors duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded"
            >
              {showPasswords.old ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            New Password
          </label>
          <div className="relative group">
            <Input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter a strong new password"
              className="pr-12 h-11 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-gray-400 transition-colors duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use at least 8 characters with a mix of letters, numbers, and symbols
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Confirm New Password
          </label>
          <div className="relative group">
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm your new password"
              className="pr-12 h-11 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-gray-400 transition-colors duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator (Optional) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Password Strength</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Medium</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={handlePasswordSubmit}
            disabled={isResetting}
            className=" h-11 bg-[#02517b] hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isResetting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Updating Password...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowResetForm(false);
              setPasswordForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
                userId: userId,
              });
              dispatch(clearPasswordError());
            }}
            disabled={isResetting}
            className="h-11 border-[#02517b] dark:border-gray-700 text-[#02517b] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-[#02517b] transition-colors duration-200"
          >
            Cancel
          </Button>
        </div>

 
      </div>
    </CardContent>
  )}
</Card>
      </div>
    </div>
  );
}