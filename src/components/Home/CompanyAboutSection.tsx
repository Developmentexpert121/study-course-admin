"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyAboutSection() {
  const [students, setStudents] = useState(0);
  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [mentors, setMentors] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const animate = (
            setter: React.Dispatch<React.SetStateAction<number>>,
            end: number,
            duration = 1500
          ) => {
            let startTime: number | null = null;
            
            const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
            
            const step = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutQuart(progress);
              
              const current = Math.floor(easedProgress * end);
              setter(current);
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                setter(end);
              }
            };
            
            window.requestAnimationFrame(step);
          };

          animate(setStudents, 1000);
          animate(setYears, 7);
          animate(setProjects, 100);
          animate(setMentors, 35);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated]);

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-[#02517b] to-[#ec4899] bg-clip-text text-transparent">
                DevexHub
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At DevexHub, our mission is to empower learners to unlock their
              full potential through accessible, high-quality, and
              industry-relevant education. We believe that learning should be
              practical, engaging, and tailored to modern career needs.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With a strong community of passionate mentors, DevexHub focuses on
              building skills that make you job-ready — from mastering new
              technologies to gaining confidence in real-world projects.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#dde1f0] to-[#ede2f8] p-6 rounded-xl transition-transform duration-300 hover:scale-[1.03]">
                <div className="text-4xl font-bold text-[#02517b] mb-2">
                  {students}+
                </div>
                <div className="text-gray-700 font-semibold">
                  Students Trained
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-xl transition-transform duration-300 hover:scale-[1.03]">
                <div className="text-4xl font-bold text-[#8b5cf6] mb-2">
                  {years}+
                </div>
                <div className="text-gray-600">Years Experience</div>
              </div>

              <div className="bg-gradient-to-br from-pink-100 to-orange-100 p-6 rounded-xl transition-transform duration-300 hover:scale-[1.03]">
                <div className="text-4xl font-bold text-pink-500 mb-2">
                  {projects}%
                </div>
                <div className="text-gray-600">Project Based</div>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-xl transition-transform duration-300 hover:scale-[1.03]">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {mentors}+
                </div>
                <div className="text-gray-600">Mentor Support</div>
              </div>
            </div>


           
          </div>

          <div className="lg:w-1/2">
            <div className="relative">
              <img
                className="w-full h-auto rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2fe5bb733b-6a54ba006b2ebb174905.png"
                alt="Happy diverse students collaborating on tech projects, modern learning environment, teamwork, success celebration, bright professional setting"
              />

              <div className="absolute bottom-4 right-4 flex items-center space-x-2 rounded-xl bg-white p-4 shadow-lg animate-float">
                <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Expert Mentors</p>
                  <p className="text-xs text-gray-500">Industry Professionals</p>
                </div>
              </div>
            </div>

       
          </div>
        </div>
      </div>

      {/* Add CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}