import express from 'express';
import sql from '../db.js';
import { getPool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Student');
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
      .query('SELECT * FROM Student WHERE StudentID = @id');

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Student not found' });

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { StudentNumber, FirstName, LastName, Email, ContactNumber } = req.body;
  try {
    const pool = getPool();
    await pool.request()
      .input('StudentNumber', sql.Char, StudentNumber)
      .input('FirstName', sql.VarChar, FirstName)
      .input('LastName', sql.VarChar, LastName)
      .input('Email', sql.VarChar, Email)
      .input('ContactNumber', sql.VarChar, ContactNumber)
      .query(`
        INSERT INTO Student (StudentNumber, FirstName, LastName, Email, ContactNumber)
        VALUES (@StudentNumber, @FirstName, @LastName, @Email, @ContactNumber)
      `);

    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { FirstName, LastName, Email, ContactNumber } = req.body;
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('FirstName', sql.VarChar, FirstName)
      .input('LastName', sql.VarChar, LastName)
      .input('Email', sql.VarChar, Email)
      .input('ContactNumber', sql.VarChar, ContactNumber)
      .query(`
        UPDATE Student
        SET FirstName = @FirstName, LastName = @LastName,
            Email = @Email, ContactNumber = @ContactNumber
        WHERE StudentID = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Student WHERE StudentID = @id');

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;