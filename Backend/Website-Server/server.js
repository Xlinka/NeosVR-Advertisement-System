const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import the registration script
const registerRouter = require('./register');

// Mount the registration router
app.use('/register', registerRouter);


// Start the server
const port = 3000; // Change the port number if needed
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
