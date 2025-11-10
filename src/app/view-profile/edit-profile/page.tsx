"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchUserById,
  updateUserProfile,
  clearUpdateError
} from "@/store/slices/profile/profileedit";
import {
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  selectUpdateLoading,
  selectUpdateError
} from "@/store/slices/profile/profileedit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton1";
import { ArrowLeft, Mail, Calendar, User, Shield, CheckCircle, XCircle, Save, RotateCcw, Upload, Camera, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDecryptedItem, updateEncryptedItem } from "@/utils/storageHelper";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import Editprofile from "../../profile/page";

export default function EditProfilePage({ className }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const updateLoading = useAppSelector(selectUpdateLoading);
  const updateError = useAppSelector(selectUpdateError);

  // Get user data from correct path
  const userData = currentUser?.data;
  console.log("object", userData)
  const userId = getDecryptedItem("userId");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for editable fields
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profile: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);


  // Fetch user data when component mounts
  useEffect(() => {
    if (userId) {
      console.log("🟡 Fetching user with ID:", userId);
      dispatch(fetchUserById(Number(userId)));
    }
  }, [dispatch, userId]);

  // Clear update errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearUpdateError());
    };
  }, [dispatch]);

  // Show toast for update errors
  useEffect(() => {
    if (updateError) {
      toasterError(updateError, 3000);
    }
  }, [updateError]);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (userData) {
      console.log("🔄 Initializing form with user data:", userData);
      setFormData({
        username: userData.username || "",
        bio: userData.bio || "",
        profile: selectedFile?.name || "",
      });
      setProfileImage(userData.profileImage || null);
    }
  }, [userData]);

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsEditing(true);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toasterError("Please select a valid image file", 3000);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toasterError("Image size must be less than 5MB", 3000);
        return;
      }

      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setIsEditing(true);
      dispatch(clearUpdateError());
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toasterError("User ID not found", 3000);
      return;
    }

    try {
      // Validate inputs
      if (formData.username.trim().length === 0) {
        toasterError("Username cannot be empty", 3000);
        return;
      }

      if (formData.username.length < 3 || formData.username.length > 30) {
        toasterError("Username must be between 3 and 30 characters", 3000);
        return;
      }

      // Prepare update data
      const updateData: any = {};

      // Only include fields that have changed
      if (formData.username.trim() !== userData?.username) {
        updateData.username = formData.username.trim();
      }

      if (formData.bio !== userData?.bio) {
        updateData.bio = formData.bio;
      }

      // Add profile image file if selected
      if (selectedFile) {
        updateData.profileImage = selectedFile;
      }

      // Check if there are actual changes
      if (Object.keys(updateData).length === 0) {
        toasterError("No changes to save", 3000);
        return;
      }

      console.log('🟡 Dispatching update with:', { userId: Number(userId), updateData });

      const result = await dispatch(updateUserProfile({
        userId: Number(userId),
        updateData
      })).unwrap();

      console.log('✅ Update successful:', result);

      toasterSuccess("Profile updated successfully!", 3000);
      router.push(`/view-profile`,);
      updateEncryptedItem("name", () => formData.username);
      // Reset states
      setIsEditing(false);
      setSelectedFile(null);

      // Refresh user data
      dispatch(fetchUserById(Number(userId)));

    } catch (error: any) {
      console.error("❌ Update failed:", error);
    }
  };




  // const handleReset = () => {
  //   if (userData) {
  //     setFormData({
  //       username: userData.username || "",
  //       bio: userData.bio || ""
  //     });
  //     setProfileImage(userData.profileImage || null);
  //   }
  //   setSelectedFile(null);
  //   setIsEditing(false);
  //   dispatch(clearUpdateError());
  // };


  const handleReset = () => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        bio: userData.bio || "",
        profile: ""
      });
    }
    setSelectedFile(null);
    setIsEditing(false);
    dispatch(clearUpdateError());
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'super-admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={cn("p-6 max-w-4xl mx-auto", className)}>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-6 max-w-4xl mx-auto", className)}>
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <XCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading User</h3>
              <p className="mb-4">{error}</p>
              <Button
                onClick={() => userId && dispatch(fetchUserById(Number(userId)))}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser || !userData) {
    return (
      <div className={cn("p-6 max-w-4xl mx-auto", className)}>
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
            <p className="text-gray-600 mb-4">The requested user could not be found.</p>
            <Button
              onClick={() => userId && dispatch(fetchUserById(Number(userId)))}
            >
              Reload Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("p-6 max-w-4xl mx-auto", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>

        <div className="flex items-center gap-3">
          {/* <Button 
            variant="outline"
            onClick={() => setShowResponse(!showResponse)}
            className="flex items-center gap-2"
          >
            {showResponse ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showResponse ? "Hide Response" : "Show Response"}
          </Button> */}

          {isEditing && (
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={updateLoading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={(!isEditing && !selectedFile) || updateLoading || imageLoading}
            className="flex items-center gap-2"
          >
            {updateLoading || imageLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {imageLoading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* API Response Viewer */}
      {showResponse && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              API Response Data
            </CardTitle>
            <CardDescription>
              Current user data from fetchUserById API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded border">
              <pre className="text-sm overflow-auto max-h-60">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p><strong>Data Path:</strong> currentUser.data</p>
              <p><strong>User ID:</strong> {userData.id}</p>
              <p><strong>Username (original):</strong> {userData.username}</p>
              <p><strong>Username (editing):</strong> {formData.username}</p>
              <p><strong>Bio (original):</strong> {userData.bio || 'None'}</p>
              <p><strong>Bio (editing):</strong> {formData.bio || 'None'}</p>
              <p><strong>Is Editing:</strong> {isEditing ? 'Yes' : 'No'}</p>
              <p><strong>Has New Image:</strong> {selectedFile ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {updateError && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">Update Error:</span>
              <span>{updateError}</span>
            </div>
          </CardContent>
        </Card>
      )}




      {/* Main Profile Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">

          <div className="flex justify-between items-center gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-full   flex items-center justify-center  "

              >
                {profileImage ? (
                  <Editprofile />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {userData.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {imageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}

              {userData.status === 'active' && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}

              {selectedFile && !imageLoading && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="text-2xl font-bold max-w-md"
                  placeholder="Enter your username"
                  disabled={updateLoading}
                />
              </div>

              <CardDescription className="flex items-center gap-2 text-lg">
                <Mail className="w-4 h-4" />
                {userData.email}
              </CardDescription>

              {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  // onClick={handleImageClick}
                  disabled={updateLoading || imageLoading}
                  className="mt-3 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Change Photo
                </Button> */}
            </div>
          </div>

          {/* <div className="flex items-center gap-3">
              <Badge className={getStatusColor(userData.status)}>
                {userData.status?.charAt(0).toUpperCase() + userData.status?.slice(1)}
              </Badge>
              <Badge className={getRoleColor(userData.role)}>
                {userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1)}
              </Badge>
            </div> */}

        </CardHeader>

        <CardContent className="space-y-6">
          {/* Bio Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              About
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 text-gray-700 dark:text-gray-300 leading-relaxed"
                rows={4}
                disabled={updateLoading}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formData.bio?.length || 0}/500 characters
            </p>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Details
              </h4>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Role:</span>
                  <Badge variant="secondary" className={getRoleColor(userData.role)}>
                    {userData.role}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant="secondary" className={getStatusColor(userData.status)}>
                    {userData.status}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                  <div className="flex items-center gap-2">
                    {userData.verified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Account Timeline
              </h4>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Last updated:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    #{userData.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800">New profile picture selected</p>
                  <p className="text-sm text-blue-600">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setProfileImage(userData.profileImage || null);
                  }}
                  disabled={imageLoading}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Save Button at Bottom */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={updateLoading || imageLoading}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateLoading || imageLoading}
                className="flex items-center gap-2"
              >
                {updateLoading || imageLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {imageLoading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}