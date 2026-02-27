import { Link } from "react-router";
import { getLanguageFlag } from "../lib/utils";

const FriendCard = ({ friend, actions }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">
            <Link to={`/user/${friend._id}`}>{friend.fullName}</Link>
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>

        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-3 justify-center">
            {actions.map((action, idx) => (
              <div key={idx}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendCard;

