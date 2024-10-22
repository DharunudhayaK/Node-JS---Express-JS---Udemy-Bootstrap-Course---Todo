const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: function (value) {
        return emailRegex.test(value);
      },
      message: "Please enter a valid email address",
    },
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"], // Minimum length for password
    validate: {
      validator: function (value) {
        return /[a-zA-Z]/.test(value) && /\d/.test(value);
      },
      message: "Password must contain at least one letter and one number",
    },
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
