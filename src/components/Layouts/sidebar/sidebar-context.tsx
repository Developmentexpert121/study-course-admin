"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { createContext, useContext, useEffect, useState } from "react";

type SidebarState = "expanded" | "collapsed";

type SidebarContextType = {
  state: SidebarState;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  isDesktopMenuOpen: boolean;
  setIsDesktopMenuOpen: (open: boolean) => void;
  toggleDesktopMenu: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false); // Start with false to avoid hydration mismatch
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(true);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set initial state after mount to avoid hydration mismatch
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(defaultOpen);
    }
  }, [isMobile, defaultOpen]);

  function toggleMobileMenu() {
    setIsMobileMenuOpen((prev) => !prev);
  }
  function toggleDesktopMenu() {
    setIsDesktopMenuOpen((prev) => !prev);
  }

  function toggleSidebar() {
    if (isMobile) {
      toggleMobileMenu();
    } else {
      setIsOpen((prev) => !prev);
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SidebarContext.Provider
      value={{
        state: isOpen ? "expanded" : "collapsed",
        isOpen,
        setIsOpen,
        isMobile,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        isDesktopMenuOpen , 
        setIsDesktopMenuOpen , 
        toggleDesktopMenu
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
