import { config } from 'dotenv';
config();
import express from 'express';  // Import express to create the server
import bodyParser from 'body-parser'; // Import body-parser to parse incoming request bodies
import { connectDB } from './db.js';   // Import the connectDB function from db.js


// Import the route handlers for different entities
import studentRoutes from './routes/studentRoutes.js'; // Import student routes to handle student-related API endpoints
import courseRoutes from './routes/courseRoutes.js';  // Import course routes to handle course-related API endpoints
import lecturerRoutes from './routes/lecturerRoutes.js'; // Import lecturer routes to handle lecturer-related API endpoints
import enrollmentRoutes from './routes/enrollmentRoutes.js'; // Import enrollment routes to handle enrollment-related API endpoints
import authRoutes from './routes/authRoutes.js'; // Import auth routes to handle authentication-related API endpoints
import marksRoutes from './routes/marksRoutes.js';

// Create an instance of the Express application
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/marks', marksRoutes);

// connect database
connectDB();

// routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lecturers', lecturerRoutes);

// root route
app.get('/', (req, res) => {
  res.send('Welcome to Ndabane Management API');
});

// start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});