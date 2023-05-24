const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router();

const advertisementFolderPath = path.join(__dirname, 'Advertisement');
let currentImageIndex = 0;
let imageUrls = [];

// Load the image URLs from the "Advertisement" folder
fs.readdir(advertisementFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading advertisement folder:', err);
    return;
  }

  imageUrls = files.map(file => `/advertisement/${file}`);
});

// Endpoint for getting the current image URL
router.get('/get_image_url', (req, res) => {
  if (imageUrls.length === 0) {
    return res.status(404).json({ error: 'No images found' });
  }

  const imageUrl = imageUrls[currentImageIndex];
  res.json({ imageUrl });
});

// Flip to the next image at the specified interval
const interval = 10000; // Change this value to adjust the interval (in milliseconds)
setInterval(() => {
  currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
}, interval);

app.use('/advertisement', router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});