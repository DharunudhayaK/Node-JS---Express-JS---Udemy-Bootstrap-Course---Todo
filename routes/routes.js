const express = require("express");
const { postData, signup, verifyOTP } = require("../controllers/operation");
const router = express.Router();

router.route("/login").post(postData);
router.route("/signup").post(signup);
router.route("/verify-otp").post(verifyOTP);

module.exports = { router };
