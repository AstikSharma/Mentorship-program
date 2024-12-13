import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false },  
});

// Connect to the database
export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    throw error;
  }
};

// Create users and profiles table if they do not exist
const createTables = async () => {
  const usersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `;

  const profilesTableQuery = `
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE,
      about TEXT,
      role VARCHAR(20),
      skills TEXT,
      interests TEXT,
      bio TEXT,
      profile_image BYTEA,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const connectionsTableQuery = `
    CREATE TABLE IF NOT EXISTS connections (
      id SERIAL PRIMARY KEY,
      requester_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const notificationsTableQuery = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    await pool.query(usersTableQuery);
    await pool.query(profilesTableQuery);
    await pool.query(connectionsTableQuery);
    await pool.query(notificationsTableQuery);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Call the function to create the tables
createTables();

// Functions for profiles
export const getProfileByUserId = async (userId) => {
  const query = "SELECT * FROM profiles WHERE user_id = $1";
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

export const createProfile = async (userId, profileData) => {
  const query = `
    INSERT INTO profiles (user_id, about, role, skills, interests, bio, profile_image)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    userId,
    profileData.about,
    profileData.role,
    profileData.skills,
    profileData.interests,
    profileData.bio,
    profileData.profileImage,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateProfile = async (userId, profileData) => {
  try {
    // Get the existing profile to preserve the profile_image if not updated
    const existingProfileQuery = "SELECT profile_image FROM profiles WHERE user_id = $1";
    const existingProfileResult = await pool.query(existingProfileQuery, [userId]);

    const existingProfileImage =
      existingProfileResult.rows[0]?.profile_image || null;

    const query = `
      UPDATE profiles
      SET about = $2, role = $3, skills = $4, interests = $5, bio = $6, profile_image = COALESCE($7, profile_image)
      WHERE user_id = $1
      RETURNING *;
    `;
    const values = [
      userId,
      profileData.about,
      profileData.role,
      profileData.skills,
      profileData.interests,
      profileData.bio,
      profileData.profileImage || existingProfileImage, // Use the new image if provided, otherwise retain the existing
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error in updateProfile:", err);
    throw err;
  }
};

// Function to fetch profile by username
export const getProfileByUsername = async (username) => {
  const query = `
    SELECT 
      profiles.*, 
      users.username, 
      users.email, 
      users.password,
      profiles.profile_image
    FROM profiles
    INNER JOIN users ON profiles.user_id = users.id
    WHERE users.username = $1;
  `;

  // Run the query with the username as the parameter
  const result = await pool.query(query, [username]);

  return result.rows[0]; // Return the first profile result
};

export const addUser = async (username, email, password) => {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username;
  `;
  const values = [username, email, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

export const deleteProfile = async (userId) => {
  const query = "DELETE FROM profiles WHERE user_id = $1";
  await pool.query(query, [userId]);
};

export const addConnectionRequest = async (requesterId, receiverId) => {
  const query = `
    INSERT INTO connections (requester_id, receiver_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [requesterId, receiverId]);
  return result.rows[0];
};

export const updateConnectionStatus = async (connectionId, status) => {
  const query = `
    UPDATE connections
    SET status = $2
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [connectionId, status]);
  return result.rows[0];
};
export const getPendingRequests = async (userId) => {
  const query = `
    SELECT connections.*, users.username AS requester_username
    FROM connections
    INNER JOIN users ON connections.requester_id = users.id
    WHERE receiver_id = $1 AND status = 'pending';
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getConnections = async (userId) => {
  const query = `
    SELECT users.id AS user_id, users.username, profiles.role, profiles.skills, profiles.interests
    FROM connections
    INNER JOIN users ON 
      (connections.requester_id = users.id OR connections.receiver_id = users.id)
    INNER JOIN profiles ON profiles.user_id = users.id
    WHERE (connections.requester_id = $1 OR connections.receiver_id = $1)
      AND connections.status = 'accepted'
      AND users.id != $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const createNotification = async (userId, message) => {
  const query = `
    INSERT INTO notifications (user_id, message)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, message]);
  return result.rows[0];
};

export const getUserNotifications = async (userId) => {
  const query = `
    SELECT * FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const markNotificationAsRead = async (id) => {
  const query = `
    UPDATE notifications
    SET read = true
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export { pool };
