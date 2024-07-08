const express = require('express');
const mongoose = require('mongoose');
const characterRoutes = require('./characterRoutes');
const { errorHandler, notFoundHandler } = require('./errorHandlers');
require('dotenv').config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json("hollow dev");
});

app.use('/api/Character', characterRoutes);

// Error handler for not found
app.use(notFoundHandler);

// Error handler for internal server errors
app.use(errorHandler);

const port = 3000;

app.listen(port, () => {
  console.log(`The server is running on port`);
});

mongoose.connect(process.env.Database_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log("Database connection failed:", error.message);
  });

