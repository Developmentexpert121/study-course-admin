import { useState, useEffect } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";
import { NAV_DATA } from "./data";
import { ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { cn } from "@/lib/utils";

export function MobileMenu() {
    const { isMobileMenuOpen, toggleMobileMenu, isMobile } = useSidebarContext();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [role, setRole] = useState<string | undefined>();

    const toggleExpanded = (title: string) => {
        setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
    };

    useEffect(() => {
        const r: any = getDecryptedItem("role");
        setRole(r);
    }, []);

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

    if (!isMobileMenuOpen) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-dark">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={toggleMobileMenu}
            />

            {/* Menu Content */}
            <div className="relative max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-lg dark:bg-gray-dark">
                {/* Handle */}
                <div className="mb-4 flex justify-center">
                    <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                </div>

                {/* Navigation */}
                <div className="space-y-6">
                    {filteredNavData.map((section: any, index: number) => (
                        <div key={index}>
                            <h2 className="mb-4 text-sm font-medium text-dark-4 dark:text-dark-6">
                                {section.label}
                            </h2>

                            <nav role="navigation" aria-label={section.label}>
                                <ul className="space-y-2">
                                    {section.items.map((item: any, itemIndex: number) => (
                                        <li key={itemIndex}>
                                            {item.items && item.items.length > 0 ? (
                                                <div>
                                                    <MenuItem
                                                        isActive={item.items.some(
                                                            ({ url }: { url: string }) => url === window.location.pathname,
                                                        )}
                                                        onClick={() => toggleExpanded(item.title)}
                                                    >
                                                        <item.icon className="size-6 shrink-0" aria-hidden="true" />
                                                        <span>{item.title}</span>
                                                        <ChevronUp
                                                            className={cn(
                                                                "ml-auto rotate-180 transition-transform duration-200",
                                                                expandedItems.includes(item.title) && "rotate-0",
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </MenuItem>

                                                    {expandedItems.includes(item.title) && (
                                                        <ul className="ml-9 mr-0 space-y-1.5 pb-2 pt-2">
                                                            {item.items.map((subItem: any, subIndex: number) => (
                                                                <li key={subIndex} role="none">
                                                                    <MenuItem
                                                                        as="link"
                                                                        href={subItem.url}
                                                                        isActive={window.location.pathname === subItem.url}
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
                                                            isActive={window.location.pathname === href}
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
                    ))}
                </div>

                {/* User Profile */}
                <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                    <SidebarUserProfile />
                </div>
            </div>
        </div>
    );
}
