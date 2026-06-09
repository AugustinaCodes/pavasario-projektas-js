const express = require("express");

const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  fetchAdminAnalytics,
  fetchMyAnalytics,
} = require("../controllers/analyticsController");

const router = express.Router();

router.use(protect);

router.get("/me", fetchMyAnalytics);
router.get("/admin", restrictTo("admin"), fetchAdminAnalytics);

module.exports = router;