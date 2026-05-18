const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const { testDatabaseConnection } = require("./config/db");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", async (req, res, next) => {
  try {
    await testDatabaseConnection();

    res.status(200).json({
      status: "success",
      message: "FitBook API is running",
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

module.exports = app;