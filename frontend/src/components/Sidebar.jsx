
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, UserIcon, LogOutIcon, MessageSquareIcon, Users2Icon } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { logoutMutation } = useLogout();

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: MessageSquareIcon, label: "Conversations", path: "/conversations" },
    { icon: Users2Icon, label: "Groups", path: "/groups" },
    { icon: UsersIcon, label: "Friends", path: "/friends" },
    { icon: BellIcon, label: "Notifications", path: "/notifications" },
    { icon: UserIcon, label: "Profile", path: "/profile" },
  ];
  
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm">
      {/* HEADER */}
      <div className="p-5 border-b border-base-300 bg-gradient-to-r from-base-200 to-base-300">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-primary rounded-lg group-hover:scale-110 transition-transform">
            <ShipWheelIcon className="size-6 text-base-100" />
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider block">
              Streamify
            </span>
            <p className="text-xs opacity-60">Connect & Learn</p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold opacity-60 uppercase tracking-wider">Navigation</p>
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link key={path} to={path}>
            <button
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case transition-all ${currentPath === path ? "btn-active shadow-md" : ""
                }`}
            >
              <Icon className="size-5" />
              <span className="flex-1 text-left">{label}</span>
            </button>
          </Link>
        ))}
      </nav>

      {/* DIVIDER */}
      <div className="px-4">
        <div className="divider my-2" />
      </div>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-2">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logoutMutation}
          className="btn btn-ghost btn-sm w-full justify-start gap-2 text-error hover:bg-error/20 normal-case"
        >
          <LogOutIcon className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
