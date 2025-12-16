"use client";

import { getDecryptedItem } from "@/utils/storageHelper";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaBriefcase, FaLaptopCode, FaHandsHelping, FaCheck, FaPhoneAlt } from "react-icons/fa";

const AboutPage = () => {
    const router = useRouter();
  useEffect(() => {
    // Initialize AOS-like animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".observe").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

    const [menuOpen, setMenuOpen] = useState(false);
     const name: any = getDecryptedItem("name");
     
  return (
    <div className="min-h-screen bg-gray-50">

          <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight text-blue-600">
            <img src="/images/logo.png" className="w-[50px]" alt="Logo" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
            <a href="/" className="transition hover:text-blue-600">
              Home
            </a>
            <a href="/courses" className="transition hover:text-blue-600">
              Courses
            </a>
            <a href="/#about" className="text-blue-600">
              About
            </a>
          </nav>

          {/* Login / Sign Up */}
        {name ? 
          
          (
<div>            <h1 className="font-medium text-gray-700 hover:text-blue-600">{name}</h1>  <button className="hover:bg-#d3cece rounded-full bg-[#02517b] px-5 py-2 text-white transition hover:bg-[#d3cece] hover:text-black" onClick={()=> router.push(`/user/dashboard`)}>dashboard</button></div>
          ):(
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
          </div>) }

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

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-[#0b5176] text-white">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        <div className="container relative z-10 mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:justify-between">
            {/* Hero Text */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
                Enhance Devexhub Journey
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/90 md:text-xl">
                Since 2018, Devex Hub has been more than just a training center—
                we're a launchpad for brighter futures. We don't just teach skills, 
                we teach purpose.
              </p>
              <a 
                href="#courses"
                className="inline-block rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-[#0b5176]"
              >
                Start Learning
              </a>
            </div>

            {/* Hero Image */}
            <div className="relative flex-1">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                  alt="Team collaboration"
                  className="w-full rounded-lg shadow-2xl"
                />
                
                {/* Floating Card 1 */}
                <div className="absolute left-4 top-[20%] flex animate-float items-center gap-3 rounded-lg bg-white p-4 shadow-lg">
                  <FaGraduationCap className="text-2xl text-[#235b7f]" />
                  <span className="font-semibold text-gray-800">10+ Years of Excellence</span>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-[15%] right-4 flex animate-float-delayed items-center gap-3 rounded-lg bg-white p-4 shadow-lg">
                  <FaBriefcase className="text-2xl text-[#235b7f]" />
                  <span className="font-semibold text-gray-800">Trusted Mentors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              About Devex Hub
            </h2>
            <div className="mx-auto h-1 w-32 bg-[#095075]" />
            <p className="mx-auto mt-6 max-w-2xl text-gray-600">
              Empowering businesses and students with cutting-edge IT solutions
              and practical training since 2018.
            </p>
          </div>

          <div className="flex flex-col gap-12 md:flex-row md:items-start">
            {/* Text Content */}
            <div className="observe flex-1 opacity-0">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Our Journey</h3>
              <p className="mb-4 text-gray-600">
                Started in <span className="font-semibold text-[#095075]">2018</span>, 
                Devex Hub began with a simple vision to boost online presence and sales 
                not only for businesses but also to help students build practical skills 
                in today's fast-growing IT world.
              </p>

              <p className="mb-6 text-gray-600">
                Based in <span className="font-semibold text-[#095075]">Mohali, India</span>, 
                Devex Hub is a registered Industrial Training Institute that has evolved 
                into a full-service Web Development, Web Designing, and Digital Marketing 
                company. Over the years, we've grown into a trusted name in the IT industry.
              </p>

              <h3 className="mb-4 text-2xl font-bold text-gray-900">Our Approach</h3>
              <p className="text-gray-600">
                At Devex Hub, we believe in{" "}
                <span className="font-semibold text-[#095075]">learning by doing</span>. 
                Our expert team works on live projects and also trains students using 
                those same real-world scenarios.
              </p>
            </div>

            {/* Image with Badge */}
            <div className="observe relative flex-1 opacity-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                alt="Devex Hub Team"
                className="w-full rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 rounded-lg bg-[#095075] p-6 text-center text-white shadow-xl">
                <h4 className="text-4xl font-bold">10+</h4>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            <div className="observe rounded-lg bg-white p-8 shadow-lg opacity-0 transition-all hover:-translate-y-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <FaLaptopCode className="text-3xl text-[#095075]" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-gray-900">Practical Training</h4>
              <p className="text-gray-600">
                Our training programs are designed to be beginner-friendly, up-to-date, 
                and aligned with the latest industry standards.
              </p>
            </div>

            <div className="observe rounded-lg bg-white p-8 shadow-lg opacity-0 transition-all hover:-translate-y-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <FaBriefcase className="text-3xl text-[#095075]" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-gray-900">Industry Ready</h4>
              <p className="text-gray-600">
                Whether you want to learn website designing, coding, SEO, or social 
                media marketing, we're here to help you build the skills that matter.
              </p>
            </div>

            <div className="observe rounded-lg bg-white p-8 shadow-lg opacity-0 transition-all hover:-translate-y-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <FaHandsHelping className="text-3xl text-[#095075]" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-gray-900">Bridging the Gap</h4>
              <p className="text-gray-600">
                Our aim is to bridge the gap between academic learning and industry 
                demands—making you job-ready from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0b5176] to-[#095075] py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            An Industrial Training Program Designed for Your Future
          </h2>
          <p className="mb-8 text-lg md:text-xl">
            We train students in Web Development, Digital Marketing, Designing, and 
            AI Automation—focusing on in-demand skills that lead to real career opportunities.
          </p>
          
          <div className="mb-8 flex flex-col items-center justify-center gap-6 md:flex-row">
            <button className="rounded-lg bg-white px-8 py-3 font-semibold text-[#0b5176] transition hover:bg-gray-100">
              Start Your Journey
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <FaPhoneAlt className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm">Call Us On:</p>
                <p className="text-lg font-bold">(+91) 9875905952</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "10+ Years of Experience",
              "Job Placement Support",
              "Industry-Recognized Certificates",
              "Expert Trainers",
              "Practical Live Projects",
              "Post-Course Help",
              "Complete Course Coverage",
              "24/7 Learning Access"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-left">
                <FaCheck className="text-green-400" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Model Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Training Model
          </h2>
          
          <div className="flex flex-col justify-center gap-8 md:flex-row">
            <div className="observe flex items-center gap-6 rounded-xl border-2 border-gray-200 bg-white p-8 opacity-0 shadow-lg transition hover:border-[#095075]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3676/3676617.png"
                alt="In-Classroom Training"
                className="h-24 w-24"
              />
              <span className="text-xl font-semibold text-gray-800">
                In-Classroom Training
              </span>
            </div>

            <div className="observe flex items-center gap-6 rounded-xl border-2 border-gray-200 bg-white p-8 opacity-0 shadow-lg transition hover:border-[#095075]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3050/3050155.png"
                alt="Self Learning"
                className="h-24 w-24"
              />
              <span className="text-xl font-semibold text-gray-800">
                Self Learning
              </span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;