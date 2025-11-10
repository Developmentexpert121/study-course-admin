import { Logo } from "@/components/logo";
import Link from "next/link";
import { ArrowLeftIcon } from "./icons";
import { useSidebarContext } from "./sidebar-context";

export function SidebarHeader() {
    const { isMobile, toggleSidebar } = useSidebarContext();

    return (
        <div className="relative pr-4.5">
            <Link
                href="/"
                onClick={() => isMobile && toggleSidebar()}
                className="px-0 py-2.5 min-[850px]:py-0 h-8 w-8"
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
    );
}
