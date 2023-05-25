const express = require('express');
const app = express();

const register = require('./register');

app.use('/register', register);


// Start the server
const port = 3000; // Change the port number if needed
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});