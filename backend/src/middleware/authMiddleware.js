const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { findUserById } = require("../models/userModel");

const protect = catchAsync(async (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        throw new AppError("You are not logged in", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await findUserById(decoded.id);

    if (!currentUser) {
        throw new AppError("The user belonging to this token no longer exists", 401);
    }

    req.user = currentUser;

    next();
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new AppError("You do not have permission to perform this action", 403)
            );
        }

        next();
    };
};

module.exports = {
    protect,
    restrictTo,
};