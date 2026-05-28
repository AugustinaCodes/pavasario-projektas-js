const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorHandler");
const catchAsync = require("./utils/catchAsync");
const sessionRoutes = require("./routes/sessionRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { testDatabaseConnection } = require("./config/db");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/bookings", bookingRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/auth", authRoutes);

app.get(
  "/api/health",
  catchAsync(async (req, res) => {
    await testDatabaseConnection();

    res.status(200).json({
      status: "success",
      message: "FitBook API is running",
      database: "connected",
    });
  })
);

app.use(errorHandler);

module.exports = app;