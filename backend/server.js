import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import routes from './routes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'https://mentorship-program-1.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
  })
);
app.use(express.json());

connectDB()
  .then(() => {
    console.log('Connected to the PostgreSQL database');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

app.use('/api/users', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
