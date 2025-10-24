"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function Page() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const redirectUser = () => {
      try {
        const userId = getDecryptedItem("userId");

        if (userId) {
          router.push(`/user-panel/${userId}`);
        } else {
          setStatus("no-user");
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (error) {
        console.error("Error reading cookies:", error);
        setStatus("error");
      }
    };

    redirectUser();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "no-user") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800">
            <p>User not found. Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
            <p>An error occurred. Please try again.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}
