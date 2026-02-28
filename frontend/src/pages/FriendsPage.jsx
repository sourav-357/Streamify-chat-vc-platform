import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
    getUserFriends,
    removeFriend,
    searchUsers,
    sendFriendRequest,
    getOutgoingFriendReqs,
} from "../lib/api";
import FriendCard from "../components/FriendCard";
import { UserPlusIcon, XCircleIcon, SearchIcon, UsersIcon } from "lucide-react";
import toast from "react-hot-toast";

const FriendsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [outgoingIds, setOutgoingIds] = useState(new Set());
    const [activeTab, setActiveTab] = useState("friends"); // friends or search

    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    const {
        data: searchResults = [],
        refetch: refetchSearch,
        isFetching: searching,
    } = useQuery({
        queryKey: ["searchUsers", searchTerm],
        queryFn: () => searchUsers(searchTerm),
        enabled: false,
    });

    const { data: outgoingFriendReqs } = useQuery({
        queryKey: ["outgoingFriendReqs"],
        queryFn: getOutgoingFriendReqs,
    });

    const { mutate: removeFriendMut, isPending: removing } = useMutation({
        mutationFn: removeFriend,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            toast.success("Friend removed");
        },
        onError: () => toast.error("Failed to remove friend"),
    });

    const { mutate: sendRequestMut, isPending: sending } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
            toast.success("Request sent!");
        },
        onError: () => toast.error("Failed to send request"),
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            toast.error("Please enter a name to search");
            return;
        }
        refetchSearch();
        setActiveTab("search");
    };

    // keep set of outgoing request ids
    useEffect(() => {
        const ids = new Set();
        if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
            outgoingFriendReqs.forEach((r) => ids.add(r.recipient._id));
        }
        setOutgoingIds(ids);
    }, [outgoingFriendReqs]);

    const renderFriendList = () => {
        if (loadingFriends) {
            return (
                <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            );
        }

        if (friends.length === 0) {
            return (
                <div className="card bg-base-200/50 border border-base-300 p-8 text-center">
                    <UsersIcon className="size-16 mx-auto text-base-content/60 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
                    <p className="text-base-content/70">
                        Use the search above to find language partners!
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-2 mb-4">
                <p className="text-sm text-base-content/60 font-semibold">
                    {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {friends.map((friend) => (
                        <FriendCard
                            key={friend._id}
                            friend={friend}
                            actions={[
                                <button
                                    className="w-full btn btn-error btn-outline btn-sm gap-1"
                                    onClick={() => removeFriendMut(friend._id)}
                                    disabled={removing}
                                >
                                    <XCircleIcon className="size-4" />
                                    <span className="hidden sm:inline">Remove</span>
                                </button>,
                            ]}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderSearchResults = () => {
        if (!searchTerm.trim()) {
            return (
                <div className="card bg-base-200/50 border border-base-300 p-8 text-center">
                    <SearchIcon className="size-16 mx-auto text-base-content/60 mb-4" />
                    <p className="text-base-content/70">Enter a name above to search for users</p>
                </div>
            );
        }

        if (searching) {
            return (
                <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            );
        }

        if (searchResults.length === 0) {
            return (
                <div className="card bg-base-200/50 border border-base-300 p-8 text-center">
                    <p className="text-base-content/70">No users found matching "{searchTerm}"</p>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <p className="text-sm text-base-content/60 font-semibold">
                    {searchResults.length} {searchResults.length === 1 ? "Result" : "Results"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((user) => {
                        const hasSent = outgoingIds.has(user._id);
                        return (
                            <FriendCard
                                key={user._id}
                                friend={user}
                                actions={[
                                    <button
                                        className={`w-full btn btn-sm gap-1 normal-case ${hasSent
                                                ? "btn-outline btn-disabled"
                                                : "btn-primary"
                                            }`}
                                        onClick={() => sendRequestMut(user._id)}
                                        disabled={hasSent || sending}
                                    >
                                        <UserPlusIcon className="size-4" />
                                        <span className="hidden sm:inline">
                                            {hasSent ? "Request Sent" : "Add Friend"}
                                        </span>
                                        <span className="sm:hidden">
                                            {hasSent ? "Sent" : "Add"}
                                        </span>
                                    </button>,
                                ]}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 pb-12">
            <div className="container mx-auto max-w-7xl space-y-8">
                {/* HEADER */}
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Friends</h1>
                    <p className="text-base-content/60">Connect with language learners worldwide</p>
                </div>

                {/* SEARCH FORM */}
                <div className="card bg-base-100 border border-base-300 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">Search for Learners</h2>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="form-control flex-1">
                                <div className="input-group w-full">
                                    <input
                                        type="text"
                                        placeholder="Search by name, location..."
                                        className="input input-bordered w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary gap-2"
                                        disabled={searching}
                                    >
                                        {searching ? (
                                            <span className="loading loading-spinner loading-sm" />
                                        ) : (
                                            <SearchIcon className="size-5" />
                                        )}
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* TABS */}
                <div className="tabs tabs-bordered">
                    <button
                        className={`tab font-semibold ${activeTab === "friends" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("friends")}
                    >
                        <UsersIcon className="size-5 mr-2" />
                        <span className="hidden sm:inline">My Friends</span>
                        <span className="sm:hidden">Friends</span>
                        {friends.length > 0 && (
                            <span className="badge badge-primary ml-2">{friends.length}</span>
                        )}
                    </button>
                    <button
                        className={`tab font-semibold ${activeTab === "search" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("search")}
                    >
                        <SearchIcon className="size-5 mr-2" />
                        <span className="hidden sm:inline">Search Results</span>
                        <span className="sm:hidden">Results</span>
                        {searchTerm && searchResults.length > 0 && (
                            <span className="badge badge-secondary ml-2">{searchResults.length}</span>
                        )}
                    </button>
                </div>

                {/* CONTENT */}
                <div>
                    {activeTab === "friends" ? renderFriendList() : renderSearchResults()}
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;
