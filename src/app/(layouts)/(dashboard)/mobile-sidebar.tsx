"use client";

import { X } from "lucide-react";
import SidebarNavItems from "./sidebar-nav-items";

type MobileSidebarProps = {
  toggleSidebarMenu: () => void;
  isMenuOpen: boolean;
};

const MobileSidebar = ({
  toggleSidebarMenu,
  isMenuOpen,
}: MobileSidebarProps) => {
  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-999 transition-all duration-500 ease-out ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          color: "#000",
        }}
      >
        <div
          className={`h-full overflow-y-auto overscroll-contain px-6 pt-20 transition-transform duration-600 ease-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{
            backgroundColor: "#ffffff",
            color: "#1a83ff",
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Menu Close Button */}
          <div className="absolute top-5 right-5">
            <button
              onClick={toggleSidebarMenu}
              className="bg-blue-water-700 hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105"
              aria-label="Toggle menu"
            >
              <X />
            </button>
          </div>
          {/* Menu Content */}
          <SidebarNavItems />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
