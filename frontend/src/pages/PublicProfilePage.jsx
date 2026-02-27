import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, sendFriendRequest } from "../lib/api";
import { useState } from "react";
import { UserPlusIcon } from "lucide-react";

const PublicProfilePage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id),
    });

    const [requestSent, setRequestSent] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSendRequest = async () => {
        setIsPending(true);
        try {
            await sendFriendRequest(id);
            setRequestSent(true);
            queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
        } catch { }
        setIsPending(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!user) {
        return <div className="p-4">User not found.</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-lg">
                <div className="card bg-base-200 p-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="avatar size-24">
                            <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <h2 className="text-2xl font-bold">{user.fullName}</h2>
                        {user.location && <p className="opacity-70">{user.location}</p>}
                        <div className="flex flex-wrap gap-2">
                            {user.nativeLanguage && (
                                <span className="badge badge-secondary">
                                    Native: {user.nativeLanguage}
                                </span>
                            )}
                            {user.learningLanguage && (
                                <span className="badge badge-outline">
                                    Learning: {user.learningLanguage}
                                </span>
                            )}
                        </div>
                        {user.bio && <p className="mt-2 text-center">{user.bio}</p>}

                        {/* send request or message placeholder */}
                        <button
                            className="btn btn-primary mt-4"
                            onClick={handleSendRequest}
                            disabled={requestSent || isPending}
                        >
                            <UserPlusIcon className="size-4 mr-1" />
                            {requestSent ? "Request Sent" : "Add Friend"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfilePage;
