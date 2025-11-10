"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
// import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import logo from "@/assets/logos/logo.webp";
import { useEffect, useState } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const [role, setRole] = useState<string | undefined>();

  const userNames: any = getDecryptedItem("name");
  const userName = userNames
    ? userNames.charAt(0).toUpperCase() + userNames.slice(1)
    : "User";

  useEffect(() => {
    setRole(getDecryptedItem("role") || "");
  }, []);

  const isUser = role === "user";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-3 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image src={logo} width={32} height={32} alt="" role="presentation" />
        </Link>
      )}

      <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-2xl font-bold text-dark dark:text-white">
          {/* Dashboard */}
        </h1>

        {isUser ? (
          <p className="font-medium">
            Welcome {userName ? <span>{userName}</span> : <span>Student</span>}
          </p>
        ) : (
          <p className="font-medium">Admin Dashboard For Course App</p>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        {/* <ThemeToggleSwitch /> */}
        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
