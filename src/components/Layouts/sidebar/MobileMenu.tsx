"use client";

import { useState, useEffect } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";
import { NAV_DATA } from "./data";
import { ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function MobileMenu() {
    const { isMobileMenuOpen, toggleMobileMenu } = useSidebarContext();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [role, setRole] = useState<string | undefined>();

    const toggleExpanded = (title: string) => {
        setExpandedItems((prev) =>
            prev.includes(title) ? [] : [title]
        );
    };

    useEffect(() => {
        const r: any = getDecryptedItem("role");
        setRole(r);
    }, []);

    const isUser = role === "user";
    const isAdmin = role === "admin";
    const isSuperAdmin = role === "Super-Admin";

    const filteredNavData = NAV_DATA.map((section: any) => ({
        ...section,
        items: section.items.filter((item: any) => {
            if (item.type === "both") return true;
            if (isSuperAdmin) return item.type === "Super-Admin";
            if (isAdmin) return item.type === "admin";
            if (isUser) return item.type === "user";
            return false;
        }),
    })).filter((section: any) => section.items.length > 0);

    return (
        <>
            {/* Overlay */}
            <div
                onClick={toggleMobileMenu}
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
                    isMobileMenuOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                )}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-60",
                    "bg-white dark:bg-gray-dark shadow-xl",
                    "transform transition-transform duration-300 ease-in-out",
                    isMobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                )}
            >
                {/* Content */}
                <div className="flex h-full flex-col overflow-y-auto p-6">
                   
                    {/* Close Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="mb-4 self-end text-xl font-bold"
                        aria-label="Close menu"
                    >
                        ✕
                    </button>

                    {/* LOGO */}
                    <div className="mb-6 flex items-center justify-center">
                        <Image
                         src="/images/logo.png"
                            alt="App Logo"
                            width={80}
                            height={40}
                            priority
                            
                        />
                    </div>


                    {/* Navigation */}
                    <div className="custom-scrollbar my-2 flex-1 overflow-y-auto pr-3 ">
                        {filteredNavData.map((section: any, index: number) => (
                            <div key={index}>
                                <h2 className="mb-4 text-sm font-medium ">
                                    {section.label}
                                </h2>

                                <nav aria-label={section.label}>
                                    <ul className="space-y-2">
                                        {section.items.map((item: any, itemIndex: number) => (
                                            <li key={itemIndex}>
                                                {/* WITH SUB MENU */}
                                                {item.items?.length ? (
                                                    <>
                                                        <MenuItem
                                                            onClick={() =>
                                                                toggleExpanded(item.title)
                                                            }
                                                            isActive={item.items.some(
                                                                ({ url }: { url: string }) =>
                                                                    url === window.location.pathname
                                                            )}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <item.icon className="size-5 shrink-0" />
                                                            <span>{item.title}</span>

                                                            <ChevronUp
                                                                className={cn(
                                                                    "ml-auto rotate-180 transition-transform",
                                                                    expandedItems.includes(item.title) &&
                                                                    "rotate-0"
                                                                )}
                                                            />
                                                        </MenuItem>

                                                        {expandedItems.includes(item.title) && (
                                                            <ul className="ml-9 mt-2 space-y-1">
                                                                {item.items.map(
                                                                    (subItem: any, subIndex: number) => (
                                                                        <li key={subIndex}>
                                                                            <MenuItem
                                                                                as="link"
                                                                                href={subItem.url}
                                                                                isActive={
                                                                                    window.location.pathname ===
                                                                                    subItem.url
                                                                                }
                                                                                className="flex items-center gap-3"
                                                                            >
                                                                                <span>{subItem.title}</span>
                                                                            </MenuItem>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        )}
                                                    </>
                                                ) : (
                                                    /* WITHOUT SUB MENU */
                                                    <MenuItem
                                                        as="link"
                                                        href={item.url}
                                                        isActive={
                                                            window.location.pathname === item.url
                                                        }
                                                        className="flex items-center gap-3"
                                                    >
                                                        <item.icon className="size-5 shrink-0" />
                                                        <span>{item.title}</span>
                                                    </MenuItem>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        ))}
                    </div>

                    {/* User Profile */}
                    <div className="border-t ">
                        <SidebarUserProfile />
                    </div>
                </div>
            </aside>
        </>
    );
}
