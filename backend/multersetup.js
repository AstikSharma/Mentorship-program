import multer from 'multer';

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Use this middleware for handling file uploads in the editProfile route
export const uploadProfileImage = upload.single('profileImage');
