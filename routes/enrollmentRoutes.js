import express from 'express';
import sql from '../db.js';
import { getPool } from '../db.js';

const router = express.Router();

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
router.post('/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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