"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toasterError, toasterSuccess } from "../core/Toaster";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { setEncryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye, FiEyeOff, FiMail, FiLock, FiUser,
  FiAlertCircle, FiArrowRight, FiTrendingUp,
  FiCheckCircle, FiUsers, FiShield, FiChevronRight
} from "react-icons/fi";
import { HiAcademicCap, HiUserGroup } from "react-icons/hi";

interface AuthFormProps {
  type: "login" | "register" | "forgot-password" | "reset-password";
}

const checkPasswordStrength = (password: string) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  Object.values(checks).forEach(check => check && score++);

  if (score <= 2) return { strength: "weak", score, color: "text-red-500", bg: "bg-red-500" };
  if (score <= 4) return { strength: "medium", score, color: "text-yellow-500", bg: "bg-yellow-500" };
  return { strength: "strong", score, color: "text-green-500", bg: "bg-green-500" };
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdminRegistered, setIsAdminRegistered] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    newPassword: "",
    role: "user",
  });
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof checkPasswordStrength> | null>(null);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const api = useApiClient();
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === "login" && emailInputRef.current) {
      emailInputRef.current.focus();
    }
    if (type === "register" && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [type]);

  useEffect(() => {
    if (type === "register" || type === "reset-password") {
      const password = type === "reset-password" ? formData.newPassword : formData.password;
      if (password) {
        setPasswordStrength(checkPasswordStrength(password));
      } else {
        setPasswordStrength(null);
      }
    }
  }, [formData.password, formData.newPassword, type]);

  useEffect(() => {
    const verifyResetToken = async () => {
      if (type === "reset-password") {
        const token = searchParams.get("token");
        if (token) {
          setIsVerifyingToken(true);
          try {
            const response = await api.post("user/verify-reset-token", { token });
            if (response.success && response?.data?.data?.email) {
              setFormData((prev) => ({
                ...prev,
                email: response?.data?.data?.email,
              }));
            } else {
              toasterError("Invalid or expired reset link.", 3000, "invalid-token");
            }
          } catch (error) {
            console.error("Token verification failed:", error);
            toasterError("Invalid reset link. Please request a new one.", 3000, "token-error");
          } finally {
            setIsVerifyingToken(false);
          }
        }
      }
    };
    verifyResetToken();
  }, [type, searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (type === "register" || type === "login" || type === "forgot-password") {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (type === "register" && !formData.name) {
      newErrors.name = "Name is required";
    }

    if (type === "register" || type === "login" || type === "reset-password") {
      const password = type === "reset-password" ? formData.newPassword : formData.password;
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if ((type === "register" || type === "reset-password") && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let endpoint = "";
      let payload: any = {};

      switch (type) {
        case "register":
          endpoint = "user/signup";
          payload = {
            username: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          };
          break;
        case "login":
          endpoint = "user/login";
          payload = {
            email: formData.email,
            password: formData.password,
            rememberMe: rememberMe,
          };
          break;
        case "forgot-password":
          endpoint = "user/forgot-password";
          payload = { email: formData.email };
          break;
        case "reset-password":
          endpoint = "user/reset-password";
          const resetToken = searchParams.get("token");
          if (!resetToken) {
            toasterError("Invalid reset link. Please request a new one.", 3000, "no-token");
            return;
          }
          payload = {
            token: resetToken,
            password: formData.newPassword,
          };
          break;
      }

      const response = await api.post(endpoint, payload);

      if (response.success) {
        setShowSuccessAnimation(true);

        if (type === "register") {
          if (formData.role === "admin") {
            toasterSuccess("Admin account created successfully! You can now log in.");
            setTimeout(() => setIsAdminRegistered(true), 1500);
          } else {
            toasterSuccess("Please check your email to verify your account!");
            setTimeout(() => setIsRegistered(true), 1500);
          }
        } else if (type === "login") {
          const token = response.data?.data?.accessToken;
          const refreshToken = response.data?.data?.refreshToken;
          const name = response.data?.data?.user?.username;
          const email = response.data?.data?.user?.email;
          const userId = response.data?.data?.user?.id;
          const role = response.data?.data?.user?.role;

          if (token) {
            setEncryptedItem("token", token);
            setEncryptedItem("refreshToken", refreshToken);
            setEncryptedItem("name", name);
            setEncryptedItem("email", email);
            setEncryptedItem("userId", userId);
            setEncryptedItem("role", role);
          }

          setTimeout(() => {
            const routes = {
              admin: "/admin/dashboard",
              "Super-Admin": "/super-admin/dashboard",
              user: "/user/dashboard",
            } as const;
            router.push(routes[role as keyof typeof routes] || "");
          }, 1000);

        } else if (type === "forgot-password") {
          toasterSuccess("Reset email sent to your account");
          setTimeout(() => router.push("/auth/login"), 2000);
        } else if (type === "reset-password") {
          toasterSuccess("Your password has been changed");
          setTimeout(() => router.push("/auth/login"), 1500);
        }
      } else {
        const messageMap: Record<string, string> = {
          ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST: "Email already exists.",
          ERR_INVALID_CREDENTIALS: "Invalid email or password.",
          ERR_USER_NOT_FOUND: "User not found.",
          ERR_AUTH_TOKEN_EXPIRED: "Reset link expired. Please try again.",
          "Password Not Matched": "Password does not match.",
          "Email Not Found": "Email not found.",
          "Please verify your email before logging in.": "Please verify your email before logging in.",
          "This is a User account. Please select 'User Account' to login.": "This is a User account. Please select 'User Account' to login.",
          "This is an Admin account. Please select 'Admin Account' to login.": "This is an Admin account. Please select 'Admin Account' to login.",
        };

        const apiErrorCode = response?.error?.code || "";
        const errorMessage = messageMap[apiErrorCode] || response?.error?.message || "An error occurred. Please try again.";

        if (apiErrorCode.includes("EMAIL") || apiErrorCode.includes("USER_NOT_FOUND")) {
          setErrors(prev => ({ ...prev, email: errorMessage }));
        } else if (apiErrorCode.includes("PASSWORD") || apiErrorCode.includes("CREDENTIALS")) {
          setErrors(prev => ({ ...prev, password: errorMessage }));
        } else {
          toasterError(errorMessage, 5000, "api-error");
        }
      }
    } catch (error) {
      toasterError("Network error. Please check your connection.", 3000, "network-error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTitle = () => {
    const titles = {
      login: "Welcome back",
      register: "Create your account",
      "forgot-password": "Reset your password",
      "reset-password": "Set new password",
    };
    return titles[type] || "";
  };

  const renderDescription = () => {
    const descriptions: Record<AuthFormProps["type"], string> = {
      login: "Enter your credentials to access your dashboard",
      register: "",
      "forgot-password": "Enter your email to receive reset instructions",
      "reset-password": "Create a new password for your account",
    };
    return descriptions[type];
  };

  const RoleTabs = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3"
    >
      <div className="text-left mb-3">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-1">
          Select Account Type
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Choose the type of account you want to create
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleRoleChange("user")}
          className={`relative flex items-center justify-center gap-3 rounded-xl p-1.5 transition-all duration-200 ${formData.role === "user"
            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-500 dark:border-blue-400"
            : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
        >
          <div className={`rounded-lg p-1.5 ${formData.role === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}>
            <HiAcademicCap className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="font-medium text-xs text-gray-800 dark:text-white">Student</div>
            <div className="text-[10px] text-gray-600 dark:text-gray-400">Learning access</div>
          </div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleRoleChange("admin")}
          className={`relative flex items-center justify-center gap-3 rounded-xl transition-all duration-200 ${formData.role === "admin"
            ? "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-500 dark:border-purple-400"
            : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
        >
          <div className={`rounded-lg p-1.5 ${formData.role === "admin"
            ? "bg-purple-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}>
            <HiUserGroup className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="font-medium text-xs text-gray-800 dark:text-white">Teacher</div>
            <div className="text-[10px] text-gray-600 dark:text-gray-400">Admin tools</div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );

  const PasswordStrengthIndicator = () => {
    if (!passwordStrength || type === "login") return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mt-2"
      >
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-400">Strength:</span>
          <span className={`font-medium ${passwordStrength.color}`}>
            {passwordStrength.strength}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= passwordStrength.score
                ? passwordStrength.bg
                : "bg-gray-200 dark:bg-gray-700"
                }`}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  const SuccessAnimation = () => (
    <AnimatePresence>
      {showSuccessAnimation && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
            <h3 className="text-md font-bold text-center text-gray-800 dark:text-white mb-2">
              Success!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-xs">
              {type === "login" && "Redirecting..."}
              {type === "register" && "Account created!"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (type === "reset-password" && isVerifyingToken) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <h3 className="text-md font-semibold text-gray-800 dark:text-white">
            Verifying reset link...
          </h3>
        </div>
      </div>
    );
  }

  if (isAdminRegistered) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <HiUserGroup className="w-8 h-8 text-purple-600 dark:text-purple-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Account Submitted
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-6">
            Your teacher account is under review. You'll receive an email once approved.
          </p>
          <Link href="/auth/login">
            <button className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiMail className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Check Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-6">
            Verification link sent to <span className="font-semibold">{formData.email}</span>
          </p>
          <Link href="/auth/login">
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium mb-3">
              Continue to Login
            </button>
          </Link>
          <button
            onClick={() => setIsRegistered(false)}
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-xs"
          >
            Resend Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SuccessAnimation />

      <div className="h-full w-full mx-auto">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side - Image with Content */}
          <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 relative hidden lg:block ">
            {/* Image Background with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://plus.unsplash.com/premium_photo-1664372145591-f7cc308ff5da?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
            </div>

            <div className="relative z-10 h-full p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-lg mx-auto"
              >
                <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight text-white">
                  Elevate Your<br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Growth Journey
                  </span>
                </h1>

                <p className="text-md lg:text-xl text-gray-300 mb-10 leading-relaxed">
                  Experience the next generation of exclusive learning platform.
                  Premium quality, verified education resources for your academic growth.
                </p>

                {/* Stats/Features */}
                {/* <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <FiUsers className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="my-3">
                      <div className="text-2xl font-bold text-white">10K+</div>
                      <div className="text-xs text-gray-300">Active Students</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <HiAcademicCap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="my-3">
                      <div className="text-2xl font-bold text-white">10+</div>
                      <div className="text-xs text-gray-300">Courses</div>
                    </div>
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 w-full bg-white dark:bg-gray-800 p-6 lg:px-12 lg:py-5 h-full lg:overflow-auto ">
            <div className="  max-w-lg w-full mx-auto h-full  flex flex-col justify-center">
              <div className=" rounded-2xl shadow-2xl p-4 lg:rounded-none lg:shadow-none">

              {/* Desktop Form Header */}
              <div className="mb-3 text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {renderTitle()}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-md">
                  {renderDescription()}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="" noValidate>
                {type === "register" && <RoleTabs />}

                {/* Name field */}
                {type === "register" && (
                  <div className="my-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        ref={nameInputRef}
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                          } bg-white dark:bg-gray-700 px-4 py-2.5 pl-11 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
                      />
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Email field */}
                {(type === "login" || type === "register" || type === "forgot-password") && (
                  <div className="my-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        ref={emailInputRef}
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                          } bg-white dark:bg-gray-700 px-4 py-2.5 pl-11 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
                      />
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Password field */}
                {(type === "login" || type === "register" || type === "reset-password") && (
                  <div className="my-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {type === "reset-password" ? "New Password" : "Password"}
                    </label>
                    <div className="relative">
                      <input
                        name={type === "reset-password" ? "newPassword" : "password"}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={type === "reset-password" ? formData.newPassword : formData.password}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                          } bg-white dark:bg-gray-700 px-4 py-2.5 pl-11 pr-11 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
                      />
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      >
                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                    {type !== "login" && <PasswordStrengthIndicator />}
                  </div>
                )}

                {/* Confirm Password field */}
                {(type === "register" || type === "reset-password") && (
                  <div className="my-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${errors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                          } bg-white dark:bg-gray-700 px-4 py-2.5 pl-11 pr-11 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
                      />
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Remember me & Forgot password */}
                {type === "login" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300">Remember me</span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-base mt-5">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {type === "login" ? "Sign in" :
                        type === "register" ? "Create Account" :
                          type === "forgot-password" ? "Send Reset Link" :
                            "Reset Password"}
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-center">
                {type === "login" && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Not a member yet?{" "}
                    <Link href="/auth/register" className="text-blue-600 font-medium hover:text-blue-700 dark:text-blue-400">
                      Create an account
                    </Link>
                  </p>
                )}
                {type === "register" && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-700 dark:text-blue-400">
                      Sign in
                    </Link>
                  </p>
                )}
                {type === "forgot-password" && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-700 dark:text-blue-400">
                      Back to login
                    </Link>
                  </p>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;