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
  const userData = currentUser?.data || userProfile?.data || userProfile;
  const loading = updateLoading || loadingProfile;
  const error = updateError || errorProfile;

  const userId = getDecryptedItem("userId");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
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
    setFormData((prev) => ({
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
        <div className="max-w-6xl mx-auto space-y-6">
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

      <div className="max-w-6xl mx-auto">
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
              {/* Cover */}
              <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

              <CardContent className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 -mt-16 mb-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      {profileImage ? (
                        <>
                          <Image
                            src={profileImage}
                            alt={userData.username}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                          {editMode && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Camera className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-5xl font-bold">
                            {userData.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {editMode && !profileImage && (
                      <label
                        htmlFor="imageInput"
                        className="absolute bottom-0 right-0 z-20 flex w-8 h-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                    )}

                    {userData.status === "active" && !editMode && (
                      <div className="absolute bottom-3 right-3 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                    )}

                    {selectedFile && !imageLoading && editMode && (
                      <div className="absolute -right-2 -top-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white font-semibold">
                        New
                      </div>
                    )}

                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black bg-opacity-50">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 pb-2 w-full">
                    {editMode ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Username
                          </label>
                          <Input
                            value={formData.username}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                            placeholder="Enter your username"
                            className="text-2xl font-bold"
                            disabled={updateLoading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email
                          </label>
                          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 p-2">
                            <Mail className="w-4 h-4" />
                            {userData.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formData.username}
                          </h1>
                          {userData.verified && (
                            <CheckCircle className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {userData.email}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!editMode ? (
                    <Button
                      onClick={() => setEditMode(true)}
                      className="self-end"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2 self-end">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={updateLoading || imageLoading}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={updateLoading || imageLoading}
                      >
                        {updateLoading || imageLoading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
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
                <div>
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
                </div>
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
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Manage your password and account security
                  </CardDescription>
                </div>
              </div>
              {!showResetForm && (
                <Button
                  onClick={() => setShowResetForm(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              )}
            </div>
          </CardHeader>

          {showResetForm && (
            <CardContent className="pt-6">
              {resetSuccess && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-900">
                      Password Updated
                    </h4>
                    <p className="text-sm text-emerald-800 mt-0.5">
                      Your password has been changed successfully.
                    </p>
                  </div>
                </div>
              )}

              {resetError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900">Error</h4>
                    <p className="text-sm text-red-800 mt-0.5">{resetError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {[
                  {
                    field: "oldPassword",
                    label: "Current Password",
                    type: "old",
                  },
                  { field: "newPassword", label: "New Password", type: "new" },
                  {
                    field: "confirmPassword",
                    label: "Confirm New Password",
                    type: "confirm",
                  },
                ].map(({ field, label, type }) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {label}
                    </label>
                    <div className="relative">
                      <Input
                        type={
                          showPasswords[
                            type as keyof typeof showPasswords
                          ]
                            ? "text"
                            : "password"
                        }
                        name={field}
                        value={
                          passwordForm[
                            field as keyof typeof passwordForm
                          ] as string
                        }
                        onChange={handlePasswordChange}
                        placeholder={
                          field === "oldPassword"
                            ? "Enter your current password"
                            : "Enter a strong password"
                        }
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            [type]: !prev[type as keyof typeof prev],
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPasswords[
                          type as keyof typeof showPasswords
                        ] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={isResetting}
                    className="flex-1"
                  >
                    {isResetting ? "Updating..." : "Update Password"}
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