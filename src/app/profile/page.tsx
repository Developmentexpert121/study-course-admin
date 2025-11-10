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
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

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
              {data.profilePhoto && (
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
                    className="absolute bottom-0 right-0 z-20 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
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
              )}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
