"use client";
import React, { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { toasterError, toasterSuccess } from "../core/Toaster";
import Cookies from "js-cookie";

interface AuthFormProps {
  type: "login" | "register" | "forgot-password" | "reset-password";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdminRegistered, setIsAdminRegistered] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    newPassword: "",
    role: "user", // Default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "register") {
      const { password, confirmPassword } = formData;

      if (password.length < 6) {
        toasterError("Password must be at least 6 characters.", 2000, "weak-password");
        return;
      }

      if (password !== confirmPassword) {
        toasterError("Password and Confirm Password must match.", 2000, "password-mismatch");
        return;
      }

      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!strongPasswordRegex.test(password)) {
        toasterError("Password must include uppercase, lowercase, and a number.", 2000, "strong-password");
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
          role: formData.role,
        };
        break;

      case "login":
        endpoint = "user/login";
        payload = {
          email: formData.email,
          password: formData.password,
          // role: formData.role, // Send selected role for validation
        };
        break;

      case "forgot-password":
        endpoint = "user/forgot-password";
        payload = {
          email: formData.email,
        };
        toasterSuccess("email is sended to youre account")
        break;

      case "reset-password":
        endpoint = "user/reset-password";
        payload = {
          email: formData.email,
          newPassword: formData.newPassword,
        };
        break;
    }

    const response = await api.post(endpoint, payload);

    if (response.success) {
      if (type === "register") {
        // Check if it's an admin registration
        if (formData.role === "admin") {
          toasterSuccess("Admin account created successfully! You can now log in.");
          setIsAdminRegistered(true);
        } else {
          toasterSuccess("Please check your email to verify your account!");
          setIsRegistered(true);
        }
      } else if (type === "login") {
        const token = response.data?.data?.accessToken;
        const refreshToken = response.data?.data?.refreshToken;
        const name = response.data?.data?.user?.username;
        const email = response.data?.data?.user?.email;
        const userId = response.data?.data?.user?.id;
        const role = response.data?.data?.user?.role;

        if (token) {
          Cookies.set("token", token, { expires: 1 });
          Cookies.set("refreshToken", refreshToken, { expires: 7 });
          Cookies.set("name", name, { expires: 7 });
          Cookies.set("email", email, { expires: 7 });
          Cookies.set("userId", userId, { expires: 7 });
          Cookies.set("role", role, { expires: 7 });
        }

        window.location.href = '/';
      }
    } else {
      const messageMap: Record<string, string> = {
        ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST: "Email Already Exists.",
        ERR_INVALID_CREDENTIALS: "Invalid email or password.",
        ERR_USER_NOT_FOUND: "User not found.",
        ERR_AUTH_TOKEN_EXPIRED: "Reset link expired. Please try again.",
        "Password Not Matched": "Password Not Matched",
        "Email Not Found": "Email Not Found",
        "Please verify your email before logging in.": "Please verify your email before logging in.",
        "This is a User account. Please select 'User Account' to login.": "This is a User account. Please select 'User Account' to login.",
        "This is an Admin account. Please select 'Admin Account' to login.": "This is an Admin account. Please select 'Admin Account' to login."
      };

      const apiErrorCode = response?.error?.code || "";
      const errorMessage =
        messageMap[apiErrorCode] || "Something went wrong. Please try again.";

      toasterError(errorMessage, 5000, "id");
    }
  };

  const renderTitle = () => {
    switch (type) {
      case "login":
        return "Login";
      case "register":
        return "Create Your Account";
      case "forgot-password":
        return "Recover Password";
      case "reset-password":
        return "Set New Password";
    }
  };

  const RoleTabs = () => (
    <div className="mb-4">
      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-3">Account Type</label>
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <button
          type="button"
          onClick={() => handleRoleChange("user")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            formData.role === "user"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          👤 User Account
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("admin")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            formData.role === "admin"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          ⚙️ Admin Account
        </button>
      </div>
      
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {formData.role === "user" 
            ? "User accounts require email verification and have access to standard features."
            : "Admin accounts are activated immediately with full system access."
          }
        </p>
      </div>
    </div>
  );

  // Admin Registration Success Screen
  if (isAdminRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4 sm:px-8">
        <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md border border-purple-200 dark:border-purple-700 rounded-3xl shadow-2xl px-6 py-12 sm:px-12 sm:py-16 w-full text-center space-y-8">
          <div className="relative mx-auto w-28 h-28 rounded-full bg-purple-100 dark:bg-purple-900 shadow-inner flex items-center justify-center">
            <div className="absolute -inset-1 bg-purple-400 opacity-20 blur-xl rounded-full animate-ping"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-600 dark:text-purple-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-300 tracking-tight">Admin Account Created</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
            Your admin account has been created successfully! You can now log in immediately with full administrative privileges.
          </p>

          <Link href="/auth/login">
            <button className="mt-2 inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-md">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // User Registration Success Screen (Email Verification)
  if (isRegistered) {
    return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4 sm:px-8">
//   <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md border border-purple-200 dark:border-purple-700 rounded-3xl shadow-2xl px-6 py-12 sm:px-12 sm:py-16 w-full text-center space-y-8">
//     <div className="relative mx-auto w-28 h-28 rounded-full bg-purple-100 dark:bg-purple-900 shadow-inner flex items-center justify-center">
//       <div className="absolute -inset-1 bg-purple-400 opacity-20 blur-xl rounded-full animate-ping"></div>
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-600 dark:text-purple-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
//       </svg>
//     </div>

//     <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-300 tracking-tight">Admin Accounzzzzt Created</h1>
//     <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
//       Your admin account request has been submitted successfully! Please wait for Super Admin approval. Your application will be reviewed soon and you'll get the result in your email.
//     </p>

//     <Link href="/auth/login">
//       <button className="mt-2 inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-md">
//         Go to Login
//       </button>
//     </Link>
//   </div>
// </div>

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4 sm:px-8">
  <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md border border-purple-200 dark:border-purple-700 rounded-3xl shadow-2xl px-6 py-12 sm:px-12 sm:py-16 w-full text-center space-y-8">
    <div className="relative mx-auto w-28 h-28 rounded-full bg-purple-100 dark:bg-purple-900 shadow-inner flex items-center justify-center">
      <div className="absolute -inset-1 bg-purple-400 opacity-20 blur-xl rounded-full animate-ping"></div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-600 dark:text-purple-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    </div>

    <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-300 tracking-tight">Account Created Successfully!</h1>
    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
      Your account has been created! Please verify your email by clicking the confirmation link we sent to your email address.
    </p>

    <Link href="/auth/login">
      <button className="mt-2 inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-md">
        Go to Login
      </button>
    </Link>
  </div>
</div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          {renderTitle()}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
          {( type === "register") && <RoleTabs />}

          {(type === "register" ) && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {(type === "login" || type === "register" || type === "forgot-password" || type === "reset-password") && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {(type === "login" || type === "register" || type === "reset-password") && (
          <div>
  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
  <div className="relative">
    <input
      name={type === "reset-password" ? "newPassword" : "password"}
      type="password"
      placeholder="Enter your password"
      onChange={handleChange}
      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
      required
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
      onClick={(e) => {
        const button = e.currentTarget;
        const input = button.previousElementSibling;
        if (input.type === 'password') {
          input.type = 'text';
          button.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          `;
        } else {
          input.type = 'password';
          button.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          `;
        }
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  </div>
</div>
          )}

          {type === "register" && (
            <div>
  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
  <div className="relative">
    <input
      name="confirmPassword"
      type="password"
      placeholder="Confirm your password"
      onChange={handleChange}
      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
      required
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
      onClick={() => {
        const input = document.querySelector('input[name="confirmPassword"]');
        if (input.type === 'password') {
          input.type = 'text';
        } else {
          input.type = 'password';
        }
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  </div>
</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
          >
            {renderTitle()}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {type === "login" && (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">Register</Link><br />
              <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
            </>
          )}
          {type === "register" && (
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
            </>
          )}
          {type === "forgot-password" && (
            <>
              Remember your password?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
            </>
          )}
          {type === "reset-password" && (
            <>
              Go back to{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;