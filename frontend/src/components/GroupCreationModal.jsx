import { useState } from "react";
import { X, Plus, Loader } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllUsers, createGroup } from "../lib/api";
import { toast } from "react-hot-toast";

const GroupCreationModal = ({ onClose, onSuccess }) => {
    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ["users-for-group"],
        queryFn: getAllUsers,
    });

    const createGroupMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            toast.success("Group created successfully!");
            onSuccess();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create group");
        },
    });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        members: [],
    });

    const currentUserId = localStorage.getItem("userId");
    const availableUsers = users.filter((user) => user._id !== currentUserId);

    const handleAddMember = (userId) => {
        if (!formData.members.includes(userId)) {
            setFormData({
                ...formData,
                members: [...formData.members, userId],
            });
        }
    };

    const handleRemoveMember = (userId) => {
        setFormData({
            ...formData,
            members: formData.members.filter((id) => id !== userId),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Group name is required");
            return;
        }

        if (formData.members.length < 2) {
            toast.error("Please select at least 2 members");
            return;
        }

        createGroupMutation.mutate(formData);
    };

    const selectedUsers = availableUsers.filter((user) =>
        formData.members.includes(user._id)
    );

    const unselectedUsers = availableUsers.filter(
        (user) => !formData.members.includes(user._id)
    );

    return (
        <div className="modal modal-open">
            <div className="modal-box w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl">Create New Group</h3>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                        disabled={createGroupMutation.isPending}
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* GROUP NAME */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Group Name *</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            className="input input-bordered"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            disabled={createGroupMutation.isPending}
                        />
                    </div>

                    {/* GROUP DESCRIPTION */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Description (Optional)</span>
                        </label>
                        <textarea
                            placeholder="Enter group description"
                            className="textarea textarea-bordered h-24"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            disabled={createGroupMutation.isPending}
                        />
                    </div>

                    {/* SELECTED MEMBERS */}
                    {formData.members.length > 0 && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Selected Members ({formData.members.length})
                                </span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {selectedUsers.map((user) => (
                                    <div key={user._id} className="badge badge-primary gap-2 p-3">
                                        <img
                                            src={user.profilePic}
                                            alt={user.fullName}
                                            className="w-4 h-4 rounded-full"
                                        />
                                        <span>{user.fullName}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMember(user._id)}
                                            className="badge-ghost cursor-pointer hover:bg-base-300"
                                            disabled={createGroupMutation.isPending}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ADD MEMBERS */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Add Members * (At least 2)
                            </span>
                        </label>
                        {usersLoading ? (
                            <div className="text-center py-4">
                                <span className="loading loading-spinner" />
                            </div>
                        ) : unselectedUsers.length === 0 ? (
                            <div className="alert alert-info">
                                <span>All available friends are already added to the group</span>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {unselectedUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-200 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-8 h-8 rounded-full">
                                                    <img src={user.profilePic} alt={user.fullName} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{user.fullName}</p>
                                                <p className="text-xs text-base-content/60">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleAddMember(user._id)}
                                            className="btn btn-primary btn-sm gap-1"
                                            disabled={createGroupMutation.isPending}
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="modal-action gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={createGroupMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary gap-2"
                            disabled={createGroupMutation.isPending}
                        >
                            {createGroupMutation.isPending && (
                                <Loader className="size-4 animate-spin" />
                            )}
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </div>
    );
};

export default GroupCreationModal;
