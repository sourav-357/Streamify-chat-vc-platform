import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        groupPic: {
            type: String,
            default: "https://ui-avatars.com/api/?name=Group&background=random",
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        lastMessage: {
            type: String,
            default: "",
        },
        lastMessageSender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        lastMessageTime: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

groupSchema.index({ admin: 1 });
groupSchema.index({ members: 1 });
groupSchema.index({ lastMessageTime: -1 });

const Group = mongoose.model("Group", groupSchema);
export default Group;
