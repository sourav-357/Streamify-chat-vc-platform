import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  LogOutIcon,
  ShipWheelIcon,
  MenuIcon,
  XIcon,
  HomeIcon,
  UsersIcon,
  UserIcon,
  MessageSquareIcon,
  Users2Icon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { logoutMutation } = useLogout();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/conversations", label: "Conversations", icon: MessageSquareIcon },
    { to: "/groups", label: "Groups", icon: Users2Icon },
    { to: "/friends", label: "Friends", icon: UsersIcon },
    { to: "/notifications", label: "Notifications", icon: BellIcon },
    { to: "/profile", label: "Profile", icon: UserIcon },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-40 h-16 flex items-center shadow-sm">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <Link to="/" className="flex items-center gap-2 lg:gap-2.5">
              <ShipWheelIcon className="size-7 sm:size-9 text-primary" />
              <span className="hidden sm:block text-xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            </Link>
          )}

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
            {/* DESKTOP NOTIFICATION ICON */}
            <Link to="/notifications" className="hidden sm:block">
              <button className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-300">
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
              </button>
            </Link>

            {/* THEME SELECTOR */}
            <ThemeSelector />

            {/* DESKTOP USER AVATAR & PROFILE */}
            <Link to="/profile" className="hidden sm:block">
              <div className="avatar">
                <div className="w-9 rounded-full hover:ring-2 ring-primary transition-all">
                  <img src={authUser?.profilePic} alt="User Avatar" className="cursor-pointer" />
                </div>
              </div>
            </Link>

            {/* DESKTOP LOGOUT BUTTON */}
            <button
              className="btn btn-ghost btn-circle btn-sm sm:btn-md hidden sm:flex hover:bg-error/20"
              onClick={logoutMutation}
              title="Logout"
            >
              <LogOutIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>

            {/* MOBILE HAMBURGER MENU */}
            <button
              className="btn btn-ghost btn-circle btn-sm sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-16 left-0 right-0 bg-base-200 border-b border-base-300 p-4 space-y-2 shadow-lg">
            {/* MOBILE NAV LINKS */}
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="w-full block">
                <button
                  className={`btn btn-ghost justify-start w-full gap-3 ${isActive(to) ? "btn-active" : ""
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              </Link>
            ))}

            <div className="divider my-2" />

            {/* MOBILE USER PROFILE */}
            <Link to="/profile" className="w-full block">
              <button className="btn btn-ghost justify-start w-full gap-3">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={authUser?.profilePic} alt="User Avatar" />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold">{authUser?.fullName}</p>
                  <p className="text-xs opacity-70">View Profile</p>
                </div>
              </button>
            </Link>

            {/* MOBILE LOGOUT BUTTON */}
            <button
              className="btn btn-ghost justify-start w-full gap-3 text-error hover:bg-error/20"
              onClick={() => {
                setMobileMenuOpen(false);
                logoutMutation();
              }}
            >
              <LogOutIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
