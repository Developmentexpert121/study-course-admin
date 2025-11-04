// components/Header.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  name: string | null;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-blue-600">
          <img src="/images/logo.png" className="w-[50px]" alt="Logo" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
          <a href="#" className="text-blue-600">
            Home
          </a>
          <a href="/#courses" className="transition hover:text-blue-600">
            Courses
          </a>
          <a href="/#about" className="transition hover:text-blue-600">
            About
          </a>
        </nav>

        {/* Login / Sign Up */}
        {name ? (
          <div>
            <h1 className="font-medium text-gray-700 hover:text-blue-600">
              {name}
            </h1>
            <button
              className="hover:bg-#d3cece rounded-full bg-[#02517b] px-5 py-2 text-white transition hover:bg-[#d3cece] hover:text-black"
              onClick={() => router.push(`/user/dashboard`)}
            >
              dashboard
            </button>
          </div>
        ) : (
          <div className="hidden items-center gap-4 md:flex">
            <button
              className="font-medium text-gray-700 hover:text-blue-600"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="hover:bg-#d3cece rounded-full bg-[#02517b] px-5 py-2 text-white transition hover:bg-[#d3cece] hover:text-black"
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t bg-white shadow-inner md:hidden">
          <nav className="flex flex-col space-y-3 px-6 py-4">
            <a href="#" className="transition hover:text-blue-600">
              Home
            </a>
            <a href="#" className="transition hover:text-blue-600">
              Courses
            </a>
            <a href="#" className="transition hover:text-blue-600">
              About
            </a>
            <a href="#" className="transition hover:text-blue-600">
              Contact
            </a>
            <div className="mt-3 flex gap-3">
              <button className="flex-1 rounded-full border border-blue-600 px-5 py-2 font-semibold text-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white hover:shadow-lg">
                Login
              </button>
              <button className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
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
