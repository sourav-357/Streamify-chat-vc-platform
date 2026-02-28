import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, sendFriendRequest } from "../lib/api";
import { UserPlusIcon, MessageSquareIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getLanguageFlag } from "../lib/utils";

const PublicProfilePage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { data: user, isLoading, error } = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id),
    });

    const { mutate: sendRequestMut, isPending } = useMutation({
        mutationFn: () => sendFriendRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
            toast.success("Friend request sent!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to send request");
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="container mx-auto max-w-2xl">
                    <div className="card bg-error/10 border border-error/30 p-6 text-center">
                        <h2 className="text-2xl font-bold text-error mb-2">User Not Found</h2>
                        <p className="text-base-content/70 mb-4">
                            The profile you're looking for doesn't exist or has been removed.
                        </p>
                        <Link to="/" className="btn btn-primary gap-2">
                            <ArrowLeftIcon className="size-5" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 pb-12">
            <div className="container mx-auto max-w-2xl">
                {/* BACK BUTTON */}
                <div className="mb-6">
                    <Link to="/friends" className="btn btn-ghost btn-sm gap-2">
                        <ArrowLeftIcon className="size-4" />
                        Back to Friends
                    </Link>
                </div>

                {/* PROFILE CARD */}
                <div className="card bg-base-100 border border-base-300 shadow-lg overflow-hidden">
                    {/* BANNER */}
                    <div className="h-40 bg-gradient-to-r from-primary/20 to-secondary/20" />

                    <div className="card-body relative pt-0">
                        {/* PROFILE PICTURE */}
                        <div className="flex flex-col items-center -mt-20 mb-4">
                            <div className="avatar size-40 border-4 border-base-100 rounded-full ring ring-primary ring-offset-2 shadow-lg">
                                <img src={user.profilePic} alt={user.fullName} />
                            </div>
                        </div>

                        {/* USER INFO */}
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">{user.fullName}</h1>
                            <p className="text-sm text-base-content/60 opacity-70">{user.email}</p>
                            {user.location && (
                                <p className="badge badge-outline badge-lg mx-auto">📍 {user.location}</p>
                            )}
                        </div>

                        {/* LANGUAGES */}
                        {(user.nativeLanguage || user.learningLanguage) && (
                            <div className="flex flex-wrap justify-center gap-3 my-4 py-4 border-y border-base-300">
                                {user.nativeLanguage && (
                                    <div className="badge badge-primary gap-2 py-3 px-4">
                                        <span className="text-lg">{getLanguageFlag(user.nativeLanguage)}</span>
                                        <span className="font-semibold">Native: {user.nativeLanguage}</span>
                                    </div>
                                )}
                                {user.learningLanguage && (
                                    <div className="badge badge-secondary gap-2 py-3 px-4">
                                        <span className="text-lg">{getLanguageFlag(user.learningLanguage)}</span>
                                        <span className="font-semibold">Learning: {user.learningLanguage}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* BIO */}
                        {user.bio && (
                            <div className="p-4 bg-base-200/50 rounded-lg">
                                <p className="text-center text-base leading-relaxed italic">
                                    "{user.bio}"
                                </p>
                            </div>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-base-300">
                            <button
                                className="btn btn-primary btn-lg flex-1 gap-2 normal-case"
                                onClick={() => sendRequestMut()}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <UserPlusIcon className="size-5" />
                                        Add Friend
                                    </>
                                )}
                            </button>

                            {user.friends && user.friends.length > 0 && (
                                <div className="alert alert-info">
                                    <span>👥 {user.friends.length} friends on Streamify</span>
                                </div>
                            )}
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-base-100 rounded-lg border border-base-300">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-primary">
                                    {user.nativeLanguage ? "✓" : "−"}
                                </p>
                                <p className="text-xs text-base-content/60 mt-1">Native Language</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-secondary">
                                    {user.learningLanguage ? "✓" : "−"}
                                </p>
                                <p className="text-xs text-base-content/60 mt-1">Learning Language</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFO BOX */}
                <div className="mt-6 alert alert-info">
                    <InfoIcon className="size-6" />
                    <div>
                        <span className="font-semibold">Send a friend request</span>
                        <span className="text-sm block mt-1">
                            Once accepted, you'll be able to chat and connect with this learner.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Import InfoIcon if not already available
import { InfoIcon } from "lucide-react";

export default PublicProfilePage;
