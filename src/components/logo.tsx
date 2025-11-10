import logo from "@/assets/logos/logo.webp";
import darktheme from "@/assets/logos/darktheme.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={"flex items-center justify-center"}>
      <Image
        src={logo}
        className={cn("dark:hidden", className)}
        alt="NextAdmin logo"
        role="presentation"
        width={100} // 10.847rem = 173.55px (1rem = 16px)
        height={100}    // h-8 = 2rem = 32px
        quality={50}
      />

      <Image
        src={darktheme}
        className={cn("hidden dark:block", className)}
        alt="NextAdmin logo"
        role="presentation"
        width={100}
        height={100}
        quality={50}
      />
    </div>
  );
}
