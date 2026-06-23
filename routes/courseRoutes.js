import express from 'express';
import sql from '../db.js';
import { getPool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Course');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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