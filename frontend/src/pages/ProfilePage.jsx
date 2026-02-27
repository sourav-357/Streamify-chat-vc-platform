import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile, changePassword } from "../lib/api";
import { generateRandomAvatar } from "../lib/utils";
import { LockIcon, RefreshCwIcon, EditIcon, SaveIcon } from "lucide-react";

const ProfilePage = () => {
    const queryClient = useQueryClient();
    const { authUser, isLoading } = useAuthUser();
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        nativeLanguage: "",
        learningLanguage: "",
        location: "",
        profilePic: "",
    });

    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

    const {
        mutate: updateMut,
        isPending: updating,
        error: updateError,
    } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            setEditMode(false);
        },
    });

    const {
        mutate: changePassMut,
        isPending: changingPass,
        error: passError,
        data: passResult,
    } = useMutation({
        mutationFn: ({ current, nw }) => changePassword(current, nw),
        onSuccess: () => {
            setPasswords({ currentPassword: "", newPassword: "" });
        },
    });

    useEffect(() => {
        if (authUser) {
            setFormData({
                fullName: authUser.fullName || "",
                bio: authUser.bio || "",
                nativeLanguage: authUser.nativeLanguage || "",
                learningLanguage: authUser.learningLanguage || "",
                location: authUser.location || "",
                profilePic: authUser.profilePic || "",
            });
        }
    }, [authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((f) => ({ ...f, [name]: value }));
    };

    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setPasswords((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMut(formData);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        changePassMut({ current: passwords.currentPassword, nw: passwords.newPassword });
    };

    const generateAvatar = () => {
        const url = generateRandomAvatar();
        setFormData((f) => ({ ...f, profilePic: url }));
    };

    if (isLoading) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-lg">
                {/* view mode */}
                {!editMode ? (
                    <div className="card bg-base-200 p-6 text-center space-y-4">
                        <div className="avatar size-24 mx-auto">
                            <img src={authUser.profilePic} alt={authUser.fullName} />
                        </div>
                        <h1 className="text-3xl font-bold">{authUser.fullName}</h1>
                        {authUser.location && <p className="opacity-70">{authUser.location}</p>}
                        <div className="flex flex-wrap justify-center gap-2">
                            {authUser.nativeLanguage && (
                                <span className="badge badge-secondary">
                                    Native: {authUser.nativeLanguage}
                                </span>
                            )}
                            {authUser.learningLanguage && (
                                <span className="badge badge-outline">
                                    Learning: {authUser.learningLanguage}
                                </span>
                            )}
                        </div>
                        {authUser.bio && <p className="mt-2">{authUser.bio}</p>}
                        <button
                            className="btn btn-outline btn-sm mt-4 flex items-center gap-2"
                            onClick={() => setEditMode(true)}
                        >
                            <EditIcon className="size-4" />
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="avatar size-24">
                                    <img src={formData.profilePic} alt="avatar" />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary flex items-center gap-1"
                                    onClick={generateAvatar}
                                >
                                    <RefreshCwIcon className="size-4" />
                                    Random Avatar
                                </button>
                            </div>

                            <label className="block">
                                <span className="text-sm">Full Name</span>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm">Bio</span>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered w-full"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm">Native Language</span>
                                <input
                                    type="text"
                                    name="nativeLanguage"
                                    value={formData.nativeLanguage}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm">Learning Language</span>
                                <input
                                    type="text"
                                    name="learningLanguage"
                                    value={formData.learningLanguage}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm">Location</span>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </label>

                            <button
                                type="submit"
                                className="btn btn-primary flex items-center gap-2"
                                disabled={updating}
                            >
                                <SaveIcon className="size-4" />
                                {updating ? "Saving..." : "Save Changes"}
                            </button>
                            {updateError && <p className="text-error">{updateError.message}</p>}
                        </form>

                        {/* change password section */}
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <h2 className="text-xl font-semibold">Change Password</h2>
                            <label className="block">
                                <span className="text-sm">Current Password</span>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handlePassChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm">New Password</span>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePassChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </label>

                            <button
                                type="submit"
                                className="btn btn-warning flex items-center gap-2"
                                disabled={changingPass}
                            >
                                <LockIcon className="size-4" />
                                {changingPass ? "Updating..." : "Change Password"}
                            </button>
                            {passError && <p className="text-error">{passError.message}</p>}
                        </form>

                        <button
                            className="btn btn-ghost btn-sm mt-2"
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
