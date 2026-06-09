const express = require("express");
const {
	deleteMe,
	getMe,
	login,
	logout,
	register,
	updateMe,
} = require("../controllers/authController");
const validate = require("../middleware/validate");
const {
	loginSchema,
	registerSchema,
	updateProfileSchema,
} = require("../schemas/authSchemas");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/me", protect, validate(updateProfileSchema), updateMe);
router.delete("/me", protect, deleteMe);

module.exports = router;