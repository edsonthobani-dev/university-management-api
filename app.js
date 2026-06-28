import { config } from 'dotenv';
config();
import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './db.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import marksRoutes from './routes/marksRoutes.js';
import { swaggerUi, specs } from './swagger.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.send('Welcome to Ndabane Management API');
});

// connect database then start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
};

start();