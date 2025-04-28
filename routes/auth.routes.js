import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import generateCookieAndSetToken from "../utils/generateToken.js";
import {
  deleteOtp,
  getOtp,
  isOtpExpired,
  storeOtp,
} from "../utils/otpStore.js";

const router = express.Router();
const otpMap = new Map(); // Store OTPs temporarily

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
});

// Utility function to generate OTP
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit OTP
};

// Utility function to send OTP email
const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Account Verification",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                  <img src="path-to-your-logo.png" alt="Logo" style="width: 150px;">
              </div>
              <div style="font-size: 16px; color: #333; line-height: 1.6;">
                  <p>Dear Customer,</p>
                  <p>Thank you for choosing <strong>Goldior Luxury</strong>. To complete your verification, please use the One-Time Password (OTP) below:</p>
                  <div style="font-size: 24px; font-weight: bold; color: #2A7F72; margin: 10px 0; padding: 10px; background-color: #f2f8f3; border: 1px solid #2A7F72; border-radius: 5px; text-align: center;">
                      ${otp}
                  </div>
                  <p>This code is valid for the next 10 minutes. Please do not share it with anyone.</p>
                  <p>Warm regards,</p>
                  <p><strong>Goldior Luxury</strong></p>
              </div>
              <div style="text-align: center; font-size: 14px; color: #888; margin-top: 20px;">
                  <p>If you did not request this, please disregard this message.</p>
                  <p>Visit our website: <a href="https://your-website.com" style="color: #2A7F72; text-decoration: none;">https://your-website.com</a></p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Route to send OTP
router.post("/send-otp/:email", async (req, res) => {
  const { email } = req.params;

  // Validate email format
  if (!email || !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // ✅ Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Delete old OTP if exists
    const existingOtp = getOtp(email);
    if (existingOtp) {
      deleteOtp(email);
      console.log(`Old OTP deleted for ${email}`);
    }

    // Generate and send new OTP
    const otp = generateOtp();
    await sendOtpEmail(email, otp);
    storeOtp(email, otp);

    res.status(200).json({ message: "OTP sent successfully to your email!" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again later." });
  }
});

// Route to verify OTP
router.post("/verify-otp/:email", async (req, res) => {
  const { email } = req.params;
  const { otp: userOtp } = req.body;

  if (!userOtp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  const otpData = getOtp(email);

  if (!otpData) {
    return res.status(404).json({ message: "No OTP found for this email" });
  }

  if (isOtpExpired(email)) {
    deleteOtp(email);
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (parseInt(userOtp) !== otpData.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // ✅ Find user after OTP is verified
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    deleteOtp(email); // Remove OTP from store

    res.status(200).json({
      message: "OTP verified successfully!",
      user: {
        id: user._id,
        username: user.username,
        gender: user.gender,
        email: user.email,
        isAdmin: user.isAdmin,
        Addresses: user.Addresses,
        favourites: user.favourites,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error while verifying user" });
  }
});

// Route to create a new user
router.post("/create-user", async (req, res) => {
  const { username, email, gender, address, favourites = [] } = req.body;

  // Validate input fields
  if (
    !username ||
    !email ||
    !gender ||
    !address ||
    !address.addressLine ||
    !address.city ||
    !address.state ||
    !address.country ||
    !address.zipcode
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields or invalid address format" });
  }

  // Format the address to match MongoDB schema
  const formattedAddress = {
    addressLine: address.addressLine,
    city: address.city,
    state: address.state,
    country: address.country,
    zipcode: address.zipcode,
  };

  try {
    const newUser = new User({
      username,
      email,
      gender,
      Addresses: [formattedAddress], // Store address as an array
      favourites,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
});

// Route to get user by email
router.get("/get-user-by-email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

export default router;
