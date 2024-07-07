// auth.js
const express = require("express");
const User = require("../models/UserModel");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const UserModel = mongoose.model("User");
const logger = require("../utils/logger");

// Register route
router.post("/register", async (req, res) => {
  try {
    logger.info("Registering new user");
    const { username, email, password } = req.body;

    logger.info("Checking for missing fields");
    if (!username || !email || !password) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    logger.info("Creating new user");
    logger.info("Checking if username or email is already taken");
    const existingUser = await UserModel.isUsernameTaken(username);
    if (existingUser) {
      logger.error("Username is already taken");
      return res.status(400).send({ error: "Username is already taken" });
    }
    const existingEmail = await UserModel.isEmailTaken(email);
    if (existingEmail) {
      logger.error("Email is already taken");
      return res.status(400).send({ error: "Email is already taken" });
    }
    logger.info("Username and email are available");

    logger.info("Saving new user to database");
    const user = new User({ username, email, password });
    await user.save();
    logger.info("User saved successfully");

    logger.info("Generating auth token");
    const token = await user.generateAuthToken();
    logger.info("Auth token generated");
    res.status(201).send({ user, token });
    logger.info("User registered successfully");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    logger.info("Logging in user");

    logger.info("Checking for missing fields");
    const { auth_identifier, password } = req.body;
    if (!auth_identifier || !password) {
      logger.error("Missing required");
      return res.status(400).send({ error: "Missing required fields" });
    }
    logger.info("Required fields provided");

    logger.info("Finding user by credentials");
    const user = await UserModel.findByCredentials(auth_identifier, password);
    logger.info("User found");

    logger.info("Generating auth token");
    const token = await user.generateAuthToken();
    logger.info("Auth token generated");
    res.send({ user, token });
    logger.info("User logged in successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
