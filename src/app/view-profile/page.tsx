"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store';
import { getUserById, selectCurrentUser, selectUserLoading, selectUserError } from "@/store/slices/profile/profileinfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton1";
import { ArrowLeft, Mail, Calendar, User, Shield, CheckCircle, XCircle, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function UserProfilePage({ className }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  

  
  const userId:any =getDecryptedItem("userId");

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const handleBack = () => {
    router.back();
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

  // Get user data from response
  const userData = (user as any)?.data || user;

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
              <p>{error}</p>
              <Button 
                onClick={() => userId && dispatch(getUserById(userId))}
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

  if (!userData) {
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
            <p className="text-gray-600">The requested user could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("p-6 max-w-4xl mx-auto", className)}>
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(userData.status)}>
            {userData.status?.charAt(0).toUpperCase() + userData.status?.slice(1)}
          </Badge>
          <Badge className={getRoleColor(userData.role)}>
            {userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Image in Circle */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt={`${userData.username}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {userData.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* Online Status Indicator */}
                {userData.status === 'active' && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* User Info */}
              <div>
                <CardTitle className="text-2xl flex items-center gap-3 mb-2">
                  {userData.username}
                  {userData.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-lg">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </CardDescription>
              </div>
            </div>

            {/* Edit Button */}
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => router.push(`/view-profile/edit-profile?id=${userData.id}`)}
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Bio Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              About
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[80px]">
              {userData.bio ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {userData.bio}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No bio provided. Click edit profile to add a bio.
                </p>
              )}
            </div>
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
                
               
              </div>
            </div>
          </div>

         
        </CardContent>
      </Card>
    </div>
  );
}