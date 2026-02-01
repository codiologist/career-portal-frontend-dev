"use client";

import { useAuth } from "@/context/AuthContext";
import { LogInIcon, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import logo from "/public/career-portal-logo.png";

export default function MobileMenu() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Keep expandedSections in sync
  const hasExpandedSections = Object.values(expandedSections).some(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
            setIsHeaderVisible(true);
          } else if (
            currentScrollY > lastScrollY.current &&
            currentScrollY > 100
          ) {
            setIsHeaderVisible(false);
            if (isMenuOpen) {
              setIsMenuOpen(false);
              setExpandedSections({});
            }
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setExpandedSections({});
    }
  };

  return (
    <>
      {/* Header */}
      <div
        className={`fixed top-0 right-0 left-0 z-999 flex items-center justify-between bg-white px-6 py-4 transition-transform duration-300 ease-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      >
        <div className="flex-1">
          {/* Logo */}
          <Link href="/" aria-label="Go to home">
            <div className="flex items-center gap-0">
              <Image src={logo} alt="Algorify Logo" className="h-auto w-7" />
              <h2 className="text-primary text-2xl font-bold">areer Portal</h2>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <Link href="/login">
              <LogInIcon className="text-primary" />
            </Link>
          )}

          <button
            onClick={toggleMenu}
            className="bg-primary hover:bg-blue-water-700 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105"
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
        </div>
      </div>

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
          className={`h-full overflow-y-auto overscroll-contain px-6 pt-20 transition-transform duration-600 ease-out ${
            hasExpandedSections ? "pb-20" : "pb-6"
          } ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
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
              onClick={toggleMenu}
              className="bg-blue-water-700 hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105"
              aria-label="Toggle menu"
            >
              <X />
            </button>
          </div>
          {/* Menu Content */}
        </div>
      </div>
    </>
  );
}
