import * as icons from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { LiaBriefcaseSolid, LiaUserTieSolid } from "react-icons/lia";

export type NavigationItem = {
  menu_name: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export type SidebarSubMenuItem = {
  menu_name: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export type SidebarNavigationItem = {
  menu_name: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  hasSubMenu?: boolean;
  subMenuItems?: readonly SidebarSubMenuItem[];
};

export const desktopNavigationItems = [
  {
    menu_name: "Home",
    href: "/",
  },
  {
    menu_name: "Jobs",
    href: "/jobs",
  },
] as const;

// Mobile Navigation Items

export const mobileNavigationItems = [
  {
    menu_name: "Home",
    href: "/",
  },
  {
    menu_name: "Jobs",
    href: "/jobs",
  },
] as const;

export const sidebarNavigationItems = [
  {
    menu_name: "My Profile",
    href: "/profile",
    icon: icons.User,
  },
  {
    menu_name: "Update Profile",
    href: "#",
    icon: icons.Edit3,
    hasSubMenu: true,
    subMenuItems: [
      {
        menu_name: "Personal Info",
        href: "/update-profile/personal-information",
        icon: LiaUserTieSolid,
      },
      {
        menu_name: "Address Info",
        href: "/update-profile/address-information",
        icon: icons.MapPin,
      },
      {
        menu_name: "Experience Info",
        href: "/update-profile/experience-information",
        icon: LiaBriefcaseSolid,
      },
      {
        menu_name: "Educational Info",
        href: "/update-profile/education-information",
        icon: icons.GraduationCap,
      },
      {
        menu_name: "Achievements & Training",
        href: "/update-profile/achievement-training-information",
        icon: icons.Award,
      },
      {
        menu_name: "References",
        href: "/update-profile/reference-information",
        icon: icons.Users,
      },
      {
        menu_name: "Upload Documents",
        href: "/update-profile/upload-documents",
        icon: icons.Upload,
      },
    ],
  },

  {
    menu_name: "Change Password",
    href: "/change-password",
    icon: icons.Lock,
  },
] as const;
