import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDecryptedItem, removeEncryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";
import { trackLogoutActivity } from "../../../store/slices/adminslice/adminlogout";
import { toasterSuccess } from "@/components/core/Toaster";
import { AppDispatch } from "../../../store/index";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { ThemeToggleSwitch } from "../../../../src/components/Layouts/header/theme-toggle/index";
import { useSidebarContext } from "./sidebar-context";
import { cn } from "@/lib/utils";

interface SidebarUserProfileProps {
  role?: string;
}

export function SidebarUserProfile({
  role: propRole,
}: SidebarUserProfileProps) {
  const api = useApiClient();
  const dispatch = useDispatch<AppDispatch>();
  const name = getDecryptedItem("name");
  const email = getDecryptedItem("email");
  const [userImage, setUserImage] = useState("/images/user2.png");
  const [loading, setLoading] = useState(true);
  const [profileImageLoading, setProfileImageLoading] = useState(true);
  const [internalRole, setInternalRole] = useState<string | undefined>();

  // Use prop role if provided, otherwise use internal state
  const role = propRole || internalRole;

  const USER: any = {
    name: name,
    email: email,
    img: "/images/user2.png",
    role: role,
  };

  useEffect(() => {
    // Only set internal role if prop is not provided
    if (!propRole) {
      const r: any = getDecryptedItem("role");
      setInternalRole(r);
    }
  }, [propRole]);

  useEffect(() => {
    const userId = getDecryptedItem("userId");

    const fetchProfileImage = async () => {
      try {
        setProfileImageLoading(true);
        const res = await api.get(`upload/${userId}`);
        if (res?.data?.success) {
          const { profileImage } = res.data.data;
          setUserImage(profileImage || "/images/user2.png");
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      } finally {
        setProfileImageLoading(false);
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfileImage();
    } else {
      setLoading(false);
      setProfileImageLoading(false);
    }

    const handleImageUpdate = (event: CustomEvent) => {
      if (event.detail?.profileImageUrl) {
        setUserImage(event.detail.profileImageUrl);
        setProfileImageLoading(false);
      } else {
        fetchProfileImage();
      }
    };

    window.addEventListener(
      "profile-image-updated",
      handleImageUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "profile-image-updated",
        handleImageUpdate as EventListener,
      );
    };
  }, []);

  // Add this inside your Sidebar component, before the return statement
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { isMobile, toggleSidebar, isOpen } = useSidebarContext();

  // Role badge styling
  const getRoleBadgeClass = () => {
    const roleColors: { [key: string]: string } = {
      "Super-Admin":
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
      Admin:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700",
      Teacher:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
      Student:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700",
      HR: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700",
    };

    return (
      roleColors[role || ""] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {loading ? (
        // User Profile Skeleton
        <div className="flex items-center gap-2.5 px-5 py-3.5">
          <div className="size-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      ) : (
        // Actual User Profile Content
        <>
          <figure
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="relative">
              {profileImageLoading ? (
                <div className="size-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <Image
                  src={userImage}
                  className="size-12 h-8 w-8 overflow-hidden rounded-full"
                  alt={`Avatar for ${USER.name}`}
                  role="presentation"
                  width={200}
                  height={200}
                  onLoad={() => setProfileImageLoading(false)}
                  onError={() => setProfileImageLoading(false)}
                />
              )}
            </div>
            <figcaption
              className={cn(
                "min-w-0 flex-1 space-y-1 text-base font-medium",
                isOpen ? "block" : "hidden group-hover:block",
              )}
            >
              <div className="truncate leading-none text-dark dark:text-white">
                {USER.name}
              </div>
              {role && (
                <div
                  className={`rounded-full border px-2 py-1 text-xs ${getRoleBadgeClass()} truncate`}
                >
                  {role}
                </div>
              )}
            </figcaption>
          </figure>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-dark">
              <ul className="py-1">
                {/* User Info Section */}
                <li className="flex items-center gap-3 border-b border-gray-100 p-3 dark:border-gray-700">
                  <div className="relative">
                    {profileImageLoading ? (
                      <div className="size-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <Image
                        src={userImage}
                        className="size-12 h-8 w-8 overflow-hidden rounded-full"
                        alt={`Avatar for ${USER.name}`}
                        role="presentation"
                        width={200}
                        height={200}
                        onLoad={() => setProfileImageLoading(false)}
                        onError={() => setProfileImageLoading(false)}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-dark dark:text-white">
                      {USER.name}
                    </div>
                    <div className="truncate text-sm text-gray-600 dark:text-gray-400">
                      {USER.email}
                    </div>
                    {role && (
                      <div
                        className={`rounded-full border px-2 py-1 text-xs ${getRoleBadgeClass()} mt-1 inline-block`}
                      >
                        {role}
                      </div>
                    )}
                  </div>
                </li>

                {/* Theme Toggle */}
                <li className="flex items-center justify-between gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800">
                  <span>Theme</span>
                  <ThemeToggleSwitch />
                </li>

                {/* View Profile */}
                <li>
                  <Link
                    href="/view-profile"
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      isMobile && toggleSidebar();
                    }}
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    View Profile
                  </Link>
                </li>

                {/* Home */}
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      isMobile && toggleSidebar();
                    }}
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Home
                  </Link>
                </li>

                {/* Logout */}
                <li>
                  <button
                    className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                    onClick={async () => {
                      try {
                        const adminId = parseInt(
                          getDecryptedItem("userId") || "0",
                        );
                        if (adminId) {
                          await dispatch(trackLogoutActivity(adminId)).unwrap();
                        }
                        removeEncryptedItem("token");
                        removeEncryptedItem("refreshToken");
                        removeEncryptedItem("userId");
                        removeEncryptedItem("name");
                        removeEncryptedItem("permissions");
                        removeEncryptedItem("email");
                        removeEncryptedItem("role");

                        setIsDropdownOpen(false);
                        toasterSuccess("Logout Successfully", 2000, "id");
                        window.location.href = "/";
                      } catch (error) {
                        console.error(
                          "Failed to track logout activity:",
                          error,
                        );

                        removeEncryptedItem("token");
                        removeEncryptedItem("refreshToken");
                        removeEncryptedItem("userId");
                        removeEncryptedItem("name");
                        removeEncryptedItem("permissions");
                        removeEncryptedItem("email");
                        removeEncryptedItem("role");
                        setIsDropdownOpen(false);
                        toasterSuccess("Logout Successfully", 2000, "id");
                        window.location.href = "/";
                      }
                    }}
                  >
                    <LogOut
                      size={18}
                      className="text-gray-700 dark:text-gray-300"
                    />
                    <span className="text-base font-medium">Log out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
