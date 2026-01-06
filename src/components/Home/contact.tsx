// components/Contact.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Contact: React.FC = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setFormSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => setFormSubmitted(false), 3000);
    };

    const contactInfo = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            ),
            title: "Call Us",
            description: "(+91) 9875905952",
            subtext: "Mon-Fri, 9AM-6PM EST"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
            ),
            title: "Email",
            description: "info@devexhub.com",
            subtext: "24/7 support"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            ),
            title: "Office",
            description: "devexhub course",
            subtext: "GR Square, Plot No D-254, 4th Floor, Phase-8A, Mohali"
        }
    ];

    return (
        <section className="py-12   bg-gradient-to-b from-background via-background to-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-4 md:mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 md:w-4 md:h-4">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        Get in Touch
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Let&apos;s Start a
                        <span className="bg-gradient-to-r from-primary to-[#ec4899] bg-clip-text text-transparent"> Conversation</span>
                    </h2>
                    <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                        Have questions about our courses? Need technical support? We&apos;re here to help you succeed in your learning journey.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                    {/* Left Column - Contact Info */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24">
                            <div className="bg-gradient-to-br from-card to-card/80 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl md:shadow-2xl border border-border/50 backdrop-blur-sm">
                                <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">
                                    Contact Information
                                </h3>
                                
                                <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                                    {contactInfo.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-muted/50 transition-colors group">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                                <div className="text-primary">
                                                    {item.icon}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-heading font-semibold text-foreground text-sm md:text-base">{item.title}</h4>
                                                <p className="text-foreground font-medium mt-0.5 text-sm md:text-base truncate">{item.description}</p>
                                                <p className="text-xs md:text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.subtext}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 md:p-6 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary to-[#8b5cf6] flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-heading font-semibold text-foreground text-sm md:text-base">Quick Response Time</h4>
                                            <p className="text-xs md:text-sm text-muted-foreground">Average reply: 2 hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form and Support Categories */}
                    <div className="lg:col-span-2">
                        {/* Contact Form */}
                        <div className="bg-card rounded-xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl md:shadow-2xl border border-border">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary to-[#8b5cf6] flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-7 md:h-7">
                                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                        <path d="m21.854 2.147-10.94 10.939"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Send us a Message</h2>
                                    <p className="text-muted-foreground text-sm md:text-base mt-1">
                                        Fill out the form below and we&apos;ll get back to you as soon as possible
                                    </p>
                                </div>
                            </div>

                            {formSubmitted ? (
                                <div className="text-center py-8 md:py-12">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 md:mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 w-6 h-6 md:w-8 md:h-8">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                    </div>
                                    <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">Message Sent Successfully!</h3>
                                    <p className="text-muted-foreground text-sm md:text-base px-4">
                                        Thank you for reaching out. We&apos;ll get back to you within 2-4 hours.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-1 md:gap-2" htmlFor="name">
                                                Your Name
                                            </label>
                                            <input 
                                                type="text" 
                                                className="w-full rounded-lg md:rounded-xl border-2 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base bg-background/50 border-border hover:border-primary/50 focus:border-primary focus:ring-2 md:focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                                                id="name" 
                                                placeholder="John Doe" 
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-1 md:gap-2" htmlFor="email">
                                                Email Address
                                            </label>
                                            <input 
                                                type="email" 
                                                className="w-full rounded-lg md:rounded-xl border-2 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base bg-background/50 border-border hover:border-primary/50 focus:border-primary focus:ring-2 md:focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                                                id="email" 
                                                placeholder="you@example.com" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-1 md:gap-2" htmlFor="subject">
                                            Subject
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full rounded-lg md:rounded-xl border-2 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base bg-background/50 border-border hover:border-primary/50 focus:border-primary focus:ring-2 md:focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                                            id="subject" 
                                            placeholder="How can we help?" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-1 md:gap-2" htmlFor="message">
                                            Your Message
                                        </label>
                                        <textarea 
                                            className="w-full rounded-lg md:rounded-xl border-2 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base bg-background/50 border-border hover:border-primary/50 focus:border-primary focus:ring-2 md:focus:ring-4 focus:ring-primary/20 transition-all duration-300 min-h-[120px] md:min-h-[180px] resize-none"
                                            id="message" 
                                            placeholder="Tell us more about your inquiry, question, or feedback..." 
                                            required 
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 pt-2 md:pt-4">
                                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground order-2 sm:order-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 md:w-4 md:h-4">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                            <span>Your information is secure and private</span>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="relative overflow-hidden group inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold text-white bg-gradient-to-r from-primary to-[#8b5cf6] hover:from-primary/90 hover:to-[#8b5cf6]/90 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto min-w-[160px] md:min-w-[200px] order-1 sm:order-2"
                                        >
                                            <span className="relative z-10">
                                                {isSubmitting ? "Sending..." : "Send Message"}
                                            </span>
                                            {!isSubmitting && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform">
                                                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                                    <path d="m21.854 2.147-10.94 10.939"></path>
                                                </svg>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;