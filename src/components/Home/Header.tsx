"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { removeEncryptedItem } from "@/utils/storageHelper";
import { toasterSuccess } from "../core/Toaster";

interface HeaderProps {
  name: string | null;
  role?: "super-admin" | "Teacher" | "Student" | "Super-Admin" | null; // 👈 Added role prop
}

const Header: React.FC<HeaderProps> = ({ name, role }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ Role-based dashboard routing
  const handleDashboardRedirect = () => {
    if (role === "super-admin" || role === "Super-Admin") {
      router.push("/super-admin/dashboard");
    } else if (role === "Teacher") {
      router.push("/admin/dashboard");
    } else if (role === "Student") {
      router.push("/user/dashboard");
    } else {
      router.push("/");
    }
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => router.push("/")}
        >
          <img src="/images/logo.png" className="h-10 w-10" alt="Logo" />
          <span className="text-xl font-bold tracking-tight text-blue-700">
            Devex Course
          </span>
        </div>

        {/* Desktop Nav - FIXED: Using Link instead of anchor tags */}
        <nav className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
          <Link href="/" className="transition-colors hover:text-blue-600">
            Home
          </Link>
          <Link
            href="/courses"
            className="transition-colors hover:text-blue-600"
          >
            Courses
          </Link>
          <Link
            href="/#about"
            className="transition-colors hover:text-blue-600"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="transition-colors hover:text-blue-600"
          >
            Contact
          </Link>
        </nav>

        {/* Login / Profile Section */}
        {name ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <img
                src="/images/user2.png"
                alt="Profile"
                className="h-8 w-8 rounded-full border border-gray-300 object-cover"
              />
              <span>{name}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white py-2 text-sm font-medium text-gray-700 shadow-lg">
                <button
                  onClick={handleDashboardRedirect}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <hr className="my-1" />
                <button
                  onClick={() => {
                    // Handle logout logic
                    removeEncryptedItem("token");
                    removeEncryptedItem("refreshToken");
                    removeEncryptedItem("userId");
                    removeEncryptedItem("name");
                    removeEncryptedItem("email");
                    removeEncryptedItem("role");
                    removeEncryptedItem("permissions");
                    toasterSuccess("Logout Successfully", 2000, "id");
                    window.location.href = "/";
                    setProfileOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={() => router.push("/auth/login")}
              className="font-medium text-gray-700 transition-colors hover:text-blue-600"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-800 focus:outline-none md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - FIXED: Using Link instead of anchor tags */}
      {menuOpen && (
        <div className="animate-fadeIn border-t bg-white shadow-inner md:hidden">
          <nav className="flex flex-col space-y-3 px-6 py-4 font-medium text-gray-700">
            <Link
              href="/"
              className="transition hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="transition hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/#about"
              className="transition hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="transition hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  router.push("/auth/login");
                  setMenuOpen(false);
                }}
                className="flex-1 rounded-full border border-blue-600 px-5 py-2 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => {
                  router.push("/auth/register");
                  setMenuOpen(false);
                }}
                className="flex-1 rounded-full bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
