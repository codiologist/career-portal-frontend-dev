// components/Header.tsx
"use client";

// import { CustomButton } from "@/components/CustomButton";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/MobileMenu";
import ProfileButton from "./navigation/profile-button";
import { Button } from "./ui/button";
import logo from "/public/career-portal-logo.png";

type HeaderProps = {
  variant?: "transparent" | "white";
};

export default function Header({ variant = "transparent" }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // 👉 Run for BOTH variants
    const initY = typeof window !== "undefined" ? window.scrollY : 0;
    lastScrollYRef.current = initY;
    setIsAtTop(initY === 0);

    const controlNavbar = () => {
      const y = window.scrollY;
      setIsAtTop(y === 0);

      const prev = lastScrollYRef.current;
      // hide on down past threshold; show on up/near-top
      if (y > prev && y > 100) setIsVisible(false);
      else setIsVisible(true);

      lastScrollYRef.current = y;
    };

    controlNavbar();
    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  // Position: fixed for transparent, sticky for white
  const positionCls =
    variant === "white" && isAtTop
      ? "relative top-0"
      : "fixed top-0 right-0 left-0";

  // Background: white is solid; transparent changes by scroll
  const desktopBg =
    variant === "white"
      ? "bg-white border-b border-gray-200/50 backdrop-blur-md"
      : isAtTop
        ? "bg-transparent"
        : "border-b border-gray-200/50 bg-white/90 backdrop-blur-md";

  return (
    <header>
      {/* Desktop Header */}
      <div
        className={`${positionCls} z-999 hidden w-full px-6 py-4 transition-transform duration-300 ease-in-out lg:block ${desktopBg} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto flex items-center justify-between">
          <Link href="/" aria-label="Go to home">
            <div className="flex items-center gap-0">
              <Image src={logo} alt="Algorify Logo" className="h-auto w-8" />
              <h2 className="text-primary text-3xl font-bold">areer Portal</h2>
            </div>
          </Link>

          <DesktopMenu />

          <div
            className={cn(
              "flex items-center space-x-4 pl-6",
              isAuthenticated ? "hidden" : "block",
            )}
          >
            <Button
              className="border-primary bg-primary rounded-full border-2 px-6 py-2 text-white"
              variant="default"
            >
              <Link href="/login" aria-label="Login">
                Login
              </Link>
            </Button>
            <Button
              className="border-primary rounded-full border-2 px-6 py-2 text-white"
              variant="outline"
            >
              <Link href="/register" aria-label="Login">
                Register
              </Link>
            </Button>
          </div>
          <div className={cn(isAuthenticated ? "block" : "hidden")}>
            <ProfileButton />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="block lg:hidden">
        <MobileMenu />
      </div>
    </header>
  );
}
