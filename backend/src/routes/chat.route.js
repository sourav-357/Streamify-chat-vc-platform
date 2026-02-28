import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getStreamToken,
    getConversations,
    getOrCreateConversation,
    getGroups,
    createGroup,
    addGroupMember,
    removeGroupMember,
    deleteGroup,
} from "../controllers/chat.controller.js";

const router = express.Router();

// Conversation routes
router.get("/token", protectRoute, getStreamToken);
router.get("/conversations", protectRoute, getConversations);
router.get("/conversation/:otherUserId", protectRoute, getOrCreateConversation);

// Group routes
router.get("/groups", protectRoute, getGroups);
router.post("/groups", protectRoute, createGroup);
router.post("/groups/:groupId/members", protectRoute, addGroupMember);
router.delete("/groups/:groupId/members/:memberId", protectRoute, removeGroupMember);
router.delete("/groups/:groupId", protectRoute, deleteGroup);

export default router;

