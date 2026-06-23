import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './db.js';

import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';

import enrollmentRoutes from './routes/enrollmentRoutes.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use('/api/enrollments', enrollmentRoutes);

// connect database
connectDB();

// routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lecturers', lecturerRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Ndabane Management API');
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});