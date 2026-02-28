import { generateStreamToken } from "../lib/stream.js";
import Conversation from "../models/Conversation.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all conversations for the current user
export async function getConversations(req, res) {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "fullName profilePic nativeLanguage learningLanguage")
      .sort({ lastMessageTime: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.log("Error in getConversations controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get or create a conversation between two users
export async function getOrCreateConversation(req, res) {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    if (userId === otherUserId) {
      return res.status(400).json({ message: "Cannot create conversation with yourself" });
    }

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    }).populate("participants", "fullName profilePic nativeLanguage learningLanguage");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherUserId],
      });

      conversation = await conversation.populate(
        "participants",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in getOrCreateConversation controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all groups for the current user
export async function getGroups(req, res) {
  try {
    const userId = req.user.id;

    const groups = await Group.find({
      $or: [{ admin: userId }, { members: userId }],
    })
      .populate("admin", "fullName profilePic")
      .populate("members", "fullName profilePic")
      .populate("lastMessageSender", "fullName")
      .sort({ lastMessageTime: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getGroups controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create a new group
export async function createGroup(req, res) {
  try {
    const userId = req.user.id;
    const { name, description, members } = req.body;

    if (!name || !members || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Group name and at least one member are required" });
    }

    if (name.length > 50) {
      return res.status(400).json({ message: "Group name must be less than 50 characters" });
    }

    // Verify all members exist
    const existingMembers = await User.find({ _id: { $in: members } });
    if (existingMembers.length !== members.length) {
      return res.status(404).json({ message: "Some members not found" });
    }

    // Ensure admin is included in members
    const uniqueMembers = [...new Set([...members, userId])];

    const group = await Group.create({
      name,
      description: description || "",
      admin: userId,
      members: uniqueMembers,
    });

    const populatedGroup = await group.populate([
      { path: "admin", select: "fullName profilePic" },
      { path: "members", select: "fullName profilePic" },
    ]);

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.log("Error in createGroup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add member to group
export async function addGroupMember(req, res) {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // Check if member already exists
    if (group.members.includes(memberId)) {
      return res.status(400).json({ message: "Member already in group" });
    }

    // Check if member exists
    const memberExists = await User.findById(memberId);
    if (!memberExists) {
      return res.status(404).json({ message: "User not found" });
    }

    group.members.push(memberId);
    await group.save();

    const updatedGroup = await group.populate([
      { path: "admin", select: "fullName profilePic" },
      { path: "members", select: "fullName profilePic" },
    ]);

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in addGroupMember controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Remove member from group
export async function removeGroupMember(req, res) {
  try {
    const userId = req.user.id;
    const { groupId, memberId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin or removing themselves
    if (group.admin.toString() !== userId && userId !== memberId) {
      return res.status(403).json({ message: "Not authorized to remove this member" });
    }

    group.members = group.members.filter((m) => m.toString() !== memberId);
    await group.save();

    const updatedGroup = await group.populate([
      { path: "admin", select: "fullName profilePic" },
      { path: "members", select: "fullName profilePic" },
    ]);

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in removeGroupMember controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete group (admin only)
export async function deleteGroup(req, res) {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only admin can delete group" });
    }

    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.log("Error in deleteGroup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

