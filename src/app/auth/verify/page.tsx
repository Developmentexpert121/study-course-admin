"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApiClient } from "@/lib/api";

function VerifyEmailPage() {
  const api = useApiClient();

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token not found in URL.");
      return;
    }

    const verifyAccount = async () => {
      try {
        const response = await api.post("user/verify", { token });

        if (!response?.success) {
          throw new Error(response?.error?.code || "Verification failed");
        }

        setStatus("success");
        setMessage(response?.data?.message || "Account verified successfully!");

        const timer = setTimeout(() => router.push("/auth/login"), 3000);
        return () => clearTimeout(timer);
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(
          err?.response?.data?.error?.code ||
            err?.response?.data?.message ||
            "Something went wrong.",
        );
      }
    };

    verifyAccount();
  }, [token, router]);

  if (status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
        <div className="w-full max-w-xl space-y-6 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl">
          <div className="animate-pulse text-4xl text-green-500">🔄</div>
          <h2 className="text-xl font-semibold text-gray-700">
            Verifying your account...
          </h2>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
        <div className="w-full max-w-xl space-y-6 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl">
          <div className="text-5xl text-green-600">✅</div>
          <h2 className="text-2xl font-bold text-green-800">
            Verification Successful
          </h2>
          <p className="text-gray-600">{message}</p>
          <Link href="/auth/login">
            <button className="mt-4 rounded-full bg-green-600 px-6 py-2 text-white transition hover:bg-green-700">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl">
        <div className="text-5xl text-red-600">❌</div>
        <h2 className="text-2xl font-bold text-red-700">Verification Failed</h2>
        <p className="text-gray-600">{message}</p>
        <Link href="/auth/register">
          <button className="mt-4 rounded-full bg-red-600 px-6 py-2 text-white transition hover:bg-red-700">
            Register Again
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
