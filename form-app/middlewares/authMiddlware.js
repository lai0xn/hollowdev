const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const logger = require("../utils/logger");
const authMiddleware = async (req, res, next) => {
  try {
    logger.info("Authenticating user");

    logger.info("Checking for token");
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      logger.error("No token provided");
      throw new Error("No token provided");
    }
    logger.info("Token found");

    logger.info("Verifying token");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      logger.error("Invalid token");
      throw new Error("Invalid token");
    }
    console.log(decoded);
    logger.info("Token verified");

    logger.info("Finding user");
    const user = await User.findOne({ _id: decoded._id });

    logger.info("Checking for user");
    if (!user) {
      logger.error("No user found");
      throw new Error("No user found");
    }

    logger.info("User found");

    req.token = token;
    req.user = user;

    logger.info("User authenticated");
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authMiddleware;
