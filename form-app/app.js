const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/form");
const formfieldRoutes = require("./routes/formfield");
const socketIo = require("socket.io");
const socketHandler = require("./websockets/socketHandler");
const cors = require("cors");
const app = express();
const port = 10000;

require("dotenv").config();

app.use(cors());
// Middleware
app.use(bodyParser.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.static("static"));
// Use auth routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/forms", formRoutes);
app.use("/api/v1/formfields", formfieldRoutes);
// basic route to test the server
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const io = socketIo(
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  }),
);
socketHandler(io);
