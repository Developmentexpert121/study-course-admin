"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import Cookies from 'js-cookie';
import { toasterSuccess } from "@/components/core/Toaster";
import api from "@/lib/api";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const name = Cookies.get('name')
  const email = Cookies.get('email')
  const [userImage, setUserImage] = useState("/images/user2.png");

  const USER = {
    name: name,
    email: email,
    img: "/images/user2.png",
  };
  const userNames = Cookies.get('name');
  const userName = userNames 
    ? userNames.charAt(0).toUpperCase() + userNames.slice(1)
    : 'User';
  ; // Get user name from cookies
  useEffect(() => {
    const userId = Cookies.get("userId");

    const fetchProfileImage = async () => {
      try {
        const res = await api.get(`upload/${userId}`);
        if (res?.data?.success) {
          const { profileImage } = res.data.data;
          setUserImage(profileImage || "/images/user2.png");
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };

    if (userId) fetchProfileImage();

    const handleImageUpdate = (event: CustomEvent) => {
      // Update image directly from event if available
      if (event.detail?.profileImageUrl) {
        setUserImage(event.detail.profileImageUrl);
      } else {
        // Fallback to API call if no URL in event
        fetchProfileImage();
      }
    };

    window.addEventListener("profile-image-updated", handleImageUpdate as EventListener);

    return () => {
      window.removeEventListener("profile-image-updated", handleImageUpdate as EventListener);
    };
  }, []);

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3 size-12 rounded-full overflow-hidden">
          <Image
            src={userImage}
            className="size-12"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{userName}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={userImage}
            className="size-12   rounded-full overflow-hidden"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-gray-6">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => {
              Cookies.remove('token');
              Cookies.remove("refreshToken");
              Cookies.remove('userId');
              Cookies.remove('name');
              Cookies.remove('email');
              Cookies.remove('role');
              setIsOpen(false);
              window.location.href = '/auth/login';
              toasterSuccess("Logout SucessFully", 2000, "id")
            }}
          >
            <LogOutIcon />
            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
