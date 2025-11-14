"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toasterError, toasterSuccess } from "../core/Toaster";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { setEncryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

interface AuthFormProps {
  type: "login" | "register" | "forgot-password" | "reset-password";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    newPassword: "",
  });
  const router = useRouter();

  const searchParams = useSearchParams();
  const api = useApiClient();

  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

  useEffect(() => {
    const verifyResetToken = async () => {
      if (type === "reset-password") {
        const token = searchParams.get("token");

        if (token) {
          setIsVerifyingToken(true);
          try {
            const response = await api.post("user/verify-reset-token", {
              token,
            });

            if (response.success && response?.data?.data?.email) {
              setFormData((prev) => ({
                ...prev,
                email: response?.data?.data?.email,
              }));
            } else {
              toasterError(
                "Invalid or expired reset link.",
                3000,
                "invalid-token",
              );
            }
          } catch (error) {
            console.error("Token verification failed:", error);
            toasterError(
              "Invalid reset link. Please request a new one.",
              3000,
              "token-error",
            );
          } finally {
            setIsVerifyingToken(false);
          }
        }
      }
    };

    verifyResetToken();
  }, [type, searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "register") {
      const { password, confirmPassword } = formData;

      if (password.length < 6) {
        toasterError(
          "Password must be at least 6 characters.",
          2000,
          "weak-password",
        );
        return;
      }

      if (password !== confirmPassword) {
        toasterError(
          "Password and Confirm Password must match.",
          2000,
          "password-mismatch",
        );
        return;
      }

      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!strongPasswordRegex.test(password)) {
        toasterError(
          "Password must include uppercase, lowercase, and a number.",
          2000,
          "strong-password",
        );
        return;
      }
    }

    let endpoint = "";
    let payload: any = {};

    switch (type) {
      case "register":
        endpoint = "user/signup";
        payload = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          role: "Student", // Always set as user
        };
        break;

      case "login":
        endpoint = "user/login";
        payload = {
          email: formData.email,
          password: formData.password,
        };
        break;

      case "forgot-password":
        endpoint = "user/forgot-password";
        payload = {
          email: formData.email,
        };
        toasterSuccess("Reset email sent to your account");
        break;

      case "reset-password":
        endpoint = "user/reset-password";
        const resetToken = searchParams.get("token");

        if (!resetToken) {
          toasterError(
            "Invalid reset link. Please request a new one.",
            3000,
            "no-token",
          );
          return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
          toasterError("Passwords do not match.", 2000, "password-mismatch");
          return;
        }

        payload = {
          token: resetToken,
          password: formData.newPassword,
        };
        toasterSuccess("Your password has been changed successfully", 2000);
        router.push(`/login`);
        break;
    }

    const response = await api.post(endpoint, payload);

    if (response.success) {
      if (type === "register") {
        toasterSuccess("Please check your email to verify your account!");
        setIsRegistered(true);
      } else if (type === "login") {
        const token = response.data?.data?.accessToken;
        const refreshToken = response.data?.data?.refreshToken;
        const name = response.data?.data?.user?.username;
        const email = response.data?.data?.user?.email;
        const userId = response.data?.data?.user?.id;
        const role = response.data?.data?.user?.role;
        const permissions = response.data?.data?.user?.permissions;

        if (token) {
          setEncryptedItem("token", token);
          setEncryptedItem("refreshToken", refreshToken);
          setEncryptedItem("name", name);
          setEncryptedItem("email", email);
          setEncryptedItem("userId", userId);
          setEncryptedItem("role", role);
          setEncryptedItem("permissions", permissions);
        }

        // Redirect based on role
        if (role === "Super-Admin") {
          router.push("/super-admin/dashboard");
        } else if (role === "Teacher") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      }
    } else {
      const messageMap: Record<string, string> = {
        ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST: "Email Already Exists.",
        ERR_INVALID_CREDENTIALS: "Invalid email or password.",
        ERR_USER_NOT_FOUND: "User not found.",
        ERR_AUTH_TOKEN_EXPIRED: "Reset link expired. Please try again.",
        "Password Not Matched": "Password Not Matched",
        "Email Not Found": "Email Not Found",
        "Please verify your email before logging in.":
          "Please verify your email before logging in.",
      };

      const apiErrorCode = response?.error?.code || "";
      const errorMessage =
        messageMap[apiErrorCode] || "An error occurred. Please try again.";

      toasterError(errorMessage, 5000, "id");
    }
  };

  const renderTitle = () => {
    switch (type) {
      case "login":
        return "Login to Your Account";
      case "register":
        return "Create Your Account";
      case "forgot-password":
        return "Recover Password";
      case "reset-password":
        return "Set New Password";
    }
  };

  // Registration Success Screen (Email Verification)
  if (isRegistered) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 px-4 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 sm:px-8">
        <div className="relative w-full space-y-8 rounded-3xl border border-purple-200 bg-white/80 px-6 py-12 text-center shadow-2xl backdrop-blur-md dark:border-purple-700 dark:bg-white/10 sm:px-12 sm:py-16">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 shadow-inner dark:bg-purple-900">
            <div className="absolute -inset-1 animate-ping rounded-full bg-purple-400 opacity-20 blur-xl"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="z-10 h-14 w-14 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-purple-800 dark:text-purple-300">
            Account Created Successfully!
          </h1>
          <p className="mx-auto w-full text-lg leading-relaxed text-gray-700 dark:text-gray-300 sm:w-3/4 md:w-2/3 lg:w-1/2">
            Your account has been created! Please verify your email by clicking
            the confirmation link we sent to your email address.
          </p>

          <Link href="/auth/login">
            <button className="mt-2 inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-purple-700">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#02517b] to-[#637c89de] px-4 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800 dark:text-white">
          {renderTitle()}
        </h2>

        <form onSubmit={handleSubmit} className="animate-fadeIn space-y-5">
          {/* {type === "register" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Creating a user account. Email verification required.
              </p>
            </div>
          )} */}

          {type === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
          )}

          {type === "reset-password" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-black focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}

          {(type === "login" ||
            type === "register" ||
            type === "forgot-password") && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
          )}

          {(type === "login" ||
            type === "register" ||
            type === "reset-password") && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  name={type === "reset-password" ? "newPassword" : "password"}
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                />
                <PasswordToggle />
              </div>
            </div>
          )}

          {(type === "register" || type === "reset-password") && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                />
                <PasswordToggle />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#02517b] via-[#0482b8] to-[#02517b] py-3 font-semibold text-white shadow-[0_0_25px_rgba(2,81,123,0.6)] transition-all duration-500 hover:scale-105 focus:outline-none"
          >
            <span className="relative z-10">{renderTitle()}</span>
            <span className="animate-gradientFlow absolute inset-0 bg-[linear-gradient(270deg,#02517b,#0482b8,#02a7d0,#02517b)] bg-[length:400%_400%] opacity-80"></span>
            <span className="animate-softGlow absolute inset-0 rounded-xl border border-[#02a7d0]/40"></span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {type === "login" && (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:underline"
              >
                Register
              </Link>
              <br />
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </>
          )}
          {type === "register" && (
            <>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-[#095075] hover:underline"
              >
                Login
              </Link>
            </>
          )}
          {type === "forgot-password" && (
            <>
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </>
          )}
          {type === "reset-password" && (
            <>
              Go back to{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Password Toggle Component
const PasswordToggle: React.FC = () => {
  return (
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 transition-colors duration-200 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
      onClick={(e) => {
        const button = e.currentTarget;
        const input = button.previousElementSibling as HTMLInputElement;
        if (input && input.type === "password") {
          input.type = "text";
          button.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          `;
        } else {
          input.type = "password";
          button.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          `;
        }
      }}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </button>
  );
};

export default AuthForm;
