"use client";

import ProfileButton from "@/components/navigation/profile-button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MobileSidebar from "./mobile-sidebar";
import logo from "/public/career-portal-logo.png";

const TopNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleSidebarMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      // setExpandedSections({});
    }
  };
  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebarMenu}
            className="text-primary cursor-pointer focus:outline-none md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <Link href="/" aria-label="Go to home" className="block lg:hidden">
          <div className="flex items-center gap-0">
            <Image src={logo} alt="Algorify Logo" className="h-auto w-7" />
            <h2 className="text-primary text-2xl font-bold">areer Portal</h2>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <ProfileButton />
          </div>
        </div>
      </header>
      <MobileSidebar
        toggleSidebarMenu={toggleSidebarMenu}
        isMenuOpen={isMenuOpen}
      />
    </>
  );
};

export default TopNavBar;
