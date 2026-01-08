"use client";

import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { MobileHeader } from "./MobileHeader";
import { MobileMenu } from "./MobileMenu";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const { isMobile, isOpen, isMobileMenuOpen } = useSidebarContext();
  if (isMobile) {
    return (
      <>
        <MobileHeader />
        <MobileMenu />
        {/* Add padding to account for fixed header */}
        <div className="h-16"></div>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "group sticky top-0 h-screen overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-dark",
        isOpen ? "w-[240px] min-w-[240]" : "w-[80px] hover:w-[290px]",
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col py-5 pl-[25px] pr-[7px]">
        <SidebarHeader />
        <SidebarNavigation />
        <SidebarUserProfile />
      </div>
    </aside>
  );
}
