import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getDynamicNavData } from "./data"; // Import dynamic function
import { ChevronUp } from "./icons";

import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { getDecryptedItem } from "@/utils/storageHelper";
import { cn } from "@/lib/utils";
import { filterSidebarItems } from "@/utils/sidebar-filter";
import { useApiClient } from "@/lib/api"; // Import your API client

export function SidebarNavigation() {
  const pathname = usePathname();
  const { isOpen, isMobile } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [role, setRole] = useState<string | undefined>();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<any[]>([]); // State for all roles
  const [loading, setLoading] = useState(true);
  const api = useApiClient();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("roles");
        if (response.success) {
          setAllRoles(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const r: any = getDecryptedItem("role");
    const p: any = getDecryptedItem("permissions") || [];

    setRole(r);
    setPermissions(Array.isArray(p) ? p : []);
  }, []);

  useEffect(() => {
    // Use dynamic nav data for pathname matching
    const dynamicNavData = getDynamicNavData(allRoles);

    dynamicNavData.some((section) => {
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
  }, [pathname, allRoles]);

  const getFilteredNavData = () => {
    if (!role) return [];

    const dynamicNavData = getDynamicNavData(allRoles, permissions, role);

    return dynamicNavData;
  };

  const filteredNavData = getFilteredNavData();

  if (loading) {
    return (
      <div className="custom-scrollbar mt-2 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
        {/* Loading skeleton */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="mb-6">
            <div className="mb-5 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((subItem) => (
                <div key={subItem} className="flex items-center gap-3 py-3">
                  <div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

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
                        <item.icon
                          className="size-6 shrink-0"
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            isOpen ? "block" : "hidden group-hover:block",
                          )}
                        >
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
                        "/" + item.title.toLowerCase().split(" ").join("-");

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
                          <span
                            className={cn(
                              isOpen ? "block" : "hidden group-hover:block",
                            )}
                          >
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
