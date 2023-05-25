const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('database.db');

router.post('/', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const query = 'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1';
  db.get(query, [username, email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while checking user existence.' });
    }

    if (row) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while hashing the password.' });
      }

      // Insert the new user into the database
      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.run(insertQuery, [username, email, hashedPassword], (err) => {
        if (err) {
          return res.status(500).json({ error: 'An error occurred while registering the user.' });
        }
        
        return res.status(200).json({ message: 'Registration successful.' });
      });
    });
  });
});

module.exports = router;
