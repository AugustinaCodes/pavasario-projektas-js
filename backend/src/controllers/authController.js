const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { createUser, findUserByEmail } = require("../models/userModel");
const { createSendToken } = require("../utils/jwt");

const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.validated.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const newUser = await createUser({
        name,
        email,
        password,
        role: "user",
    });

    createSendToken(newUser, 201, res);
});

module.exports = {
    register,
};