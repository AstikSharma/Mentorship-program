import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  addUser,
  findUserByUsername,
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileByUsername,
  pool,
  addConnectionRequest,
  updateConnectionStatus,
  getPendingRequests,
  getConnections,
  createNotification,
  getUserNotifications,
  markNotificationAsRead
} from "./database.js";
import { uploadProfileImage } from './multersetup.js';

// User Registration
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await addUser(username, email, hashedPassword);

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await createProfile(newUser.id, {
      about: "",
      role: "mentee", 
      skills: "",
      interests: "",
      bio: "",
      profileImage: "",
    });    

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Token Authentication Middleware
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("Token is missing");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verified:", decoded);
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Forbidden" });
  }
};


// Get Profile
export const getProfile = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.username,
        p.about,
        p.role,
        p.skills,
        p.interests,
        p.bio,
        p.profile_image
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
    `;
    const result = await pool.query(query, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const profile = result.rows[0];

    if (profile.profile_image) {
      profile.profile_image = `data:image/jpeg;base64,${profile.profile_image.toString(
        "base64"
      )}`;
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create or Update Profile
export const editProfile = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const { role, skills, interests, bio, about } = req.body;
    const profileImage = req.file ? req.file.buffer : null;

    if (!role || (role !== "mentor" && role !== "mentee")) {
      console.error("Invalid Role:", role);
      return res.status(400).json({ message: "Invalid role" });
    }

    const profileData = {
      about,
      role,
      skills,
      interests,
      bio,
      profileImage,
    };

    let profile = await getProfileByUserId(req.user.id);
    if (profile) {
      profile = await updateProfile(req.user.id, profileData);
    } else {
      profile = await createProfile(req.user.id, profileData);
    }

    console.log("Updated Profile:", profile);
    res.json(profile);
  } catch (err) {
    console.error("Error in editProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Profile and User
export const deleteProfileAndUser = async (req, res) => {
  try {
    const userId = req.user.id;

    await deleteProfile(userId);
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.status(200).json({ message: "Profile and user deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfileImage = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.username,
        p.profile_image
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
    `;
    const result = await pool.query(query, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const profile = result.rows[0];

    if (profile.profile_image) {
      profile.profile_image = `data:image/jpeg;base64,${profile.profile_image.toString(
        "base64"
      )}`;
    }

    res.json({
      username: profile.username,
      profileImage: profile.profile_image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const discoverProfiles = async (req, res) => {
  try {
    const { role, skills, interests } = req.query;
    const currentUserId = req.user.id;

    let query = `
      SELECT 
        profiles.*, 
        users.username, 
        profiles.profile_image
      FROM profiles
      INNER JOIN users ON profiles.user_id = users.id
      WHERE profiles.user_id != $1
    `;
    const params = [currentUserId];
    let index = 2;

    if (role) {
      query += ` AND profiles.role = $${index++}`;
      params.push(role);
    }

    if (skills) {
      query += ` AND profiles.skills ILIKE $${index++}`;
      params.push(`%${skills}%`);
    }

    if (interests) {
      query += ` AND profiles.interests ILIKE $${index++}`;
      params.push(`%${interests}%`);
    }

    const result = await pool.query(query, params);

    const profiles = result.rows.map((row) => {
      if (row.profile_image) {
        row.profile_image = `data:image/jpeg;base64,${row.profile_image.toString("base64")}`;
      }
      return row;
    });

    res.json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Requested username:", username); 

    const profile = await getProfileByUsername(username);
    console.log("Fetched profile:", profile);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.profile_image) {
      profile.profile_image = `data:image/jpeg;base64,${profile.profile_image.toString("base64")}`;
    }

    res.json(profile);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// User Logout
export const logoutUser = (req, res) => {
  res.json({ message: "User logged out successfully" });
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const requesterId = req.user.id;

    if (requesterId === receiverId) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }

    const connection = await addConnectionRequest(requesterId, receiverId);

    const message = `You have received a connection request from ${req.user.username}.`;
    await createNotification(receiverId, message);

    res.status(201).json(connection);
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const respondToConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const connection = await updateConnectionStatus(connectionId, status);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    if (status === "accepted") {
      const senderId = connection.requester_id;
      const message = `${req.user.username} has accepted your connection request.`;
      await createNotification(senderId, message);
    }

    res.json(connection);
  } catch (error) {
    console.error("Error responding to connection request:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getPendingConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await getPendingRequests(userId);
    res.json(requests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await getConnections(userId);
    res.json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchNotifications = async (req, res) => {
  try {
    const notifications = await pool.query(
      `
      SELECT * FROM notifications
      WHERE user_id = $1 AND read = false
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );
    res.json(notifications.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const updatedNotification = await markNotificationAsRead(notificationId);

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json(updatedNotification); 
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `
      SELECT receiver_id
      FROM connections
      WHERE requester_id = $1 AND status = 'pending'
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ message: "Server error" });
  }
}; 