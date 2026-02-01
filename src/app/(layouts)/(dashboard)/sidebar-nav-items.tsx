"use client";
import { sidebarNavigationItems } from "@/components/navigation/navigation-items";
import { cn } from "@/lib/utils";
import { ChevronDownCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SidebarNavItems = () => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  return (
    <div className="flex grow flex-col overflow-y-auto px-4 py-4">
      <nav className="flex-1 space-y-2">
        {sidebarNavigationItems.map((item: any) => (
          <div key={item?.menu_name}>
            {item?.hasSubMenu === true ? (
              <>
                <button
                  onClick={() => toggleSection(item?.menu_name)}
                  className="text-primary hover:bg-primary relative flex w-full cursor-pointer items-center px-4 py-2 text-base font-semibold transition-all duration-300 ease-out hover:translate-x-1 hover:text-white"
                >
                  {item.icon ? <item.icon size={18} className="mr-3" /> : null}
                  {item.menu_name}
                  <div
                    className={`flex h-6 w-6 items-center justify-center transition-all duration-400 ease-in-out ${
                      expandedSections[item?.menu_name]
                        ? "scale-110 -rotate-90"
                        : "scale-100"
                    }`}
                  ></div>
                  <ChevronDownCircle
                    size={22}
                    className={cn(
                      "absolute right-1 transition-all duration-400 ease-in-out",
                      expandedSections[item?.menu_name]
                        ? "scale-110 -rotate-180"
                        : "scale-100",
                    )}
                  />
                </button>

                {/* Dropdown Submenu */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    expandedSections[item.menu_name] ? "max-h-200" : "max-h-0",
                  )}
                >
                  <div className="mt-2 ml-6 pb-4 pl-1">
                    {item?.subMenuItems?.map((subItem: any) => (
                      <Link
                        key={subItem.menu_name}
                        href={subItem.href}
                        className="text-primary hover:bg-primary flex cursor-pointer items-center py-2 pl-4 font-semibold transition-all duration-300 ease-out hover:translate-x-1 hover:text-white"
                      >
                        {subItem.icon ? (
                          <subItem.icon size={18} className="mr-3" />
                        ) : null}
                        <span>{subItem.menu_name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xs px-4 py-2 text-base font-semibold transition-all duration-300 ease-out hover:translate-x-1",
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-primary hover:text-white",
                )}
              >
                <item.icon size={18} className="mr-3" />
                {item.menu_name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SidebarNavItems;
