import { Link } from "react-router";
import { getLanguageFlag } from "../lib/utils";
import { MessageSquareIcon, UserIcon, MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

const FriendCard = ({ friend, actions }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* HEADER WITH STATUS */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <span className="badge badge-success gap-1 text-xs animate-pulse">
          <span className="size-1.5 rounded-full bg-success" /> Online
        </span>
      </div>

      {/* PROFILE IMAGE */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        <img
          src={friend.profilePic}
          alt={friend.fullName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="card-body p-4">
        {/* USER NAME & LOCATION */}
        <div className="mb-2">
          <h3 className="font-bold text-lg truncate">
            <Link
              to={`/user/${friend._id}`}
              className="hover:text-primary transition-colors"
            >
              {friend.fullName}
            </Link>
          </h3>
          {friend.location && (
            <p className="text-xs opacity-70 truncate">📍 {friend.location}</p>
          )}
        </div>

        {/* BIO */}
        {friend.bio && (
          <p className="text-xs opacity-70 line-clamp-2 mb-2">{friend.bio}</p>
        )}

        {/* LANGUAGES */}
        <div className="flex flex-wrap gap-2 mb-3">
          {friend.nativeLanguage && (
            <span className="badge badge-primary text-xs gap-1">
              <span>{getLanguageFlag(friend.nativeLanguage)}</span>
              <span>Native</span>
            </span>
          )}
          {friend.learningLanguage && (
            <span className="badge badge-secondary text-xs gap-1">
              <span>{getLanguageFlag(friend.learningLanguage)}</span>
              <span>Learning</span>
            </span>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-sm btn-primary flex-1 gap-1 normal-case"
          >
            <MessageSquareIcon className="size-4" />
            <span className="hidden sm:block">Message</span>
          </Link>

          <Link
            to={`/user/${friend._id}`}
            className="btn btn-sm btn-outline flex-1 gap-1 normal-case"
          >
            <UserIcon className="size-4" />
            <span className="hidden sm:block">View</span>
          </Link>

          {/* ACTION MENU */}
          {actions && actions.length > 0 && (
            <div className="dropdown dropdown-end">
              <button className="btn btn-sm btn-ghost">
                <MoreVerticalIcon className="size-4" />
              </button>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44 border border-base-300">
                {actions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;

