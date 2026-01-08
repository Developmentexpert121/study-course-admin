"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  useAppSelector,
  useAppDispatch,
} from "@/store";
import {
  getAllRatings,
  selectRatings,
} from "@/store/slices/adminslice/ratinguser";
import {
  fetchActiveCourses,
  selectAllCourses,
  selectCoursesLoading,
  selectCoursesError,
  selectCoursesCount,
} from "@/store/slices/homepage/homepage";

import {
  storeEmail,
  clearError,
  clearSuccess,
} from "@/store/slices/homepage/emailSlice";
import { selectEmailSuccess } from "@/store/slices/homepage/emailSlice";
import { toast } from "react-toastify";
import { toasterError } from "@/components/core/Toaster";
import { getDecryptedItem } from "@/utils/storageHelper";
import Banner from "@/components/Home/Banner";
import Header from "@/components/Home/Header";
import AboutSection from "@/components/Home/AboutSection";
import CoursesSection from "@/components/Home/CoursesSection";
import CompanyAboutSection from "@/components/Home/CompanyAboutSection";
import CertificateSection from "@/components/Home/CertificateSection";
import Testimonial from "@/components/Home/Testimonial";
import Footer from "@/components/Home/Footer";
import Contact  from "@/components/Home/contact";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const name: any = getDecryptedItem("name");
  const role: any = getDecryptedItem("role");

  const courses = useSelector(selectAllCourses);
  const loading = useSelector(selectCoursesLoading);
  const error = useSelector(selectCoursesError);
  const count = useSelector(selectCoursesCount);
  const ratings = useAppSelector(selectRatings);

  const [email, setEmail] = useState("");
  const success = useAppSelector(selectEmailSuccess);

  useEffect(() => {
    dispatch(fetchActiveCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllRatings());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Clear previous messages
    dispatch(clearError());
    dispatch(clearSuccess());

    try {
      await dispatch(storeEmail({ email: email.trim() })).unwrap();
      toast.success(
        "Thank you for subscribing! You have been added to our mailing list.",
      );
      setEmail("");
    } catch (err) {
      toast.error("This email is already subscribed!");
      setEmail("");
      // Error is already handled in the slice
    }
  };

  return (
    <div className="bg-gray-50">
      <Header name={name} role={role} />
      <Banner />
      <div className="bg-gray-50">
        <AboutSection />
        <CoursesSection courses={courses} />
      </div>
      <CompanyAboutSection />
      <CertificateSection />
      <Testimonial ratings={ratings?.ratings || []} />
      <Contact/>
      <Footer
        email={email}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default Home;
