const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoutes");
const { MONGO_URL, PORT } = process.env;
const { createServer } = require("http");
const { Server } = require("socket.io");
const { connectToSocket } = require("./controllers/socketManage.js");

const server = createServer(app);
const io = connectToSocket(server);

const start = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is connected successfully");

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://roaring-brioche-d6aaca.netlify.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", authRoute);

start();
