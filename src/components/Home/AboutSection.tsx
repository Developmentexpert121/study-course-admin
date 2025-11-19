// components/AboutSection.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const AboutSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:flex-row md:px-12">
        {/* Left Image Section */}
        <div className="relative flex w-full justify-center md:w-1/2">
          <img
            src="/images/img2.png"
            alt="Learning"
            className="w-full rounded-2xl object-cover shadow-lg md:w-[90%]"
          />

          {/* Badge */}
          <div className="float absolute bottom-4 left-4 flex items-center space-x-2 rounded-xl bg-white p-4 shadow-md">
            <div className="rounded-full bg-teal-100 p-2 text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8.25v7.5m0 0l3.75-3.75M12 15.75l-3.75-3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">29+</p>
              <p className="text-xs text-gray-500">Wonderful Awards</p>
            </div>
          </div>
        </div>

        {/* Right Content Section */}
        <div className="w-full md:w-1/2">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            Learn & Grow Your Skills <br />
            From <span className="font-extrabold text-[#02517b]">Anywhere</span>
          </h2>
          <p className="mb-6 text-gray-500">
            DevexHub helps you learn the most in-demand skills quickly and
            effectively. With our practical courses and expert guidance, you can
            gain the knowledge and experience you need to grow in your
            career.Whether you want to start a new job, improve your current
            role, or explore new opportunities, DevexHub provides the tools and
            support to help you succeed.
          </p>

          <ul className="space-y-3">
            <li className="flex items-center font-medium text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#fbbf24"
                className="mr-2 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Expert Trainers
            </li>
            <li className="flex items-center font-medium text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#fbbf24"
                className="mr-2 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Online Remote Learning
            </li>
            <li className="flex items-center font-medium text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#fbbf24"
                className="mr-2 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Lifetime Access
            </li>
            <li className="flex items-center font-medium text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#fbbf24"
                className="mr-2 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Career Support & Guidance
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
