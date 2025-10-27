// 📄 controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/Models.js"; // Assuming User model is correctly imported

// Register new user (admin only for now, but can be adjusted for self-signup)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all required fields: name, email, and password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User with this email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role to 'receptionist' if not provided or invalid for self-registration
    // For admin-only registration, you might remove the default and require 'role'
    const userRole = ['admin', 'doctor', 'receptionist'].includes(role) ? role : 'receptionist';

    const newUser = new User({ name, email, password: hashedPassword, role: userRole });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Register User Error:", error.message);
    res.status(500).json({ message: "User registration failed.", error: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; 

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials: User not found." });

    // --- CRITICAL FIX: AWAIT bcrypt.compare ---
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials: Incorrect password." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Determine redirect URL based on user role
    // IMPORTANT: These URLs must EXACTLY match the paths defined in your frontend's React Router setup (App.js)
    let redirectUrl = '/'; // Default fallback

    switch (user.role) {
      case 'admin':
        redirectUrl = '/'; // Example: Admin dashboard path
        break;
      case 'doctor':
        redirectUrl = '/doctor'; // Example: Doctor dashboard path
        break;
      case 'receptionist':
        redirectUrl = '/receptionist'; // Example: Receptionist dashboard path
        break;
      default:
        redirectUrl = '/'; // Fallback to home or generic dashboard if role is unknown
    }

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }, // Include email for frontend
      redirectUrl: redirectUrl // Send the redirect URL to the frontend
    });
  } catch (error) {
    console.error("Login User Error:", error.message); // Log full error for debugging
    res.status(500).json({ message: "Login failed.", error: error.message }); // Send error details
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    // For stateless JWTs, server-side logout is minimal.
    // This endpoint primarily serves as a signal to the client to clear its token.
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout User Error:", error.message);
    res.status(500).json({ message: "Logout failed.", error: error.message });
  }
};


export const getMe = async (req, res) => {
  try {
    // req.user is set by the verifyToken middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized, no user ID in token." });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Me Error:", error.message);
    res.status(500).json({ message: "Failed to fetch user data.", error: error.message });
  }
};


export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password"); // remove password from response
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Get All Doctors Error:", err.message);
    res.status(500).json({ message: "Failed to fetch doctors.", error: err.message });
  }
};