// components/AboutSection.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Section } from "lucide-react";

const AboutSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="bg-white py-16 md:py-24">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 px-6 lg:px-12">
        {/* Left Image Section */}
        <div className="lg:w-1/2 px-4">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-primary to-secondary rounded-3xl opacity-20"></div>
            <div className="relative rounded-3xl shadow-2xl">
              <img className="w-full h-auto lg:max-h-[600px] max-h-auto object-cover rounded-3xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/398c939d3f-a754a9d30e1c3fe433a1.png" alt="professional online learning setup with laptop, headphones, and study materials, modern workspace illustration"></img>
              <div className=" animate-float absolute bottom-4 right-4 bg-gradient-to-br from-primary to-[#ec4899]  flex items-center space-x-2 rounded-xl bg-white p-4 shadow-md">
                    <div className="rounded-full bg-white p-2 text-yellow-600">
                     <svg className="svg-inline--fa fa-users w-5 h-5 text-primary" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"></path></svg></div>
                    <div className="text-white text-center">
                        <div className="text-start text-sm font-semibold ">1000+</div>
                        <div className="text-xs ">Students Trained</div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Content Section */}
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Learn & Grow Your Skills 
            <span className="bg-gradient-to-r from-primary to-[#ec4899] bg-clip-text text-transparent"> From Anywhere</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            DevexHub helps you learn the most in-demand skills quickly and
            effectively. With our practical courses and expert guidance, you can
            gain the knowledge and experience you need to grow in your
            career.Whether you want to start a new job, improve your current
            role, or explore new opportunities, DevexHub provides the tools and
            support to help you succeed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="svg-inline--fa fa-chalkboard-user w-5 h-5 text-white" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chalkboard-user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H336.8c-11.8-25.5-29.9-47.5-52.4-64H384V320c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V64L224 64v49.1C205.2 102.2 183.3 96 160 96V64zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352h53.3C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7H26.7C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Expert Trainers</h3>
                <p className="text-sm text-gray-600">Learn from industry professionals</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="svg-inline--fa fa-house-laptop w-5 h-5 text-white" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="house-laptop" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M218.3 8.5c12.3-11.3 31.2-11.3 43.4 0l208 192c6.7 6.2 10.3 14.8 10.3 23.5H336c-19.1 0-36.3 8.4-48 21.7V208c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h64V416H112c-26.5 0-48-21.5-48-48V256H32c-13.2 0-25-8.1-29.8-20.3s-1.6-26.2 8.1-35.2l208-192zM352 304V448H544V304H352zm-48-16c0-17.7 14.3-32 32-32H560c17.7 0 32 14.3 32 32V448h32c8.8 0 16 7.2 16 16c0 26.5-21.5 48-48 48H544 352 304c-26.5 0-48-21.5-48-48c0-8.8 7.2-16 16-16h32V288z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Remote Learning</h3>
                <p className="text-sm text-gray-600">Study from anywhere, anytime</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ec4899] to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="svg-inline--fa fa-infinity w-5 h-5 text-white" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="infinity" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M0 241.1C0 161 65 96 145.1 96c38.5 0 75.4 15.3 102.6 42.5L320 210.7l72.2-72.2C419.5 111.3 456.4 96 494.9 96C575 96 640 161 640 241.1v29.7C640 351 575 416 494.9 416c-38.5 0-75.4-15.3-102.6-42.5L320 301.3l-72.2 72.2C220.5 400.7 183.6 416 145.1 416C65 416 0 351 0 270.9V241.1zM274.7 256l-72.2-72.2c-15.2-15.2-35.9-23.8-57.4-23.8C100.3 160 64 196.3 64 241.1v29.7c0 44.8 36.3 81.1 81.1 81.1c21.5 0 42.2-8.5 57.4-23.8L274.7 256zm90.5 0l72.2 72.2c15.2 15.2 35.9 23.8 57.4 23.8c44.8 0 81.1-36.3 81.1-81.1V241.1c0-44.8-36.3-81.1-81.1-81.1c-21.5 0-42.2 8.5-57.4 23.8L365.3 256z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Lifetime Access</h3>
                <p className="text-sm text-gray-600">Access course materials forever</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="svg-inline--fa fa-briefcase w-5 h-5 text-white" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="briefcase" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Career Support</h3>
                <p className="text-sm text-gray-600">Job assistance &amp; guidance</p>
              </div>
            </div>
          </div>

          <a href="#courses" className="inline-flex items-center space-x-2 text-primary font-semibold text-lg hover:text-secondary transition-colors">
                    <span>Explore My Courses</span>
                   <svg className="svg-inline--fa fa-arrow-right w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path></svg>
                </a>
        </div>
      </div>
    
    </section>
  );
};

export default AboutSection;
