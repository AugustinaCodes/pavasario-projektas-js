const bcrypt = require("bcryptjs");
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

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.validated.body;

    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401);
    }

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };

    createSendToken(safeUser, 200, res);
});

const logout = (req, res) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};

const getMe = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: req.user,
        },
    });
};

module.exports = {
    register,
    login,
    logout,
    getMe,
};