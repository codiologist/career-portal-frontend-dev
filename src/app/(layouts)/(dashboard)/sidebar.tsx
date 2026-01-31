"use client";

import { sidebarNavigationItems } from "@/components/navigation/navigation-items";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "/public/career-portal-logo.png";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:shrink-0">
      <div className="flex w-80 flex-col border-r border-gray-200 text-white">
        <div className="flex h-18 items-center justify-center border-b border-gray-200 px-4">
          <Link href="/" aria-label="Go to home">
            <div className="flex items-center gap-0">
              <Image src={logo} alt="Algorify Logo" className="h-auto w-8" />
              <h2 className="text-primary text-3xl font-bold">areer Portal</h2>
            </div>
          </Link>
        </div>
        <div className="flex grow flex-col overflow-y-auto px-4 py-4">
          <nav className="flex-1 space-y-2">
            {sidebarNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xs px-4 py-2 text-base font-medium transition-all duration-500 ease-in-out",
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-primary hover:text-white",
                )}
              >
                <item.icon size={18} className="mr-3" />
                {item.menu_name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
