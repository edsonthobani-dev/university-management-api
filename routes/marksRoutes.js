import express from 'express';
import sql from '../db.js';
import { getPool } from '../db.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all marks - admin only
router.get('/', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT m.MarkID, m.Mark, m.Grade, m.DateRecorded,
             s.FirstName + ' ' + s.LastName AS StudentName,
             c.CourseName
      FROM Mark m
      JOIN Student s ON m.StudentID = s.StudentID
      JOIN Course c ON m.CourseID = c.CourseID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET marks by student
router.get('/student/:studentId', verifyToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('studentId', sql.Int, req.params.studentId)
      .query(`
        SELECT m.MarkID, m.Mark, m.Grade, m.DateRecorded,
               c.CourseName
        FROM Mark m
        JOIN Course c 
        ON m.CourseID = c.CourseID
        WHERE m.StudentID = @studentId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET marks by course
router.get('/course/:courseId', verifyToken, verifyRole('admin', 'lecturer'), async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('courseId', sql.Int, req.params.courseId)
      .query(`
        SELECT m.MarkID, m.Mark, m.Grade, m.DateRecorded,
               s.FirstName + ' ' + s.LastName AS StudentName
        FROM Mark m
        JOIN Student s ON m.StudentID = s.StudentID
        WHERE m.CourseID = @courseId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add mark - lecturer and admin only
router.post('/', verifyToken, verifyRole('admin', 'lecturer'), async (req, res) => {
  const { StudentID, CourseID, Mark } = req.body;

  // calculate grade
  let Grade;
  if (Mark >= 75) Grade = 'A';
  else if (Mark >= 60) Grade = 'B';
  else if (Mark >= 50) Grade = 'C';
  else if (Mark >= 40) Grade = 'D';
  else Grade = 'F';

  try {
    const pool = getPool();
    await pool.request()
      .input('StudentID', sql.Int, StudentID)
      .input('CourseID', sql.Int, CourseID)
      .input('Mark', sql.Decimal(5, 2), Mark)
      .input('Grade', sql.VarChar, Grade)
      .query(`
        INSERT INTO Mark (StudentID, CourseID, Mark, Grade)
        VALUES (@StudentID, @CourseID, @Mark, @Grade)
      `);

    res.status(201).json({ message: 'Mark added successfully', Grade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update mark - lecturer and admin only
router.put('/:id', verifyToken, verifyRole('admin', 'lecturer'), async (req, res) => {
  const { Mark } = req.body;

  let Grade;
  if (Mark >= 75) Grade = 'A';
  else if (Mark >= 60) Grade = 'B';
  else if (Mark >= 50) Grade = 'C';
  else if (Mark >= 40) Grade = 'D';
  else Grade = 'F';

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('Mark', sql.Decimal(5, 2), Mark)
      .input('Grade', sql.VarChar, Grade)
      .query(`
        UPDATE Mark
        SET Mark = @Mark, Grade = @Grade
        WHERE MarkID = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Mark not found' });

    res.json({ message: 'Mark updated successfully', Grade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE mark - admin only
router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Mark WHERE MarkID = @id');

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Mark not found' });

    res.json({ message: 'Mark deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;