// components/Banner.tsx
"use client";

import React from "react";

const Banner: React.FC = () => {
  return (
    <div
      className="banner pt-20 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden"
    // style={{ backgroundImage: "url('/images/img1.jpg')" }}
    >
      <div className="max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            grid grid-cols-1 lg:grid-cols-2
            gap-6 md:gap-12
            items-center
            h-auto md:h-full">
        <div className="animate-fadeInUp">
          <h1 className="lg:text-5xl md:3xl font-extrabold text-4xl text-gray-900 leading-tight mb-6 capitalize">
            Learn the skills today that   
           <span className="bg-gradient-to-r from-primary to-[#ec4899] bg-clip-text text-transparent mr-2">  shape your future</span> 
             Tomorrow
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
Build skills that matter with expert-led training in web, design, marketing, and AI automation.
          </p>
          <a
            href="#courses"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-[#8b5cf6] text-white rounded-lg font-semibold text-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            Explore Courses
            <svg
              className="ml-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </a>

          <div className="flex items-center space-x-8 mt-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="svg-inline--fa fa-code w-1/2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"></path></svg>
              </div>
              <span className="text-gray-700 font-medium">Web</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          
                  <svg
                    className="svg-inline--fa fa-brain w-1/2"
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"
                    ></path>
                  </svg>
    
              </div>
              <span className="text-gray-700 font-medium">AI</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
       
                  <svg
                    className="svg-inline--fa fa-palette w-1/2"
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                    ></path>
                  </svg>
         
              </div>
              <span className="text-gray-700 font-medium">UX</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
   
                  <svg
                    className="svg-inline--fa fa-chart-line w-1/2"
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"
                    ></path>
                  </svg>
           
              </div>
              <span className="text-gray-700 font-medium">SEO</span>
            </div>
          </div>
        </div>

        <div className="relative">
         <div className="relative z-10 animate-float  mx-auto px-4 sm:px-6">
  <img
    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/36dd1175e6-26ec8983bba178e95ff6.png"
    alt="modern students learning coding on laptops in colorful digital classroom"
    className="w-full h-auto rounded-2xl shadow-2xl object-contain"
    loading="lazy"
  />
</div>

          <div className="absolute -top-8 -right-8 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        </div>
      </div>


    </div>
  );
};

export default Banner;
