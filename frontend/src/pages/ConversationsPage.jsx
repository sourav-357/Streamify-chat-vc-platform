import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../lib/api";
import { Link } from "react-router";
import {
    MessageSquareIcon,
    ArrowLeftIcon,
    SearchIcon,
    PlusIcon,
    UserIcon,
} from "lucide-react";
import { useState } from "react";
import { getLanguageFlag } from "../lib/utils";

const ConversationsPage = () => {
    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ["conversations"],
        queryFn: getConversations,
    });

    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter((conv) => {
        const otherUser = conv.participants.find((p) => p._id !== localStorage.getItem("userId"));
        if (!otherUser) return false;
        return otherUser.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const formatDate = (date) => {
        const now = new Date();
        const msgDate = new Date(date);
        const diffInMinutes = Math.floor((now - msgDate) / (1000 * 60));

        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
        return msgDate.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 pb-12">
            <div className="container mx-auto max-w-4xl">
                {/* HEADER */}
                <div className="space-y-2 mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Chats</h1>
                    <p className="text-base-content/60">
                        {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
                    </p>
                </div>

                {/* SEARCH BAR */}
                <div className="card bg-base-100 border border-base-300 shadow-md mb-6">
                    <div className="card-body p-4">
                        <div className="form-control w-full">
                            <div className="input-group w-full">
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="input input-bordered w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-ghost">
                                    <SearchIcon className="size-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONVERSATIONS LIST */}
                {filteredConversations.length === 0 ? (
                    <div className="card bg-base-200/50 border border-base-300 p-12 text-center">
                        <MessageSquareIcon className="size-16 mx-auto text-base-content/60 mb-4" />
                        <h3 className="font-bold text-xl mb-2">No conversations yet</h3>
                        <p className="text-base-content/70 mb-4">
                            Start a conversation by adding a friend and opening their chat!
                        </p>
                        <Link to="/friends" className="btn btn-primary gap-2 mx-auto">
                            <UserIcon className="size-5" />
                            View Friends
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredConversations.map((conversation) => {
                            const otherUser = conversation.participants.find(
                                (p) => p._id !== localStorage.getItem("userId")
                            );

                            if (!otherUser) return null;

                            return (
                                <Link key={conversation._id} to={`/chat/${otherUser._id}`}>
                                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all cursor-pointer">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-4">
                                                {/* AVATAR */}
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-2">
                                                        <img src={otherUser.profilePic} alt={otherUser.fullName} />
                                                    </div>
                                                </div>

                                                {/* USER INFO */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-lg">{otherUser.fullName}</h3>
                                                    <p className="text-sm text-base-content/60 truncate">
                                                        {conversation.lastMessage || "No messages yet"}
                                                    </p>
                                                    {otherUser.nativeLanguage && (
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="badge badge-sm badge-primary">
                                                                {getLanguageFlag(otherUser.nativeLanguage)}
                                                                {otherUser.nativeLanguage}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* TIME */}
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-xs text-base-content/60">
                                                        {formatDate(conversation.lastMessageTime)}
                                                    </p>
                                                    <span className="badge badge-primary badge-sm mt-2">
                                                        <MessageSquareIcon className="size-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationsPage;
