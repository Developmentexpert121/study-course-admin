import { Logo } from "@/components/logo";
import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";
import { useSidebarContext } from "./sidebar-context";

export function SidebarHeader() {
    const { isMobile, toggleSidebar, toggleDesktopMenu, isOpen } = useSidebarContext();

    return (
        <div className="relative mb-4 pr-4">
            {/* Desktop Close/Collapse Button */}
            {!isMobile && (
                <button
                    onClick={toggleDesktopMenu}
                    className={cn(
                        "absolute right-0 top-0 rounded-lg p-2 transition-all text-gray-500 hover:text-white hover:bg-[#02517b] dark:hover:bg-gray-800",
                        isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <ChevronLeft className={cn(
                        "h-4 w-4 transition-transform dark:text-gray-400",
                        isOpen ? "rotate-0" : "rotate-180"
                    )} />
                </button>
            )}

            {/* Logo Container */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    onClick={() => isMobile && toggleSidebar()}
                    className={cn(
                        "flex items-center transition-all duration-200",
                        isOpen ? "w-auto opacity-100" : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100"
                    )}
                >
                    <div className="h-10 w-9 flex-shrink-0">
                        <Logo />
                    </div>
                    {isOpen && (
                        <span className="ml-2 text-md font-bold text-gray-900 dark:text-white">
                            Your Brand
                        </span>
                    )}
                </Link>

                {/* Mobile Close Button - Only visible on mobile */}
                {isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="ml-auto rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}
            </div>

            {/* Collapsed state - Show mini logo */}
            {!isOpen && !isMobile && (
                <Link
                    href="/"
                    className="absolute left-4 top-0 flex h-10 w-10 items-center justify-center"
                    aria-label="Home"
                >
                    <div className="h-8 w-8">
                        <Logo />
                    </div>
                </Link>
            )}
        </div>
    );
}

// Add this if not already imported
import { cn } from "@/lib/utils";