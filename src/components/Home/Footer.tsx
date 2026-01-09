// components/Footer.tsx
"use client";

import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaBehance,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";

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
  const socialLinks = [
    { icon: <FaTwitter />, label: "Twitter", href: "#" },
    { icon: <FaLinkedinIn />, label: "LinkedIn", href: "#" },
    { icon: <FaInstagram />, label: "Instagram", href: "#" },
    { icon: <FaYoutube />, label: "YouTube", href: "#" },
    { icon: <FaBehance />, label: "Behance", href: "#" },
    { icon: <FaFacebookF />, label: "Facebook", href: "#" },
  ];

  return (
    <footer id="footer" className="bg-gradient-to-br from-primary to-[#ec4899] pb-8 pt-16 text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Intro Text */}
        <div className="text-center mb-12 animate-fade-in">
          <h3 className="text-lg md:text-xl font-medium leading-8 max-w-3xl mx-auto text-primary-foreground/90">
          Expert-led courses that focus on real skills, real practice, and real career outcomes.
          </h3>
        </div>

        {/* Footer Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-between">

          {/* Address Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left animate-fade-in w-full lg:w-auto" style={{ animationDelay: "100ms" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 btn-animate hover:bg-white/30 transition-colors flex-shrink-0">
              <FaMapMarkerAlt className="text-white text-xl" />
            </div>
            <div>
              <p className="text-primary-foreground/80 text-sm  max-w-xs">
                GR Square, Plot No D-254, 4th Floor,<br />
                Phase-8A, Mohali, Punjab 160062
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in w-full lg:w-auto" style={{ animationDelay: "200ms" }}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white btn-animate hover:bg-white/30 hover:scale-110 transition-all duration-300"
                aria-label={social.label}
              >
                <span className="text-lg">{social.icon}</span>
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <div className="flex justify-center md:justify-between gap-6 animate-fade-in w-full lg:w-auto" style={{ animationDelay: "300ms" }}>
            {/* Phone */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://wa.me/919875905952"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white btn-animate hover:bg-green-700 hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-xl" />
              </a>
              <div className="text-center sm:text-left">
                <p className="text-primary-foreground/80 text-sm">WhatsApp</p>
                <a href="tel:+919875905952" className="text-white font-medium hover:underline">
                  (+91) 9875905952
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="mailto:info@devexhub.com"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white btn-animate hover:bg-white/30 hover:scale-110 transition-all duration-300"
                aria-label="Email"
              >
                <FiMail className="text-xl" />
              </a>
              <div className="text-center sm:text-left">
                <p className="text-primary-foreground/80 text-sm">Email</p>
                <a href="mailto:info@devexhub.com" className="text-white font-medium hover:underline">
                  info@devexhub.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/20 text-center animate-fade-in">
          <p className="text-primary-foreground/70 text-sm ">
            Copyright © 2026. Powered by DevexHub.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;