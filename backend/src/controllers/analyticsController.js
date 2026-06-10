const catchAsync = require("../utils/catchAsync");
const {
  getAdminAnalytics,
  getMyAnalytics,
} = require("../models/analyticsModel");

const fetchAdminAnalytics = catchAsync(async (req, res) => {
  const analytics = await getAdminAnalytics();

  res.status(200).json({
    status: "success",
    data: {
      analytics,
    },
  });
});

const fetchMyAnalytics = catchAsync(async (req, res) => {
  const analytics = await getMyAnalytics(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      analytics,
    },
  });
});

module.exports = {
  fetchAdminAnalytics,
  fetchMyAnalytics,
};