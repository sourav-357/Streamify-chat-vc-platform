import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile, changePassword } from "../lib/api";
import { generateRandomAvatar } from "../lib/utils";
import {
    LockIcon,
    RefreshCwIcon,
    EditIcon,
    SaveIcon,
    XIcon,
    EyeIcon,
    EyeOffIcon,
    CheckCircleIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const queryClient = useQueryClient();
    const { authUser, isLoading } = useAuthUser();
    const [editMode, setEditMode] = useState(false);
    const [showPassChange, setShowPassChange] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        nativeLanguage: "",
        learningLanguage: "",
        location: "",
        profilePic: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const {
        mutate: updateMut,
        isPending: updating,
        error: updateError,
    } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            setEditMode(false);
            toast.success("Profile updated successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

    const {
        mutate: changePassMut,
        isPending: changingPass,
        error: passError,
    } = useMutation({
        mutationFn: ({ current, nw }) => changePassword(current, nw),
        onSuccess: () => {
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowPassChange(false);
            toast.success("Password changed successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to change password");
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
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        changePassMut({
            current: passwords.currentPassword,
            nw: passwords.newPassword,
        });
    };

    const generateAvatar = () => {
        const url = generateRandomAvatar();
        setFormData((f) => ({ ...f, profilePic: url }));
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );

    return (
        <div className="p-4 sm:p-6 lg:p-8 pb-12">
            <div className="container mx-auto max-w-2xl">
                {/* VIEW MODE */}
                {!editMode ? (
                    <div className="space-y-6">
                        {/* PROFILE HEADER CARD */}
                        <div className="card bg-base-100 border border-base-300 shadow-lg overflow-hidden">
                            {/* BANNER */}
                            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />

                            <div className="card-body relative pt-0">
                                {/* PROFILE PICTURE */}
                                <div className="flex flex-col items-center -mt-16 mb-4">
                                    <div className="avatar size-32 border-4 border-base-100 rounded-full ring ring-primary ring-offset-2">
                                        <img src={authUser.profilePic} alt={authUser.fullName} />
                                    </div>
                                </div>

                                {/* PROFILE INFO */}
                                <div className="text-center space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tight">{authUser.fullName}</h1>
                                    <p className="text-sm text-base-content/60 opacity-70">{authUser.email}</p>
                                    {authUser.location && (
                                        <p className="badge badge-outline gap-1 mx-auto">
                                            📍 {authUser.location}
                                        </p>
                                    )}
                                </div>

                                {/* LANGUAGES */}
                                {(authUser.nativeLanguage || authUser.learningLanguage) && (
                                    <div className="flex flex-wrap justify-center gap-2 mt-4 py-4 border-t border-b border-base-300">
                                        {authUser.nativeLanguage && (
                                            <div className="badge badge-primary gap-1">
                                                🎯 Native: {authUser.nativeLanguage}
                                            </div>
                                        )}
                                        {authUser.learningLanguage && (
                                            <div className="badge badge-secondary gap-1">
                                                📚 Learning: {authUser.learningLanguage}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* BIO */}
                                {authUser.bio && (
                                    <div className="mt-4 p-4 bg-base-200/50 rounded-lg">
                                        <p className="text-sm text-center italic">{authUser.bio}</p>
                                    </div>
                                )}

                                {/* EDIT BUTTON */}
                                <button
                                    className="btn btn-primary gap-2 mt-6 w-full normal-case"
                                    onClick={() => setEditMode(true)}
                                >
                                    <EditIcon className="size-5" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* ACCOUNT SETTINGS CARD */}
                        <div className="card bg-base-100 border border-base-300 shadow-lg">
                            <div className="card-body">
                                <h2 className="card-title text-lg">Account Security</h2>
                                <p className="text-sm text-base-content/60 mb-4">
                                    Manage your account security and password
                                </p>
                                <button
                                    className="btn btn-outline gap-2 normal-case"
                                    onClick={() => setShowPassChange(true)}
                                >
                                    <LockIcon className="size-5" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* EDIT MODE */
                    <div className="space-y-6">
                        {/* EDIT PROFILE CARD */}
                        <div className="card bg-base-100 border border-base-300 shadow-lg">
                            <div className="card-body">
                                <h2 className="card-title text-xl mb-6">Edit Your Profile</h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* AVATAR SECTION */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Profile Picture</span>
                                        </label>
                                        <div className="flex gap-4 items-center p-4 bg-base-200/50 rounded-lg">
                                            <div className="avatar size-20 border-2 border-primary rounded-full">
                                                <img src={formData.profilePic} alt="profile" />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-secondary gap-2 normal-case"
                                                onClick={generateAvatar}
                                            >
                                                <RefreshCwIcon className="size-4" />
                                                Change Avatar
                                            </button>
                                        </div>
                                    </div>

                                    {/* FULL NAME */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="input input-bordered focus:input-primary"
                                            required
                                        />
                                    </div>

                                    {/* BIO */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Bio</span>
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered focus:textarea-primary"
                                            placeholder="Tell us about yourself..."
                                            rows="3"
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-xs">Max 200 characters</span>
                                        </label>
                                    </div>

                                    {/* LANGUAGES */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Native Language</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nativeLanguage"
                                                value={formData.nativeLanguage}
                                                onChange={handleChange}
                                                className="input input-bordered focus:input-primary"
                                                placeholder="e.g., English"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Learning Language</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="learningLanguage"
                                                value={formData.learningLanguage}
                                                onChange={handleChange}
                                                className="input input-bordered focus:input-primary"
                                                placeholder="e.g., Spanish"
                                            />
                                        </div>
                                    </div>

                                    {/* LOCATION */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Location</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="input input-bordered focus:input-primary"
                                            placeholder="City, Country"
                                        />
                                    </div>

                                    {/* ERROR MESSAGE */}
                                    {updateError && (
                                        <div className="alert alert-error">
                                            <span>{updateError.response?.data?.message || "Error updating profile"}</span>
                                        </div>
                                    )}

                                    {/* BUTTONS */}
                                    <div className="flex gap-3 mt-6 pt-4 border-t border-base-300">
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-1 gap-2 normal-case"
                                            disabled={updating}
                                        >
                                            {updating ? (
                                                <>
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <SaveIcon className="size-5" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline flex-1 gap-2 normal-case"
                                            onClick={() => setEditMode(false)}
                                        >
                                            <XIcon className="size-5" />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PASSWORD CHANGE MODAL */}
            {showPassChange && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-base-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="card-title gap-2">
                                    <LockIcon className="size-6" />
                                    Change Password
                                </h2>
                                <button
                                    className="btn btn-ghost btn-sm btn-circle"
                                    onClick={() => {
                                        setShowPassChange(false);
                                        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                    }}
                                >
                                    <XIcon className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                {/* CURRENT PASSWORD */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Current Password</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            name="currentPassword"
                                            value={passwords.currentPassword}
                                            onChange={handlePassChange}
                                            className="input input-bordered w-full focus:input-primary"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                        >
                                            {showPasswords ? (
                                                <EyeOffIcon className="size-5" />
                                            ) : (
                                                <EyeIcon className="size-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* NEW PASSWORD */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">New Password</span>
                                    </label>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePassChange}
                                        className="input input-bordered focus:input-primary"
                                        minLength={6}
                                        required
                                    />
                                    <label className="label">
                                        <span className="label-text-alt text-xs">Min 6 characters</span>
                                    </label>
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Confirm Password</span>
                                    </label>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handlePassChange}
                                        className="input input-bordered focus:input-primary"
                                        minLength={6}
                                        required
                                    />
                                </div>

                                {/* ERROR */}
                                {passError && (
                                    <div className="alert alert-error">
                                        <span>{passError.response?.data?.message || "Error changing password"}</span>
                                    </div>
                                )}

                                {/* PASSWORD MATCH INDICATOR */}
                                {passwords.newPassword && passwords.confirmPassword && (
                                    <div className={`flex items-center gap-2 text-sm ${passwords.newPassword === passwords.confirmPassword ? "text-success" : "text-error"}`}>
                                        <CheckCircleIcon className="size-4" />
                                        {passwords.newPassword === passwords.confirmPassword
                                            ? "Passwords match"
                                            : "Passwords do not match"}
                                    </div>
                                )}

                                {/* BUTTONS */}
                                <div className="flex gap-3 mt-6 pt-4 border-t border-base-300">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1 normal-case"
                                        disabled={
                                            changingPass ||
                                            passwords.newPassword !== passwords.confirmPassword ||
                                            !passwords.currentPassword
                                        }
                                    >
                                        {changingPass ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            "Change Password"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline flex-1 normal-case"
                                        onClick={() => {
                                            setShowPassChange(false);
                                            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
