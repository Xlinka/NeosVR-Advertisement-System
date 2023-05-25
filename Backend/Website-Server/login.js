const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('database.db');

router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
  db.get(query, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while retrieving user information.' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Username not found.' });
    }

    // Compare the password
    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while comparing passwords.' });
      }

      if (!result) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // Password is correct, login successful
      return res.status(200).json({ message: 'Login successful.' });
    });
  });
});

module.exports = router;