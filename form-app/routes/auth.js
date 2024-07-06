// auth.js
const express = require("express");
const User = require("../models/UserModel");
const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { auth_identifier, password } = req.body;
    const user = await User.findByCredentials(auth_identifier, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
