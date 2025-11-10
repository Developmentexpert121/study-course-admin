// components/Footer.tsx
"use client";

import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

interface FooterProps {
  email: string;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const Footer: React.FC<FooterProps> = ({
  email,
  setEmail,
  handleSubmit,
  loading,
}) => {
  return (
    <footer className="bg-[#00537e] pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://www.facebook.com/devexhub"
                className="text-white transition hover:text-orange-500"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://x.com/devexhub"
                className="transition hover:text-orange-500"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/devexhub/#"
                className="transition hover:text-orange-500"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/devex-hub"
                className="transition hover:text-orange-500"
              >
                <FaLinkedinIn />
              </a>
            </div>
            <p className="mt-4 text-white">
              Learn in-demand skills and advance your career with our expert-led
              courses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="home#courses" className="text-white transition">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-white transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xl font-semibold text-white">
              Contact Us
            </h3>
            <p className="text-white">123 Main Street, Mohali, Punjab</p>
            <p className="mt-2 text-white">Email: info@devexhub.com</p>
            <p className="mt-2 text-white">Phone: +91 98765 43210</p>
          </div>

          {/* Newsletter / Search */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">Subscribe / Search</h3>
            <p className="mb-3 text-white">
              Enter your email to get latest updates:
            </p>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-l-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="rounded-r-md bg-[#dcdcdc] px-4 py-2 text-[#000] transition hover:bg-[#c8c8c8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-500"></div>

        {/* Bottom Section */}
        <div className="mt-6 flex flex-col items-center justify-between text-sm text-white md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} DevexHub. All rights reserved.
          </p>
          <div className="mt-2 flex space-x-4 md:mt-0">
            <a href="#" className="transition hover:text-[#02517b]">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-[#02517b]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
