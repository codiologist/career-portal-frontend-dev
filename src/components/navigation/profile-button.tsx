import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { formatUserName } from "@/utils/format-name";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOutIcon, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const ProfileButton = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isRoot = pathname === "/";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="cursor-pointer data-[state=open]:[&_svg]:rotate-180"
      >
        <div className="group flex items-center">
          <Avatar className="h-10 w-10 cursor-pointer">
            {/* <AvatarImage
              src={
                (user as TGetMyProfileResponse)?.data?.candidatePersonal?.avatar
              }
              alt={user?.data?.fullName || "user"}
            /> */}
            <AvatarFallback className="bg-primary text-lg font-bold text-white">
              {formatUserName(user?.data?.fullName)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="ml-1 h-5 w-5 text-gray-600 transition-all duration-300" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {isRoot && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <User />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        {isAuthenticated && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleLogout()}
          >
            <LogOutIcon />
            Sign Out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
