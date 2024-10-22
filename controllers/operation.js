const { User } = require("../models/userModels");
const randomize = require("randomatic");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

async function sendOtpEmail(email, password, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

const postData = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are mandatory" });
    return;
  }
  try {
    const findUsers = User.find({ email, password });
    if (!findUsers) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const generatedOtp = randomize("0", 6);
    sendOtpEmail(email, password, generatedOtp);
    return res
      .status(200)
      .json({ success: "OTP Successfully Sent to your email" });
  } catch (err) {
    res.status(404).json({ message: "Users Not found" });
  }
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and password are mandatory" });
  }

  try {
    const user = await User.create(req.body);
    return res
      .status(200)
      .json({ credential: user, message: "Credentials created successfully" });
  } catch (err) {
    return res.status(400).json({ error: 1, message: err.message });
  }
};

const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;
  try {
    const user = await User.findOne({ otp });
    if (!user) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    user.otp = "";
    await user.save();
    return res.json({ success: true });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification",
    });
  }
};

module.exports = { postData, signup, verifyOTP };
