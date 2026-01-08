"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CameraIcon } from "./_components/icons";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

export default function Editprofile() {
  const router = useRouter();
  const api = useApiClient();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [about, setAbout] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | undefined>();

  const [data, setData] = useState({
    name: "",
    position: "",
    profilePhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAV1BMVEX6+vqPj4////+Li4u5ubn8/PyIiIiFhYWJiYnk5OShoaGnp6fT09Pn5+eRkZHu7u7Z2dn19fXCwsKamprHx8exsbHOzs7X19eurq6/v7+jo6Pe3t6WlpZaNtXmAAAE3UlEQVR4nO2d25aqOhBFsUIRbgqI4AX//zsP0fa0vUfbBoKm4ljzpfvROapIIGSFKAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIEWamG+P/vn/Owhi5Juu3XZHnp6Lblutm1PT9q5aDKRriVulEqZVBqUSr9pjxh0gyrWOlr273KL05Vh/gyDTkv+jdJIsscEemrNUP9K7oU0W+f6UD1Bz+9rs4xuEOrFSrR/15T7rJwiwjU/y8gF9l3IWoyHxKLAVHxS68AYej1qZDbyRFaIocbaYIjhNHHlajTqygIS2CUqRiquDYqHFAinS0H2S+0WUwijzYThP/KFahjDY8vUWvtIEUkeK5hkkYMz9X83rUoJsQ+pTy2YIrFcJ4ytn8EoZRRCocBEMoostVeFH0LfAUOs4dSK8kpfQ2pbOT4Gp1Et6mvHZr0vEOXPhYQ7vU0TCphRueHAXFj6bsKij95pSrOY9N/xQxktymPLgbJqKfobh3HWhGw0GyIW3d5vuLoeg5f/6j4TdpL9qwczdUoh+DYWhDuhPdpY5PFhdD2dfhboGxdC/ZkMsFZvxMtOH64+9pGnfDjWTBBR7xxT/ku08XqejpcGzTvWub6rXsLnW/EIVfhu7LGNIXMdxnRC16NjRw5FZD2as0F9xuTWU//l7hxmVNeCO/hKaI89dqdAAljBxe4wdxFRp4P7dPpc/2/zNnv5AhFT8X3uBonuE5FMG57/IT4e/VfkDldEU9hFPCyCx+T1XU+6AEzaw4TVH3gQmaZbcpisFV0DDlWkzD3K1Pa8ud0EnbBClotut3NmXUx9B2sd9B2fmZo86DjgVFTOXmr4d+fa4DLuAV4rJ9EF5TOg/fz2ACiBud/rRUiT5vPyF+eIWJ1v3hnGidGMY/566sPione00CR1U21HU9rCs2YWffP+kV8A3fPwQAAIAP7k/1WApJkwpTM/THeFmOfRYJuelhGgo13nYuTaJX3VqCI1W5awDhIUof/K+hzlkZneKY+F7Bmb4uOhXPq3DUv1rQ85t916CaHcrjtegSF51gePDWp1y/o4Q+X5y+p4RjETtPRVxiq6UlnmrovkvPFl9tusS2dTt87SNaInpgh68IBh3eJLhSWxjCcK7h265DX4afP9IsEDa0w1cUaomQkx2+olBLhJwsDT09IrqfEGFt6CkKxY17cNsOb3ujqX2Tobfj+N41mCbeUqVzT56bis+T6t4i6HN/+3va1Gde7z3zhdfd0e4H7jzHb5rN7fg5OzwfUjc3WmGPOvp9NeOW47Iy9P16jXavvf3W/o/+ovyVfeptufsO19Do34IiwmxLnO/1EP8vuQ30sttTJeWIjFcpihE0W/Jf0KhqI0fQbDmZeIz+c9JWxjV4g7lYtlN1LGGz0A+of/jBnOkoJTGMSM1iZdSdzNMhmYbzEiOObkVsZ/sVpv7PDJCdn+wcDfH+UQbIhiByQkzZQc8qpEqSWG5/3sMUlYVOJn5nRieHOpxPzfEoWXcbW0uT8oqHcPS+GH9wVXZ33wT81c18JzCP96F+DfGS5lrvt4d8oy65tTS9bJZOr/k1dc67XV1Foae8Lrv4uamqoS77frfd7nZ9X9ZZ1TQsbEe+E1+Zte+gARJsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJP/AAFSQ7wNy+LTAAAAAElFTkSuQmCC",
    coverPhoto: "/images/cover/cover-01.png",
  });
console.log("datdatdatdatdat",data)
  useEffect(() => {
    // Load data from cookies
    setName(getDecryptedItem("name") || "");
    setPosition(getDecryptedItem("position") || "");
    setAbout(getDecryptedItem("about") || "");
    const storedLinks: any = getDecryptedItem("links");
    setLinks(storedLinks ? JSON.parse(storedLinks) : []);
    setRole(getDecryptedItem("role") || "");
    fetchUserProfileImage();
  }, []);

  const handleChange = async (e: any) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const userId: any = getDecryptedItem("userId");
    formData.append("userId", userId || "");

    setLoading(true);

    try {
      const res = await api.postFile("upload/update-profile-image", formData);
      const profileImageUrl = res?.data?.data?.profileImage;
      if (res?.data?.success && profileImageUrl) {
        setData((prev) => ({
          ...prev,
          [fieldName]: profileImageUrl,
        }));
        toasterSuccess(res?.data?.data?.message, 2000, "id");
        window.dispatchEvent(
          new CustomEvent("profile-image-updated", {
            detail: { profileImageUrl },
          }),
        );
        fetchUserProfileImage();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfileImage = async () => {
    const userId = getDecryptedItem("userId");
    if (!userId) return;

    try {
      const res = await api.get(`upload/${userId}`);
      if (res?.data?.success) {
        const { name, profileImage } = res.data.data;
        setData((prev) => ({
          ...prev,
          name: name || prev.name,
          profilePhoto: profileImage || prev.profilePhoto,
        }));
      }
    } catch (err) {
      console.error("Failed to load profile image:", err);
    }
  };

  const isUser = role === "user";

  return (
    <div className="mx-auto w-full overflow-hidden">

      <div className="">
        {/* Cover Photo */}
       

        {/* Profile Info */}
        <div className="relative ">
          {/* Profile Photo */}
          <div className="relative z-30 mx-auto  w-24 h-24 w-full rounded-full bg-white/20 p-1 backdrop-blur">
            <div className="relative h-full w-full rounded-[50%] drop-shadow-2">
              {data.profilePhoto ? (
                <>
                  <Image
                    src={data.profilePhoto}
                    width={100}
                    height={100}
                    className="absolute left-0 top-0 h-full w-full rounded-[50%] object-cover"
                    alt="profile"
                  />
                  {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-white/80">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  )}
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 z-20 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-[#1A6A93] hover:bg-[#02517b] text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <CameraIcon />
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </label>
                </>
              ) : 
              (
                 <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-2xl font-bold text-white">
                      {/* {userData.username?.charAt(0).toUpperCase()} */}
               
                    </span>
                  </div>
              )}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
