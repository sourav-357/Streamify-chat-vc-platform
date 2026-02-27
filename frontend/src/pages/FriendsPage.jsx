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
import { UserPlusIcon, XCircleIcon } from "lucide-react";

const FriendsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [outgoingIds, setOutgoingIds] = useState(new Set());

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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friends"] }),
    });

    const { mutate: sendRequestMut, isPending: sending } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        refetchSearch();
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
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            );
        }

        if (friends.length === 0) {
            return (
                <div className="card bg-base-200 p-6 text-center">
                    <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
                    <p className="opacity-70">Use search above or check recommendations.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {friends.map((friend) => (
                    <FriendCard
                        key={friend._id}
                        friend={friend}
                        actions={[
                            <button
                                className="btn btn-error btn-outline btn-sm"
                                onClick={() => removeFriendMut(friend._id)}
                                disabled={removing}
                            >
                                <XCircleIcon className="size-4 mr-1" />
                                Remove
                            </button>,
                        ]}
                    />
                ))}
            </div>
        );
    };

    const renderSearchResults = () => {
        if (searching) {
            return (
                <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            );
        }

        if (searchResults.length === 0) {
            return <p className="opacity-70">No users found.</p>;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((user) => {
                    const hasSent = outgoingIds.has(user._id);
                    return (
                        <FriendCard
                            key={user._id}
                            friend={user}
                            actions={[
                                <button
                                    className={`btn btn-primary btn-sm ${hasSent ? "btn-disabled" : ""}`}
                                    onClick={() => sendRequestMut(user._id)}
                                    disabled={hasSent || sending}
                                >
                                    <UserPlusIcon className="size-4 mr-1" />
                                    {hasSent ? "Request Sent" : "Add"}
                                </button>,
                            ]}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                        Your Friends
                    </h2>
                    {renderFriendList()}
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                        Find New Learners
                    </h2>
                    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="input input-bordered flex-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>
                    {searchTerm.trim() ? renderSearchResults() : <p className="opacity-70">Type a name above to search.</p>}
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;
