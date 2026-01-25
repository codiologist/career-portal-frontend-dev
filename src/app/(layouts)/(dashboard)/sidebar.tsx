"use client";

import { sidebarNavigationItems } from "@/components/navigation/navigation-items";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    //  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
        <div className="hidden md:flex md:shrink-0">
            <div className="flex flex-col w-64 text-white border-r border-gray-200">
                <div className="flex items-center justify-center h-18.75 px-4 border-b  border-gray-200">
                    <span className="text-2xl font-bold text-primary">Career Portal</span>
                </div>
                <div className="flex flex-col grow px-4 py-4 overflow-y-auto">
                    <nav className="flex-1 space-y-2">
                        {sidebarNavigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ease-in-out duration-500",
                                    pathname === item.href ? "bg-blue-700 text-white" : "text-blue-700 hover:text-white hover:bg-blue-700",
                                )}
                            >
                                <item.icon size={16} className="mr-3" />
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
