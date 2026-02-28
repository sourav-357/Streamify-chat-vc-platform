
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStreamToken, getGroups, addGroupMember, removeGroupMember } from "../lib/api";

import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import { XIcon, UserPlusIcon, UserXIcon } from "lucide-react";



const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
    const { id: groupId } = useParams();
    const navigate = useNavigate();

    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMembers, setShowMembers] = useState(false);

    const { authUser } = useAuthUser();

    // Fetch group and token data in parallel
    const { data: groups = [] } = useQuery({
        queryKey: ["groups"],
        queryFn: getGroups,
        enabled: !!authUser,
    });

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser,
    });

    const group = groups.find((g) => g._id === groupId);
    const isAdmin = group?.admin?._id === authUser?._id;

    const removeGroupMemberMutation = useMutation({
        mutationFn: ({ groupId, memberId }) =>
            removeGroupMember(groupId, memberId),
        onSuccess: () => {
            toast.success("Member removed successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to remove member");
        },
    });

    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser || !group) return;

            try {
                console.log("Initializing stream chat client for group...");

                const client = StreamChat.getInstance(STREAM_API_KEY);

                await client.connectUser(
                    {
                        id: authUser._id,
                        name: authUser.fullName,
                        image: authUser.profilePic,
                    },
                    tokenData.token
                );

                // Create channel ID for group
                const channelId = `group-${groupId}`;

                // Get all member IDs for the group
                const memberIds = group.members.map((m) =>
                    typeof m === "string" ? m : m._id
                );

                const currChannel = client.channel("messaging", channelId, {
                    name: group.name,
                    image: group.groupPic || null,
                    members: memberIds,
                });

                await currChannel.watch();

                setChatClient(client);
                setChannel(currChannel);
            } catch (error) {
                console.error("Error initializing group chat:", error);
                toast.error("Could not connect to group chat. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        initChat();
    }, [tokenData, authUser, group, groupId]);

    const handleVideoCall = () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;

            channel.sendMessage({
                text: `I've started a video call. Join me here: ${callUrl}`,
            });

            toast.success("Video call link sent successfully!");
        }
    };

    const handleRemoveMember = (memberId) => {
        if (!isAdmin && memberId !== authUser._id) {
            toast.error("Only admin can remove other members");
            return;
        }

        removeGroupMemberMutation.mutate({ groupId, memberId });
    };

    if (loading || !chatClient || !channel || !group)
        return <ChatLoader />;

    return (
        <div className="h-[93vh] flex">
            {/* CHAT AREA */}
            <div className="flex-1">
                <Chat client={chatClient}>
                    <Channel channel={channel}>
                        <div className="w-full relative">
                            <CallButton handleVideoCall={handleVideoCall} />
                            <Window>
                                <ChannelHeader />
                                <MessageList />
                                <MessageInput focus />
                            </Window>
                        </div>
                        <Thread />
                    </Channel>
                </Chat>
            </div>

            {/* MEMBERS SIDEBAR */}
            {showMembers && (
                <div className="w-64 bg-base-100 border-l border-base-300 flex flex-col overflow-hidden">
                    {/* HEADER */}
                    <div className="p-4 border-b border-base-300 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Members</h3>
                        <button
                            onClick={() => setShowMembers(false)}
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            <XIcon className="size-5" />
                        </button>
                    </div>

                    {/* MEMBERS LIST */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {group.members.map((member) => {
                            const memberId = typeof member === "string" ? member : member._id;
                            const memberName =
                                typeof member === "string" ? member : member.fullName;
                            const memberPic =
                                typeof member === "string" ? null : member.profilePic;

                            const isCurrentUser = memberId === authUser._id;

                            return (
                                <div
                                    key={memberId}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                                >
                                    <div className="avatar">
                                        {memberPic ? (
                                            <div className="w-8 rounded-full">
                                                <img src={memberPic} alt={memberName} />
                                            </div>
                                        ) : (
                                            <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                                                {memberName?.charAt(0) || "?"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {memberName}
                                            {isCurrentUser && (
                                                <span className="badge badge-sm badge-primary ml-2">
                                                    You
                                                </span>
                                            )}
                                            {group.admin?._id === memberId && (
                                                <span className="badge badge-sm badge-accent ml-2">
                                                    Admin
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* REMOVE MEMBER BUTTON */}
                                    {(isAdmin || isCurrentUser) && (
                                        <button
                                            onClick={() => handleRemoveMember(memberId)}
                                            className="btn btn-ghost btn-sm btn-circle text-error"
                                            disabled={removeGroupMemberMutation.isPending}
                                            title={
                                                isCurrentUser ? "Leave group" : "Remove member"
                                            }
                                        >
                                            <UserXIcon className="size-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TOGGLE MEMBERS BUTTON */}
            {!showMembers && (
                <button
                    onClick={() => setShowMembers(true)}
                    className="fixed right-4 bottom-4 btn btn-primary btn-circle gap-2 shadow-lg"
                    title="Show members"
                >
                    <UserPlusIcon className="size-5" />
                </button>
            )}
        </div>
    );
};
export default GroupChatPage;
