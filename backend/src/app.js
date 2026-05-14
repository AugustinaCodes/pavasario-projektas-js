const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "FitBook API is running",
  });
});

app.use(errorHandler);

module.exports = app;