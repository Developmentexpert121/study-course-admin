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
import { toasterSuccess } from "@/components/core/Toaster";
import { trackLogoutActivity } from "../../../../store/slices/adminslice/adminlogout";
import { RootState, AppDispatch } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { getDecryptedItem, removeEncryptedItem, updateEncryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";
import { useRouter } from "next/navigation";


export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const name = getDecryptedItem("name");
  const router = useRouter();

  const email = getDecryptedItem("email");
  const [userImage, setUserImage] = useState("/images/user2.png");
  const api = useApiClient();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.adminActivity,
  );

  const USER: any = {
    name: name,
    email: email,
    img: "/images/user2.png",
  };
  const userNames: any = getDecryptedItem("name");
  const userName: any = userNames
    ? userNames.charAt(0).toUpperCase() + userNames.slice(1)
    : "User"; // Get user name from cookies
  useEffect(() => {
    const userId = getDecryptedItem("userId");

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

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3 size-12 rounded-full overflow-hidden">
          <Image
            src={userImage || ""}
            className="size-10"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            {/* <span>{userName}</span> */}

            {/* <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            /> */}
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
            className="size-12 rounded-full overflow-hidden"
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
            // href={"/profile"}
            href={"/view-profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            // href={"/profile"}
            href={"/"}
            onClick={() => router.push(`/`)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">Home</span>
          </Link>

          {/* <Link
            href={"/pages/settings"}
            
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link> */}
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={async () => {
              try {
                const adminId = parseInt(getDecryptedItem("userId") || "0");
                if (adminId) {
                  await dispatch(trackLogoutActivity(adminId)).unwrap();
                }
                removeEncryptedItem("token");
                removeEncryptedItem("refreshToken");
                removeEncryptedItem("userId");
                removeEncryptedItem("name");
                removeEncryptedItem("email");
                removeEncryptedItem("role");


                setIsOpen(false);
                toasterSuccess("Logout Successfully", 2000, "id");
                window.location.href = "/";
              } catch (error) {
                console.error("Failed to track logout activity:", error);

                removeEncryptedItem("token");
                removeEncryptedItem("refreshToken");
                removeEncryptedItem("userId");
                removeEncryptedItem("name");
                removeEncryptedItem("email");
                removeEncryptedItem("role");
                setIsOpen(false);
                toasterSuccess("Logout Successfully", 2000, "id");
                window.location.href = "/";
              }
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
