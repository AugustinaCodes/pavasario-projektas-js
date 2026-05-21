const express = require("express");
const { register } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema } = require("../schemas/authSchemas");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

module.exports = router;