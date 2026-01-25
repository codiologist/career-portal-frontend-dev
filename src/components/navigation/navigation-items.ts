import * as icons from "lucide-react";

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
        href: "/update-profile",
        icon: icons.Edit3,
    },
    {
        menu_name: "Upload Cerficates",
        href: "/upload-certificates",
        icon: icons.Upload,
    },
    {
        menu_name: "Change Password",
        href: "/change-password",
        icon: icons.Lock,
    },
] as const;
