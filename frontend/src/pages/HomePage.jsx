import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react";
import { capitalize, getLanguageFlag } from "../lib/utils";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Filter recommended users based on search and language
  const filteredRecommendedUsers = recommendedUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage =
      filterLanguage === "all" || user.learningLanguage === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  // Get unique languages from recommended users
  const uniqueLanguages = [
    ...new Set(recommendedUsers.map((u) => u.learningLanguage).filter(Boolean)),
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-12">
      <div className="container mx-auto max-w-7xl space-y-12">
        {/* FRIENDS SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Your Friends</h2>
              <p className="text-base-content/60 mt-1">
                {friends.length} {friends.length === 1 ? "friend" : "friends"} connected
              </p>
            </div>
            <Link to="/notifications" className="btn btn-outline gap-2 w-full sm:w-auto">
              <UsersIcon className="size-5" />
              <span className="hidden sm:block">Friend Requests</span>
              <span className="sm:hidden">Requests</span>
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* DIVIDER */}
        <div className="divider"></div>

        {/* DISCOVER SECTION */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2">
              Meet New Learners
            </h2>
            <p className="text-base-content/60">
              Discover perfect language exchange partners based on your profile
            </p>
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="flex flex-col gap-4">
            {/* SEARCH BAR */}
            <div className="form-control w-full">
              <div className="input-group w-full">
                <input
                  type="text"
                  placeholder="Search by name, location..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-ghost">
                  <SearchIcon className="size-5" />
                </button>
              </div>
            </div>

            {/* LANGUAGE FILTER */}
            {uniqueLanguages.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <FilterIcon className="size-5 text-base-content/60" />
                <button
                  className={`btn btn-sm normal-case ${filterLanguage === "all" ? "btn-primary" : "btn-outline"
                    }`}
                  onClick={() => setFilterLanguage("all")}
                >
                  All Languages
                </button>
                {uniqueLanguages.map((lang) => (
                  <button
                    key={lang}
                    className={`btn btn-sm normal-case ${filterLanguage === lang ? "btn-secondary" : "btn-outline"
                      }`}
                    onClick={() => setFilterLanguage(lang)}
                  >
                    {getLanguageFlag(lang)} {capitalize(lang)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* USERS GRID */}
          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : filteredRecommendedUsers.length === 0 ? (
            <div className="card bg-base-200/50 border border-base-300 p-8 text-center">
              <h3 className="font-semibold text-lg mb-2">
                {searchTerm || filterLanguage !== "all"
                  ? "No matches found"
                  : "No recommendations available"}
              </h3>
              <p className="text-base-content/70">
                {searchTerm || filterLanguage !== "all"
                  ? "Try adjusting your search or filters"
                  : "Check back later for new language partners!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-100 border border-base-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* HEADER STATUS */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="badge badge-success gap-1 text-xs animate-pulse">
                        <span className="size-1.5 rounded-full bg-success" /> Online
                      </span>
                    </div>

                    {/* BANNER */}
                    <div className="relative h-24 bg-gradient-to-br from-primary/20 to-secondary/20">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/30 to-secondary/30 transition-opacity" />
                    </div>

                    <div className="card-body p-5 space-y-3">
                      {/* USER INFO */}
                      <div className="flex items-start gap-3">
                        <Link to={`/user/${user._id}`}>
                          <div className="avatar size-14 border-2 border-base-100 rounded-full hover:ring-2 ring-primary transition-all">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base hover:text-primary transition-colors">
                            <Link to={`/user/${user._id}`}>{user.fullName}</Link>
                          </h3>
                          {user.location && (
                            <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5">
                              <MapPinIcon className="size-3" />
                              <span className="truncate">{user.location}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* BIO */}
                      {user.bio && (
                        <p className="text-xs text-base-content/70 line-clamp-2">{user.bio}</p>
                      )}

                      {/* LANGUAGES */}
                      <div className="flex flex-wrap gap-1.5">
                        {user.nativeLanguage && (
                          <span className="badge badge-primary text-xs gap-0.5">
                            {getLanguageFlag(user.nativeLanguage)}
                            <span className="hidden sm:inline">Native</span>
                          </span>
                        )}
                        {user.learningLanguage && (
                          <span className="badge badge-secondary text-xs gap-0.5">
                            {getLanguageFlag(user.learningLanguage)}
                            <span className="hidden sm:inline">Learning</span>
                          </span>
                        )}
                      </div>

                      {/* ACTION BUTTON */}
                      <button
                        className={`btn btn-block mt-2 normal-case gap-2 ${hasRequestBeenSent ? "btn-disabled btn-outline" : "btn-primary"
                          }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            <span className="hidden sm:inline">Request Sent</span>
                            <span className="sm:hidden">Sent</span>
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            <span className="hidden sm:inline">Send Request</span>
                            <span className="sm:hidden">Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
