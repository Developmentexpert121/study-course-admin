"use client";

import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { MobileHeader } from "./MobileHeader";
import { MobileMenu } from "./MobileMenu";
import { useSidebarContext } from "./sidebar-context";

interface SidebarProps {
  role?: string;
  permissions?: string[];
}

export function Sidebar({ role, permissions = [] }: SidebarProps) {
  const { isMobile, isOpen, isMobileMenuOpen } = useSidebarContext();

  if (isMobile) {
    return (
      <>
        <MobileHeader role={role} permissions={permissions} />
        <MobileMenu role={role} permissions={permissions} />
        {/* Add padding to account for fixed header */}
        <div className="h-16"></div>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "group sticky top-0 h-screen overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-dark",
        isOpen ? "w-[290px]" : "w-[80px] hover:w-[290px]",
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col py-5 pl-[25px] pr-[7px]">
        <SidebarHeader />
        <SidebarNavigation role={role} permissions={permissions} />
        <SidebarUserProfile role={role} />
      </div>
    </aside>
  );
}
