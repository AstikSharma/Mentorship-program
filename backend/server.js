import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import routes from './routes.js';

dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests only from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json()); // Parse JSON request bodies

// Connect to the database
connectDB()
  .then(() => {
    console.log('Connected to the PostgreSQL database');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// Routes
app.use('/api/users', routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
