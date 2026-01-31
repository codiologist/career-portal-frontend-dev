"use client";

import ProfileButton from "@/components/navigation/profile-button";
import { Menu } from "lucide-react";

const TopNavBar = () => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none md:hidden">
          <Menu />
        </button>
        {/* <h1 className="text-xl font-semibold text-gray-800 ml-4">Dashboard</h1> */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
