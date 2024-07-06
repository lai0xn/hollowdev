// auth.js
const express = require("express");
const User = require("../models/UserModel");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const UserModel = mongoose.model("User");
// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    const existingUser = await UserModel.isUsernameTaken(username);
    if (existingUser) {
      return res.status(400).send({ error: "Username is already taken" });
    }
    const existingEmail = await UserModel.isEmailTaken(email);
    if (existingEmail) {
      return res.status(400).send({ error: "Email is already taken" });
    }
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
    const user = await UserModel.findByCredentials(auth_identifier, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
