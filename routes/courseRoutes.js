import express from 'express';
import sql from '../db.js';
import { getPool } from '../db.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all - open to all
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Course');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single - open to all
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Course WHERE CourseID = @id');

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Course not found' });

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - admin only
router.post('/', verifyToken, verifyRole('admin'), async (req, res) => {
  const { CourseName, Credits, DurationYears } = req.body;
  try {
    const pool = getPool();
    await pool.request()
      .input('CourseName', sql.VarChar, CourseName)
      .input('Credits', sql.Int, Credits)
      .input('DurationYears', sql.Int, DurationYears)
      .query(`
        INSERT INTO Course (CourseName, Credits, DurationYears)
        VALUES (@CourseName, @Credits, @DurationYears)
      `);

    res.status(201).json({ message: 'Course created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - admin only
router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  const { CourseName, Credits, DurationYears } = req.body;
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('CourseName', sql.VarChar, CourseName)
      .input('Credits', sql.Int, Credits)
      .input('DurationYears', sql.Int, DurationYears)
      .query(`
        UPDATE Course
        SET CourseName = @CourseName, Credits = @Credits,
            DurationYears = @DurationYears
        WHERE CourseID = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - admin only
router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Course WHERE CourseID = @id');

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;