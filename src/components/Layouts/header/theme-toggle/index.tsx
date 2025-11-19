import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

const THEMES = [
  {
    name: "light",
    label: "Light",
    Icon: Sun,
  },
  {
    name: "dark",
    label: "Dark",
    Icon: Moon,
  },
];

export function ThemeToggleSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="inline-flex gap-1  w-full rounded-full bg-gray-3 p-[5px] dark:bg-[#020D1A]">
      {THEMES.map(({ name, label, Icon }) => {
        const isActive = theme === name;

        return (
          <button
            key={name}
            onClick={() => setTheme(name)}
            className={cn(
              "flex items-center gap-2 items-center justify-center  w-1/2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 outline-1 outline-primary focus-visible:outline",
              isActive
                ? "bg-white text-[#111928] shadow-sm dark:bg-dark-2 dark:text-white"
                : "text-gray-6 hover:text-[#111928] dark:text-gray-6 dark:hover:text-white"
            )}
          >
            <span className="
 size-5 place-items-center">
              <Icon />
            </span>
            {/* <span>{label}</span> */}
          </button>
        );
      })}
    </div>
  );
}