const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;
const Form = require("./FormModel");
require("dotenv").config();

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    }
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      user.password = await bcrypt.hash(user.password, 11);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: "24h",
  });
  return token;
};

UserSchema.statics.isUsernameTaken = async function(username) {
  const user = await User.findOne({ username });
  return user ? true : false;
};

UserSchema.statics.isEmailTaken = async function(email) {
  const user = await User.findOne({ email });
  return user ? true : false;
};

UserSchema.statics.findByIdentifiers = async (auth_identifier) => {
  try {
    const user = await User.findOne({
      $or: [{ username: auth_identifier }, { email: auth_identifier }],
    });
    return user;
  } catch (error) {
    throw new Error("Error finding user by identifiers");
  }
};

UserSchema.statics.findByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ _id: decoded._id });
    return user;
  } catch (error) {
    throw new Error("Error finding user by token");
  }
};

UserSchema.statics.findByCredentials = async (auth_identifier, password) => {
  const user = await User.findByIdentifiers(auth_identifier);
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }
  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
