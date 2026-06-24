import express from 'express'; // Import express to create the server
import sql from '../db.js'; // Import sql from db.js to interact with the database
import { getPool } from '../db.js'; // Import getPool from db.js to get the database connection pool
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js'; // Import authentication middleware to protect routes and verify user roles


const router = express.Router(); // Create a new router instance to define student-related routes
// GET all students
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Student');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific student by ID
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

// POST a new student
router.post('/', verifyToken, verifyRole('admin'), async (req, res) => {
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

// PUT (update) a student
router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
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

// DELETE a student
router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
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