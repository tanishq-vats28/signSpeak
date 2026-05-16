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
    if (!MONGO_URL) {
      throw new Error("MONGO_URL is missing. Add it to backend/.env before starting the server.");
    }

    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB is connected successfully");

    const port = PORT || 8000;
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.code === "ETIMEOUT") {
      console.error(
        "Check your network/DNS access to MongoDB Atlas and confirm your Atlas IP access list allows this machine."
      );
    }
  }
};

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zesty-kringle-0d79a3.netlify.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", authRoute);

start();
