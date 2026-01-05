// components/CompanyAboutSection.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CompanyAboutSection: React.FC = () => {
  const router = useRouter();

  return (
    // <section id="about" className="bg-gray-50 py-16 md:py-24">
    //   <div className="container mx-auto flex flex-col-reverse items-center gap-10 px-6 md:flex-row md:px-12">
    //     {/* Left Content Section */}
    //     <div className="w-full md:w-1/2">
    //       <h2 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
    //         About <span className="text-[#02517b]">DevexHub</span>
    //       </h2>
    //       <p className="mb-6 text-gray-500">
    //         At DevexHub, our mission is to empower learners to unlock their full
    //         potential through accessible, high-quality, and industry-relevant
    //         education. We believe that learning should be practical, engaging,
    //         and tailored to modern career needs.
    //       </p>
    //       <p className="mb-6 text-gray-500">
    //         With a strong community of passionate mentors, DevexHub focuses on
    //         building skills that make you job-ready — from mastering new
    //         technologies to gaining confidence in real-world projects.
    //       </p>

    //       <ul className="mb-8 space-y-3">
    //         <li className="flex items-center font-medium text-gray-700">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="2"
    //             stroke="#fbbf24"
    //             className="mr-2 h-5 w-5"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M5 13l4 4L19 7"
    //             />
    //           </svg>
    //           1000+ Students Trained
    //         </li>
    //         <li className="flex items-center font-medium text-gray-700">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="2"
    //             stroke="#fbbf24"
    //             className="mr-2 h-5 w-5"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M5 13l4 4L19 7"
    //             />
    //           </svg>
    //           Real-World Project Based Learning
    //         </li>
    //         <li className="flex items-center font-medium text-gray-700">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="2"
    //             stroke="#fbbf24"
    //             className="mr-2 h-5 w-5"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M5 13l4 4L19 7"
    //             />
    //           </svg>
    //           Dedicated Mentor Support
    //         </li>
    //         <li className="flex items-center font-medium text-gray-700">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="2"
    //             stroke="#fbbf24"
    //             className="mr-2 h-5 w-5"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M5 13l4 4L19 7"
    //             />
    //           </svg>
    //           Job & Internship Assistance
    //         </li>
    //       </ul>

    //       {/* About Us Button */}
    //       <button
    //         className="rounded-full bg-[#02517b] px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#0369a1] hover:shadow-lg"
    //         onClick={() => router.push(`auth/about`)}
    //       >
    //         About Us
    //       </button>
    //     </div>

    //     {/* Right Image Section */}
    //     <div className="relative flex w-full justify-center md:w-1/2">
    //       <img
    //         src="/images/about.jpg"
    //         alt="About DevexHub"
    //         className="w-full rounded-2xl object-cover shadow-lg md:w-[90%]"
    //       />

    //       {/* Badge */}
    //       <div className="absolute bottom-4 right-4 flex items-center space-x-2 rounded-xl bg-white p-4 shadow-md">
    //         <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="2"
    //             stroke="currentColor"
    //             className="h-5 w-5"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M12 8.25v7.5m0 0l3.75-3.75M12 15.75l-3.75-3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    //             />
    //           </svg>
    //         </div>
    //         <div>
    //           <p className="text-sm font-semibold text-gray-800">7+ Years</p>
    //           <p className="text-xs text-gray-500">Experience in Training</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
        <section id="about" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">About <span className="bg-gradient-to-r from-primary to-[#ec4899] bg-clip-text text-transparent">DevexHub</span></h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    At DevexHub, our mission is to empower learners to unlock their full potential through accessible, high-quality, and industry-relevant education. We believe that learning should be practical, engaging, and tailored to modern career needs.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    With a strong community of passionate mentors, DevexHub focuses on building skills that make you job-ready — from mastering new technologies to gaining confidence in real-world projects.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#dde1f0] to-[#ede2f8] p-6 rounded-xl">
                        <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                        <div className="text-gray-700 font-semibold">Students Trained</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-xl">
                        <div className="text-4xl font-bold text-[#8b5cf6]  mb-2">7+</div>
                        <div className="text-gray-600">Years Experience</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-orange-100 p-6 rounded-xl">
                        <div className="text-4xl font-bold text-pink-500 mb-2">100%</div>
                        <div className="text-gray-600">Project Based</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-xl">
                        <div className="text-4xl font-bold text-orange-500 mb-2">7+</div>
                        <div className="text-gray-600">Mentor Support</div>
                    </div>
                </div>
                
          
            </div>
            
            <div className="lg:w-1/2">
               <div className="relative">
                <img className="w-full h-auto rounded-2xl shadow-2xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2fe5bb733b-6a54ba006b2ebb174905.png" alt="Happy diverse students collaborating on tech projects, modern learning environment, teamwork, success celebration, bright professional setting"></img>
                <div className="animate-float absolute bottom-4 right-4 flex items-center space-x-2 rounded-xl bg-white p-4 shadow-md">
                    <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">    


                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v7.5m0 0l3.75-3.75M12 15.75l-3.75-3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">7+ Years</p>
                        <p className="text-xs text-gray-500">Experience in Training</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</section>
  );
};

export default CompanyAboutSection;
