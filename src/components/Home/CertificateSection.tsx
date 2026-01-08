// components/CertificateSection.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CertificateSection: React.FC = () => {
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary to-[#ec4899]   bg-center bg-no-repeat py-20"
      // style={{ backgroundImage: "url('/images/bg.jpg')" }}
    >
 
      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center ">
        <svg className="svg-inline--fa fa-certificate w-20 h-20 text-white mx-auto mb-5" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="certificate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M211 7.3C205 1 196-1.4 187.6 .8s-14.9 8.9-17.1 17.3L154.7 80.6l-62-17.5c-8.4-2.4-17.4 0-23.5 6.1s-8.5 15.1-6.1 23.5l17.5 62L18.1 170.6c-8.4 2.1-15 8.7-17.3 17.1S1 205 7.3 211l46.2 45L7.3 301C1 307-1.4 316 .8 324.4s8.9 14.9 17.3 17.1l62.5 15.8-17.5 62c-2.4 8.4 0 17.4 6.1 23.5s15.1 8.5 23.5 6.1l62-17.5 15.8 62.5c2.1 8.4 8.7 15 17.1 17.3s17.3-.2 23.4-6.4l45-46.2 45 46.2c6.1 6.2 15 8.7 23.4 6.4s14.9-8.9 17.1-17.3l15.8-62.5 62 17.5c8.4 2.4 17.4 0 23.5-6.1s8.5-15.1 6.1-23.5l-17.5-62 62.5-15.8c8.4-2.1 15-8.7 17.3-17.1s-.2-17.3-6.4-23.4l-46.2-45 46.2-45c6.2-6.1 8.7-15 6.4-23.4s-8.9-14.9-17.3-17.1l-62.5-15.8 17.5-62c2.4-8.4 0-17.4-6.1-23.5s-15.1-8.5-23.5-6.1l-62 17.5L341.4 18.1c-2.1-8.4-8.7-15-17.1-17.3S307 1 301 7.3L256 53.5 211 7.3z"></path></svg>
        <h1 className="mb-4 text-center text-xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Earn a Professional{" "}
          <span className="text-white">Certificate</span> and Advance Your
          Skills
        </h1>
        <p className="text-xl text-white mb-8">
                Complete our comprehensive courses and receive industry-recognized certifications that boost your career prospects
            </p>

        <a
          onClick={() => router.push("/auth/register")}
          className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all hover:scale-105"
        >
          Get started now →
        </a>
      </div>
    </section>
  );
};

export default CertificateSection;
