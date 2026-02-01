"use client";

import Image from "next/image";
import Link from "next/link";
import SidebarNavItems from "./sidebar-nav-items";
import logo from "/public/career-portal-logo.png";

const Sidebar = () => {
  return (
    <>
      <div className="hidden md:flex md:shrink-0">
        <div className="flex w-80 flex-col border-r border-gray-200 text-white">
          <div className="flex h-18 items-center justify-center border-b border-gray-200 px-4">
            <Link href="/" aria-label="Go to home">
              <div className="flex items-center gap-0">
                <Image src={logo} alt="Algorify Logo" className="h-auto w-8" />
                <h2 className="text-primary text-3xl font-bold">
                  areer Portal
                </h2>
              </div>
            </Link>
          </div>
          <SidebarNavItems />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
