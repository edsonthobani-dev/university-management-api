import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '../db.js';
import { getPool } from '../db.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';


const router = express.Router();

router.post('/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'lecturer', 'student']).withMessage('Role must be admin, lecturer or student')
  ],
  validate,
  async (req, res) => {
    const { username, password, role } = req.body;
    try {
      const pool = getPool();

      const existing = await pool.request()
        .input('username', sql.VarChar, username)
        .query('SELECT * FROM Users WHERE username = @username');

      if (existing.recordset.length > 0)
        return res.status(400).json({ message: 'User already exists in the system' });

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.request()
        .input('username', sql.VarChar, username)
        .input('password', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, role)
        .query(`
          INSERT INTO Users (username, password, role)
          VALUES (@username, @password, @role)
        `);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const pool = getPool();

    // find user
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');

      //if you cant find it display user not found
    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = result.recordset[0];

    // check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: 'Invalid password' });

    // generate token
    const token = jwt.sign(
      { id: user.UserID, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Login successful yooh', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;