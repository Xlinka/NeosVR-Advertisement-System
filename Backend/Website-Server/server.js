const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import the registration and login scripts
const registerRouter = require('./register');
const loginRouter = require('./login');

// Mount the registration and login routers
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// Start the server
const port = 3000; // Change the port number if needed
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});