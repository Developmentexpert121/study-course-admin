"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { getDecryptedItem, removeEncryptedItem } from "@/utils/storageHelper";
import Image from "next/image";
import { useApiClient } from "@/lib/api";
import { trackLogoutActivity } from "../../../store/slices/adminslice/adminlogout";

import { toasterSuccess } from "@/components/core/Toaster";
import { AppDispatch } from "../../../store/index";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { ThemeToggleSwitch } from "../../../../src/components/Layouts/header/theme-toggle/index";

export function Sidebar() {
  const pathname = usePathname();
  const api = useApiClient();
  const name = getDecryptedItem("name");
  const dispatch = useDispatch<AppDispatch>();
  const email = getDecryptedItem("email");
  const [userImage, setUserImage] = useState("/images/user2.png");
  const [loading, setLoading] = useState(true);
  const [profileImageLoading, setProfileImageLoading] = useState(true);
  const USER: any = {
    name: name,
    email: email,
    img: "/images/user2.png",
  };

  useEffect(() => {
    const userId = getDecryptedItem("userId");

    const fetchProfileImage = async () => {
      try {
        setProfileImageLoading(true);
        const res = await api.get(`upload/${userId}`);
        if (res?.data?.success) {
          const { profileImage } = res.data.data;
          setUserImage(profileImage || "/images/user2.png");
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      } finally {
        setProfileImageLoading(false);
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfileImage();
    } else {
      setLoading(false);
      setProfileImageLoading(false);
    }

    const handleImageUpdate = (event: CustomEvent) => {
      if (event.detail?.profileImageUrl) {
        setUserImage(event.detail.profileImageUrl);
        setProfileImageLoading(false);
      } else {
        fetchProfileImage();
      }
    };

    window.addEventListener(
      "profile-image-updated",
      handleImageUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "profile-image-updated",
        handleImageUpdate as EventListener,
      );
    };
  }, []);

  // Add this inside your Sidebar component, before the return statement
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [role, setRole] = useState<string | undefined>();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    const r: any = getDecryptedItem("role");
    setRole(r);
  }, []);

  useEffect(() => {
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items?.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }
            return true;
          }
        });
      });
    });
  }, [pathname]);

  const isUser = role === "user";
  const isAdmin = role === "admin";
  const isSuperAdmin = role === "Super-Admin";

  const getFilteredNavData = () => {
    return NAV_DATA.map((section: any) => ({
      ...section,
      items: section.items.filter((item: any) => {
        if (item.type === "both") {
          return true;
        }

        if (isSuperAdmin) {
          return item.type === "Super-Admin";
        }

        if (isAdmin) {
          return item.type === "admin";
        }

        if (isUser) {
          return item.type === "user";
        }

        return false;
      }),
    })).filter((section: any) => section.items.length > 0);
  };

  const filteredNavData = getFilteredNavData();

  const getHomeRoute = () => {
    if (isSuperAdmin) return "/";
    if (isAdmin) return "/";
    if (isUser) return "/";
    return "/";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-5 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={getHomeRoute()}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 flex h-[37px] w-[37px] -translate-y-1/2 items-center justify-center rounded-[25px] bg-[#02517b] text-right font-semibold text-white"
              >
                <span className="sr-only">Close Menu</span>
                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-2 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {loading ? (
              // Navigation Skeleton
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, sectionIndex) => (
                  <div key={sectionIndex} className="mb-6">
                    {/* Section Title Skeleton */}
                    <div className="mb-5 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

                    {/* Menu Items Skeleton */}
                    <ul className="space-y-2">
                      {Array.from({ length: 4 }).map((_, itemIndex) => (
                        <li key={itemIndex}>
                          <div className="flex items-center gap-3 px-3 py-3">
                            <div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              // Actual Navigation Content
              filteredNavData.map((section: any, index: number) => (
                <div key={index} className="mb-6">
                  <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                    {section.label}
                  </h2>

                  <nav role="navigation" aria-label={section.label}>
                    <ul className="fvdg space-y-2">
                      {section.items.map((item: any, index: number) => (
                        <li key={index}>
                          {item.items && item.items.length > 0 ? (
                            <div>
                              <MenuItem
                                isActive={item.items.some(
                                  ({ url }: { url: string }) =>
                                    url === pathname,
                                )}
                                onClick={() => toggleExpanded(item.title)}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{item.title}</span>

                                <ChevronUp
                                  className={cn(
                                    "ml-auto rotate-180 transition-transform duration-200",
                                    expandedItems.includes(item.title) &&
                                      "rotate-0",
                                  )}
                                  aria-hidden="true"
                                />
                              </MenuItem>

                              {expandedItems.includes(item.title) && (
                                <ul
                                  className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                  role="menu"
                                >
                                  {item.items.map(
                                    (subItem: any, index: number) => (
                                      <li key={index} role="none">
                                        <MenuItem
                                          as="link"
                                          href={subItem.url}
                                          isActive={pathname === subItem.url}
                                        >
                                          <span>{subItem.title}</span>
                                        </MenuItem>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : (
                            (() => {
                              const href =
                                item.url ||
                                "/" +
                                  item.title.toLowerCase().split(" ").join("-");

                              return (
                                <MenuItem
                                  className="flex items-center gap-3 py-3"
                                  as="link"
                                  href={href}
                                  isActive={pathname === href}
                                >
                                  <item.icon
                                    className="size-6 shrink-0"
                                    aria-hidden="true"
                                  />

                                  <span>{item.title}</span>
                                </MenuItem>
                              );
                            })()
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              ))
            )}
          </div>

          {/* User Profile Section */}
          <div className="relative" ref={dropdownRef}>
            {loading ? (
              // User Profile Skeleton
              <div className="flex items-center gap-2.5 px-5 py-3.5">
                <div className="size-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ) : (
              // Actual User Profile Content
              <>
                <figure
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="relative">
                    {profileImageLoading ? (
                      <div className="size-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <Image
                        src={userImage}
                        className="size-12 overflow-hidden rounded-full"
                        alt={`Avatar for ${USER.name}`}
                        role="presentation"
                        width={200}
                        height={200}
                        onLoad={() => setProfileImageLoading(false)}
                        onError={() => setProfileImageLoading(false)}
                      />
                    )}
                  </div>

                  <figcaption className="space-y-1 text-base font-medium">
                    <div className="mb-2 leading-none text-dark dark:text-white">
                      {USER.name}
                    </div>
                    <div className="leading-none text-gray-6">{USER.email}</div>
                  </figcaption>
                </figure>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-dark">
                    <ul className="py-1">
                      <li className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800">
                        <ThemeToggleSwitch />
                      </li>

                      <li>
                        <Link
                          href="/view-profile"
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            isMobile && toggleSidebar();
                          }}
                        >
                          <svg
                            className="size-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={getHomeRoute()}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            isMobile && toggleSidebar();
                          }}
                        >
                          <svg
                            className="size-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          Home
                        </Link>
                      </li>
                      <li>
                        <button
                          className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                          onClick={async () => {
                            try {
                              const adminId = parseInt(
                                getDecryptedItem("userId") || "0",
                              );
                              if (adminId) {
                                await dispatch(
                                  trackLogoutActivity(adminId),
                                ).unwrap();
                              }
                              removeEncryptedItem("token");
                              removeEncryptedItem("refreshToken");
                              removeEncryptedItem("userId");
                              removeEncryptedItem("name");
                              removeEncryptedItem("email");
                              removeEncryptedItem("role");

                              setIsOpen(false);
                              toasterSuccess("Logout Successfully", 2000, "id");
                              window.location.href = "/";
                            } catch (error) {
                              console.error(
                                "Failed to track logout activity:",
                                error,
                              );

                              removeEncryptedItem("token");
                              removeEncryptedItem("refreshToken");
                              removeEncryptedItem("userId");
                              removeEncryptedItem("name");
                              removeEncryptedItem("email");
                              removeEncryptedItem("role");
                              setIsOpen(false);
                              toasterSuccess("Logout Successfully", 2000, "id");
                              window.location.href = "/";
                            }
                          }}
                        >
                          <LogOut size={18} className="text-gray-700" />
                          <span className="text-base font-medium">Log out</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
