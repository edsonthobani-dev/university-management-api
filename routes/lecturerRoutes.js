import express from 'express'; // Import express to create the server
import sql from '../db.js';  // Import sql from db.js to interact with the database
import { getPool } from '../db.js';  // Import getPool from db.js to get the database connection pool

const router = express.Router();  // Create a new router instance to define lecturer-related routes

// GET all lecturers

router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Lecturer');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific lecturer by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Lecturer WHERE LecturerID = @id');

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Lecturer not found' });

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new lecturer
router.post('/', async (req, res) => {
  const { FirstName, LastName, Email, ContactNumber } = req.body;
  try {
    const pool = getPool();
    await pool.request()
      .input('FirstName', sql.VarChar, FirstName)
      .input('LastName', sql.VarChar, LastName)
      .input('Email', sql.VarChar, Email)
      .input('ContactNumber', sql.VarChar, ContactNumber)
      .query(`
        INSERT INTO Lecturer (FirstName, LastName, Email, ContactNumber)
        VALUES (@FirstName, @LastName, @Email, @ContactNumber)
      `);

    res.status(201).json({ message: 'Lecturer created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (update) a lecturer
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
        UPDATE Lecturer
        SET FirstName = @FirstName, LastName = @LastName,
            Email = @Email, ContactNumber = @ContactNumber
        WHERE LecturerID = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Lecturer not found' });

    res.json({ message: 'Lecturer updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a lecturer
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Lecturer WHERE LecturerID = @id');

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Lecturer not found' });

    res.json({ message: 'Lecturer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;