const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      minLength: 8,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    dateOfBirth: {
      type: Date,
    },

  },
  { timestamps: true },
);

userSchema.statics.generatePasswordHash = async function (password) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (err) {
    throw err;
  }
};
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.passwordHash);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
