import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { detectRoleFromEmail } from "../utils/detectRoleFromEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const role = detectRoleFromEmail(email);
    if (!role) {
      return res.status(400).json({ message: "Invalid email domain" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    const user = {
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
    };

    const newUser = await User.create(user);

    //send OTP
    await sendEmail(
      email,
      "Verify your email",
      `Your OTP for email verification is: ${otp}. It is valid for 10 minutes from now.`
    );

    res.status(201).json({
      message: "OTP sent to your KUET email",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User isn't registered" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
