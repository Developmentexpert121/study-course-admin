import { Logo } from "@/components/logo";
import { User } from "./icons";
import { useSidebarContext } from "./sidebar-context";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useState, useEffect } from "react";
import { useApiClient } from "@/lib/api";
import Image from "next/image";

export function MobileHeader() {
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

    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-sm dark:bg-gray-dark">
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
            <div className="flex-1 text-center ">
                <Logo className="w-10 h-10" />
            </div>

            {/* User Icon */}
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
        </header>
    );
}
