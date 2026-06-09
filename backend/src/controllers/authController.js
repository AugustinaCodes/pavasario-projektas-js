const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
    createUser,
    deleteUserById,
    findUserByEmail,
    updateUserById,
} = require("../models/userModel");
const { createSendToken } = require("../utils/jwt");

const clearAuthCookie = (res) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.validated.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    let newUser;

    try {
        newUser = await createUser({
            name,
            email,
            password,
            role: "user",
        });
    } catch (error) {
        if (error.code === "23505") {
            throw new AppError("Email already exists", 409);
        }

        throw error;
    }

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
    clearAuthCookie(res);

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

const updateMe = catchAsync(async (req, res) => {
    const { name, email, currentPassword, password } = req.validated.body;

    if (email && email !== req.user.email) {
        const existingUser = await findUserByEmail(email);

        if (existingUser && existingUser.id !== req.user.id) {
            throw new AppError("Email already exists", 409);
        }
    }

    let hashedPassword = null;

    if (password) {
        const storedUser = await findUserByEmail(req.user.email);

        if (!storedUser) {
            throw new AppError("The user no longer exists", 404);
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(
            currentPassword,
            storedUser.password,
        );

        if (!isCurrentPasswordCorrect) {
            throw new AppError("Current password is incorrect", 401);
        }

        hashedPassword = await bcrypt.hash(password, 12);
    }

    const updatedUser = await updateUserById(req.user.id, {
        name: name ?? null,
        email: email ?? null,
        password: hashedPassword,
    });

    if (!updatedUser) {
        throw new AppError("The user no longer exists", 404);
    }

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

const deleteMe = catchAsync(async (req, res) => {
    const deletedUser = await deleteUserById(req.user.id);

    if (!deletedUser) {
        throw new AppError("The user no longer exists", 404);
    }

    clearAuthCookie(res);

    res.status(200).json({
        status: "success",
        message: "Your account has been deleted",
    });
});

module.exports = {
    deleteMe,
    getMe,
    register,
    login,
    logout,
    updateMe,
};
