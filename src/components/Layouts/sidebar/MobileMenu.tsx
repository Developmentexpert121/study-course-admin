import { useState, useEffect } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";
import { getDynamicNavData } from "./data"; // Import the dynamic function
import { ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { cn } from "@/lib/utils";
import { filterSidebarItems } from "@/utils/sidebar-filter";
import { useRoles } from "@/hooks/useRoles"; // Import the roles hook

interface MobileMenuProps {
  role?: string;
  permissions?: string[];
}

export function MobileMenu({
  role: propRole,
  permissions: propPermissions = [],
}: MobileMenuProps) {
  const { isMobileMenuOpen, toggleMobileMenu, isMobile } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [internalRole, setInternalRole] = useState<string | undefined>();
  const [internalPermissions, setInternalPermissions] = useState<string[]>([]);
  const { roles, loading } = useRoles(); // Fetch all roles

  // Use props if provided, otherwise use internal state
  const role = propRole || internalRole;
  const permissions =
    propPermissions.length > 0 ? propPermissions : internalPermissions;

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  useEffect(() => {
    // Only set internal state if props are not provided
    if (!propRole) {
      const r: any = getDecryptedItem("role");
      setInternalRole(r);
    }

    if (propPermissions.length === 0) {
      const p: any = getDecryptedItem("permissions") || [];
      setInternalPermissions(Array.isArray(p) ? p : []);
    }
  }, [propRole, propPermissions]);

  const getFilteredNavData = () => {
    if (!role) return [];

    // Use dynamic nav data based on available roles and current user permissions
    const dynamicNavData = getDynamicNavData(roles, permissions, role);
    return filterSidebarItems(dynamicNavData, role, permissions);
  };

  const filteredNavData = getFilteredNavData();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-dark">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu} />

      {/* Menu Content */}
      <div className="relative h-full max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-lg dark:bg-gray-dark">
        {/* Handle */}
        <div className="mb-4 flex justify-center">
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Role Indicator (Optional) */}
        {role && (
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {role}
            </span>
          </div>
        )}

        {/* Navigation */}
        <div className="space-y-6">
          {filteredNavData.length > 0 ? (
            filteredNavData.map((section: any, index: number) => (
              <div key={index}>
                {section.label && (
                  <h2 className="mb-4 text-sm font-medium text-dark-4 dark:text-dark-6">
                    {section.label}
                  </h2>
                )}

                <nav
                  role="navigation"
                  aria-label={section.label || "Main navigation"}
                >
                  <ul className="space-y-2">
                    {section.items.map((item: any, itemIndex: number) => (
                      <li key={itemIndex}>
                        {item.items && item.items.length > 0 ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }: { url: string }) =>
                                  url === window.location.pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{item.title}</span>
                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul className="ml-9 mr-0 space-y-1.5 pb-2 pt-2">
                                {item.items.map(
                                  (subItem: any, subIndex: number) => (
                                    <li key={subIndex} role="none">
                                      <MenuItem
                                        as="link"
                                        href={subItem.url}
                                        isActive={
                                          window.location.pathname ===
                                          subItem.url
                                        }
                                      >
                                        <span>{subItem.title}</span>
                                      </MenuItem>
                                    </li>
                                  ),
                                )}
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
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No menu items available for your role and permissions.
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <SidebarUserProfile role={role} />
        </div>
      </div>
    </div>
  );
}
