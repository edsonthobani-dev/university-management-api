import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import express from 'express'; // Import express to create the server
import sql from '../db.js'; // Import sql from db.js to interact with the database
import { getPool } from '../db.js'; // Import getPool from db.js to get the database connection pool
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js'; // Import authentication middleware to protect routes and verify user roles


const router = express.Router(); // Create a new router instance to define student-related routes
// GET all students
/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email or student number
 *     responses:
 *       200:
 *         description: List of students
 */

router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const { search } = req.query;

    let query = 'SELECT * FROM Student';

    if (search) {
      query += ` WHERE FirstName LIKE @search 
                 OR LastName LIKE @search 
                 OR Email LIKE @search
                 OR StudentNumber LIKE @search`;
    }

    const request = pool.request();
    if (search) {
      request.input('search', sql.VarChar, `%${search}%`);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific student by ID
/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */
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
/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               StudentNumber:
 *                 type: string
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *               ContactNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', verifyToken, verifyRole('admin'),
  [
    body('StudentNumber').notEmpty().withMessage('Student number is required'),
    body('FirstName').notEmpty().withMessage('First name is required'),
    body('LastName').notEmpty().withMessage('Last name is required'),
    body('Email').isEmail().withMessage('Valid email is required'),
    body('ContactNumber').notEmpty().withMessage('Contact number is required')
  ],
  validate,
  async (req, res) => {
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
  }
);

// PUT (update) a student
/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *               ContactNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 */
router.put('/:id', verifyToken, verifyRole('admin'),
  [
    body('FirstName').notEmpty().withMessage('First name is required'),
    body('LastName').notEmpty().withMessage('Last name is required'),
    body('Email').isEmail().withMessage('Valid email is required'),
    body('ContactNumber').notEmpty().withMessage('Contact number is required')
  ],
  validate,
  async (req, res) => {
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
  }
);

// DELETE a student
/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
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