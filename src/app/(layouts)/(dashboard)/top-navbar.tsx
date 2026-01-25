"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { LogOutIcon, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

const TopNavBar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();

    console.log("Log From TopNavBar", user);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
                <button className="md:hidden text-gray-500 focus:outline-none">
                    <Menu />
                </button>
                {/* <h1 className="text-xl font-semibold text-gray-800 ml-4">Dashboard</h1> */}
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar>
                                    <AvatarImage src={user?.data?.profile?.avatar} alt={user?.data?.fullName || "user"} />
                                    <AvatarFallback>{user?.data?.fullName?.charAt(2)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheckIcon />
                                    Account
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator /> */}

                            {isAuthenticated && (
                                <DropdownMenuItem onClick={() => handleLogout()}>
                                    <LogOutIcon />
                                    Sign Out
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default TopNavBar;
