import { useQuery } from "@tanstack/react-query";
import { getGroups } from "../lib/api";
import { Link } from "react-router";
import {
    Users2Icon,
    SearchIcon,
    PlusIcon,
    UserIcon,
    Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import GroupCreationModal from "../components/GroupCreationModal";
import { toast } from "react-hot-toast";

const GroupsPage = () => {
    const { data: groups = [], isLoading, refetch } = useQuery({
        queryKey: ["groups"],
        queryFn: getGroups,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [showCreationModal, setShowCreationModal] = useState(false);

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Groups</h1>
                        <p className="text-base-content/60">
                            {groups.length} {groups.length === 1 ? "group" : "groups"}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreationModal(true)}
                        className="btn btn-primary gap-2"
                    >
                        <PlusIcon className="size-5" />
                        <span className="hidden sm:inline">New Group</span>
                    </button>
                </div>

                {/* SEARCH BAR */}
                <div className="card bg-base-100 border border-base-300 shadow-md mb-6">
                    <div className="card-body p-4">
                        <div className="form-control w-full">
                            <div className="input-group w-full">
                                <input
                                    type="text"
                                    placeholder="Search groups..."
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

                {/* GROUPS LIST */}
                {filteredGroups.length === 0 ? (
                    <div className="card bg-base-200/50 border border-base-300 p-12 text-center">
                        <Users2Icon className="size-16 mx-auto text-base-content/60 mb-4" />
                        <h3 className="font-bold text-xl mb-2">No groups yet</h3>
                        <p className="text-base-content/70 mb-4">
                            Create a group to chat with multiple friends at once!
                        </p>
                        <button
                            onClick={() => setShowCreationModal(true)}
                            className="btn btn-primary gap-2 mx-auto"
                        >
                            <PlusIcon className="size-5" />
                            Create Group
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredGroups.map((group) => (
                            <Link key={group._id} to={`/group/${group._id}`}>
                                <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all cursor-pointer">
                                    <div className="card-body p-4">
                                        <div className="flex items-center gap-4">
                                            {/* GROUP AVATAR */}
                                            <div className="avatar placeholder">
                                                <div className="w-12 h-12 rounded-full bg-primary text-primary-content ring ring-primary ring-offset-2 flex items-center justify-center">
                                                    {group.groupPic ? (
                                                        <img src={group.groupPic} alt={group.name} />
                                                    ) : (
                                                        <Users2Icon className="size-6" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* GROUP INFO */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg">{group.name}</h3>
                                                <p className="text-sm text-base-content/60 truncate">
                                                    {group.members?.length || 0} members
                                                </p>
                                                {group.description && (
                                                    <p className="text-sm text-base-content/50 truncate">
                                                        {group.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-base-content/40 mt-1">
                                                    {group.lastMessage || "No messages yet"}
                                                </p>
                                            </div>

                                            {/* TIME */}
                                            <div className="text-right flex-shrink-0">
                                                {group.lastMessageTime && (
                                                    <p className="text-xs text-base-content/60">
                                                        {formatDate(group.lastMessageTime)}
                                                    </p>
                                                )}
                                                <span className="badge badge-primary badge-sm mt-2">
                                                    <Users2Icon className="size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* GROUP CREATION MODAL */}
            {showCreationModal && (
                <GroupCreationModal
                    onClose={() => setShowCreationModal(false)}
                    onSuccess={() => {
                        setShowCreationModal(false);
                        refetch();
                    }}
                />
            )}
        </div>
    );
};

export default GroupsPage;
