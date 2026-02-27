import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
  removeFriend,
  cancelFriendRequest,
  rejectFriendRequest,
  searchUsers,
  getUserById,
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.delete("/friends/:id", removeFriend);

router.post("/friend-request/:id", sendFriendRequest);
router.delete("/friend-request/:id", cancelFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/reject", rejectFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

// search for users by name
router.get("/search", searchUsers);

// public profile lookup
router.get("/:id", getUserById);

export default router;
