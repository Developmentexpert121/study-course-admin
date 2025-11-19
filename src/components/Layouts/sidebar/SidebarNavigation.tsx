import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_DATA } from "./data";
import { ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { getDecryptedItem } from "@/utils/storageHelper";
import { cn } from "@/lib/utils";

export function SidebarNavigation() {
    const pathname = usePathname();
    const { isOpen, isMobile } = useSidebarContext();
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
                    if ((subItem as any).url === pathname) {
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

    return (
        <div className="custom-scrollbar mt-2 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {filteredNavData.map((section: any, index: number) => (
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
                                                    ({ url }: { url: string }) => url === pathname,
                                                )}
                                                onClick={() => toggleExpanded(item.title)}
                                            >
                                                <item.icon className="size-6 shrink-0" aria-hidden="true" />
                                                <span className={cn(isOpen ? "block" : "hidden group-hover:block")}>
                                                    {item.title}
                                                </span>
                                                <ChevronUp
                                                    className={cn(
                                                        "ml-auto rotate-180 transition-transform duration-200",
                                                        expandedItems.includes(item.title) && "rotate-0",
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </MenuItem>

                                            {expandedItems.includes(item.title) && (
                                                <ul
                                                    className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                                    role="menu"
                                                >
                                                    {item.items.map((subItem: any, index: number) => (
                                                        <li key={index} role="none">
                                                            <MenuItem
                                                                as="link"
                                                                href={subItem.url}
                                                                isActive={pathname === subItem.url}
                                                            >
                                                                <span>{subItem.title}</span>
                                                            </MenuItem>
                                                        </li>
                                                    ))}
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
                                                    <span className={cn(isOpen ? "block" : "hidden group-hover:block")}>
                                                        {item.title}
                                                    </span>
                                                </MenuItem>
                                            );
                                        })()
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            ))}
        </div>
    );
}
