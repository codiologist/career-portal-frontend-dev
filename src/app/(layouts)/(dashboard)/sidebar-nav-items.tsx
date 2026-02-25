"use client";
import {
  SidebarNavigationItem,
  sidebarNavigationItems,
  SidebarSubMenuItem,
} from "@/components/navigation/navigation-items";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { TProfileBreakdown } from "@/types/profile-progress-types";
import { CheckCircle, ChevronDownCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SidebarNavItems = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const profileProgress = user?.data?.profileProgress;
  const breakdown = (profileProgress?.breakdown as TProfileBreakdown) ?? {};

  // Compute effective score per submenu item.
  // "Personal Info" (score: 20 in nav-items) maps to candidatePersonal + resume + signature
  const getSubItemScore = (subItem: SidebarSubMenuItem): number => {
    if (!subItem.score) return 0;

    // Personal Info combines candidatePersonal + resume + signature
    // All three must individually have a score > 0 AND total must equal 40
    if (subItem.href === "/update-profile/personal-information") {
      const personal = Number(breakdown.candidatePersonal) || 0;
      const resume = Number(breakdown.resume) || 0;
      const signature = Number(breakdown.signature) || 0;
      const allFilled = personal > 0 && resume > 0 && signature > 0;
      const total = personal + resume + signature;
      return allFilled && total === 40 ? 40 : 0;
    }

    // Address Info → addresses
    if (subItem.href === "/update-profile/address-information") {
      return Number(breakdown.addresses) || 0;
    }

    // Experience Info → candidateExperiences
    if (subItem.href === "/update-profile/experience-information") {
      return Number(breakdown.candidateExperiences) || 0;
    }

    // Achievements & Training → candidateAchievements
    if (subItem.href === "/update-profile/achievement-training-information") {
      return Number(breakdown.candidateAchievements) || 0;
    }

    // References → candidateReferences
    if (subItem.href === "/update-profile/reference-information") {
      return Number(breakdown.candidateReferences) || 0;
    }

    // Educational Info → candidateEducations
    if (subItem.href === "/update-profile/education-information") {
      return Number(breakdown.candidateEducations) || 0;
    }

    return 0;
  };

  // Check if any submenu item is active for a given parent item
  const isSubMenuActive = useMemo(() => {
    const activeMap: Record<string, boolean> = {};
    sidebarNavigationItems.forEach((item: SidebarNavigationItem) => {
      if (item.hasSubMenu && item.subMenuItems) {
        activeMap[item.menu_name] = item.subMenuItems.some(
          (subItem: SidebarSubMenuItem) =>
            pathname === subItem.href ||
            pathname.startsWith(subItem.href + "/"),
        );
      }
    });
    return activeMap;
  }, [pathname]);

  // Initialize expanded sections - auto-expand if a child is active
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Auto-expand sections when their children are active
  useEffect(() => {
    const newExpandedSections: Record<string, boolean> = {
      ...expandedSections,
    };
    Object.entries(isSubMenuActive).forEach(([menuName, isActive]) => {
      if (isActive) {
        newExpandedSections[menuName] = true;
      }
    });
    setExpandedSections(newExpandedSections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isSubMenuActive]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  return (
    <div className="flex grow flex-col overflow-y-auto px-2.5 py-4">
      <nav className="flex-1 space-y-2">
        {sidebarNavigationItems.map((item: SidebarNavigationItem) => (
          <div key={item?.menu_name}>
            {item?.hasSubMenu === true ? (
              <>
                <button
                  onClick={() => toggleSection(item?.menu_name)}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center rounded-xs px-4 py-2 text-base font-semibold transition-all duration-300 ease-out hover:translate-x-1",
                    isSubMenuActive[item.menu_name]
                      ? "bg-primary/10 text-primary"
                      : "text-primary hover:bg-primary hover:text-white",
                  )}
                >
                  {item.icon ? <item.icon className="mr-3 size-4" /> : null}
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
                  <div className="mt-0 ml-5 pt-1 pb-0">
                    {item?.subMenuItems?.map((subItem: SidebarSubMenuItem) => {
                      const isActive =
                        pathname === subItem.href ||
                        pathname.startsWith(subItem.href + "/");

                      // Only show score icon if the subItem has a score field defined
                      const hasScoreField = subItem.score !== undefined;
                      const effectiveScore = hasScoreField
                        ? getSubItemScore(subItem)
                        : null;
                      const isCompleted =
                        effectiveScore !== null && effectiveScore > 0;

                      return (
                        <Link
                          key={subItem.menu_name}
                          href={subItem.href}
                          className={cn(
                            "group flex cursor-pointer items-center rounded-xs py-2 pl-4 font-semibold transition-all duration-300 ease-out hover:translate-x-1 hover:pr-1",
                            isActive
                              ? "bg-primary translate-x-1 pr-1 text-white"
                              : "text-primary hover:bg-primary group-hover:pr-2 hover:text-white",
                          )}
                        >
                          {subItem.icon ? (
                            <subItem.icon className="mr-3 size-4.5 shrink-0" />
                          ) : null}
                          <span className="flex-1">{subItem.menu_name}</span>

                          {/* Score status icon */}
                          {hasScoreField && (
                            <span className="ml-2 shrink-0 pr-2">
                              {isCompleted ? (
                                <CheckCircle
                                  className={cn(
                                    "size-4.5 transition-colors",
                                    isActive
                                      ? "text-white"
                                      : "text-green-600 group-hover:text-white",
                                  )}
                                />
                              ) : (
                                <XCircle
                                  className={cn(
                                    "size-4.5 transition-colors",
                                    isActive ? "text-white" : "text-red-400",
                                  )}
                                />
                              )}
                            </span>
                          )}
                        </Link>
                      );
                    })}
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
                {item.icon ? <item.icon className="mr-3 size-4" /> : null}
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
