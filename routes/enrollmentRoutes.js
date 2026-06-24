import express from 'express';  // Import express to create the server
import sql from '../db.js';  // Import sql from db.js to interact with the database
import { getPool } from '../db.js';  // Import getPool from db.js to get the database connection pool
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';


const router = express.Router();  // Create a new router instance to define enrollment-related routes

// GET all enrollments
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT e.EnrollmentID, e.EnrollmentDate,
             s.StudentID, s.FirstName + ' ' + s.LastName AS StudentName,
             c.CourseID, c.CourseName
      FROM Enrollment e
      JOIN Student s ON e.StudentID = s.StudentID
      JOIN Course c ON e.CourseID = c.CourseID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET enrollments by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('studentId', sql.Int, req.params.studentId)
      .query(`
        SELECT e.EnrollmentID, e.EnrollmentDate,
               c.CourseID, c.CourseName, c.Credits
        FROM Enrollment e
        JOIN Course c ON e.CourseID = c.CourseID
        WHERE e.StudentID = @studentId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET enrollments by course
router.get('/course/:courseId', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('courseId', sql.Int, req.params.courseId)
      .query(`
        SELECT e.EnrollmentID, e.EnrollmentDate,
               s.StudentID, s.FirstName + ' ' + s.LastName AS StudentName
        FROM Enrollment e
        JOIN Student s ON e.StudentID = s.StudentID
        WHERE e.CourseID = @courseId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST enroll a student
router.post('/', verifyToken, verifyRole('admin', 'lecturer'), async (req, res) => {
  const { StudentID, CourseID } = req.body;
  try {
    const pool = getPool();
    await pool.request()
      .input('StudentID', sql.Int, StudentID)
      .input('CourseID', sql.Int, CourseID)
      .query(`
        INSERT INTO Enrollment (StudentID, CourseID)
        VALUES (@StudentID, @CourseID)
      `);
    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE unenroll a student
router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Enrollment WHERE EnrollmentID = @id');

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Enrollment not found' });

    res.json({ message: 'Student unenrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;