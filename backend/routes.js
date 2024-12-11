import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  editProfile,
  authenticate,
  deleteProfileAndUser,
  getProfileImage,
  discoverProfiles,
  getUserProfile,
  sendConnectionRequest,
  respondToConnectionRequest,
  getPendingConnectionRequests,
  getUserConnections,
  fetchNotifications,
  markAsRead,
  getSentRequests
} from "./controllers.js";
import { uploadProfileImage } from "./multersetup.js";
import { pool } from "./database.js";
import { verifyToken } from "./verifytoken.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Profile routes
router.get("/profile", authenticate, getProfile);
router.put('/profile', authenticate, uploadProfileImage, editProfile);
router.get("/profile/image", authenticate, getProfileImage);
router.get('/profile/:username', getUserProfile);
router.delete("/profile", authenticate, deleteProfileAndUser);

// Page routes
router.get("/discover", authenticate, discoverProfiles);

// Connection routes
router.post("/connections", authenticate, sendConnectionRequest);
router.put("/connections/:connectionId", authenticate, respondToConnectionRequest);
router.get("/connections/pending", authenticate, getPendingConnectionRequests);
router.get("/connections", authenticate, getUserConnections);
router.get("/connections/sent", authenticate, getSentRequests);

// Notification routes
router.get("/notifications", authenticate, fetchNotifications);
router.put("/notifications/:id/read", authenticate, markAsRead);

export default router;
