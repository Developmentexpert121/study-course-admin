import { Logo } from "@/components/logo";
import { User } from "./icons";
import { useSidebarContext } from "./sidebar-context";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useState, useEffect } from "react";
import { useApiClient } from "@/lib/api";
import Image from "next/image";

interface MobileHeaderProps {
  role?: string;
  permissions?: string[];
}

export function MobileHeader({ role, permissions = [] }: MobileHeaderProps) {
  const { toggleSidebar } = useSidebarContext();
  const [userImage, setUserImage] = useState("/images/user2.png");
  const [profileImageLoading, setProfileImageLoading] = useState(true);
  const api = useApiClient();

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
      }
    };

    if (userId) {
      fetchProfileImage();
    } else {
      setProfileImageLoading(false);
    }
  }, []);

  // Optional: You can display the role badge if needed
  const getRoleBadge = () => {
    if (!role) return null;

    const roleColors: { [key: string]: string } = {
      "Super-Admin":
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Admin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Teacher:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Student:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      HR: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };

    const badgeClass =
      roleColors[role] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    return (
      <span className={`ml-2 rounded-full px-2 py-1 text-xs ${badgeClass}`}>
        {role}
      </span>
    );
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-sm dark:bg-gray-dark">
      {/* Burger Menu */}
      <button
        onClick={toggleSidebar}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#02517b] text-white"
        aria-label="Open menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex-1 text-center">
        <Logo className="h-10 w-10" />
      </div>

      {/* User Icon with Role Badge */}
      <div className="flex items-center gap-2">
        {role && <div className="hidden sm:block">{getRoleBadge()}</div>}
        <div className="relative">
          {profileImageLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          ) : (
            <Image
              src={userImage}
              className="h-10 w-10 overflow-hidden rounded-full"
              alt="User avatar"
              width={40}
              height={40}
            />
          )}
        </div>
      </div>
    </header>
  );
}
