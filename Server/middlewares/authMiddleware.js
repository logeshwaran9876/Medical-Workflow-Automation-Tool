// 📄 middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/Models.js"; // Ensure this path and model name are correct

// Token Verification Middleware
export const verifyToken = async (req, res, next) => {
  try {
    console.log("🔐 [verifyToken] Incoming request...");

    if (!process.env.JWT_SECRET) {
      console.error("❌ [verifyToken] JWT_SECRET is missing.");
      return res.status(500).json({ message: "Server config error: JWT_SECRET not set." });
    }

    const authHeader = req.headers.authorization;
    console.log("📩 [verifyToken] Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("🚫 [verifyToken] Missing or invalid Authorization header.");
      return res.status(401).json({ message: "Access denied. Missing or malformed token." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn("🚫 [verifyToken] Token not found.");
      return res.status(401).json({ message: "Access denied. Token not provided." });
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err);
        else resolve(decodedToken);
      });
    });

    console.log("✅ [verifyToken] Token verified:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn("🚫 [verifyToken] User not found in DB:", decoded.id);
      return res.status(404).json({ message: "Access denied. User not found." });
    }

    req.user = user; // attach full user
    console.log("👤 [verifyToken] User attached:", {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access denied. Token expired." });
    }
    console.error("💥 [verifyToken] Internal error:", err.message);
    res.status(403).json({ message: "Access denied. Invalid or corrupted token." });
  }
};

// Role-Based Authorization Middleware
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("🛂 [authorizeRoles] Checking roles:", allowedRoles);

    if (!req.user || !req.user.role) {
      console.warn("🚫 [authorizeRoles] User role missing from request.");
      return res.status(403).json({ message: "Access denied. User role not found." });
    }

    console.log(`🔍 [authorizeRoles] User role: '${req.user.role}'`);

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`❌ [authorizeRoles] Role '${req.user.role}' is not allowed.`);
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized.`,
      });
    }

    console.log("✅ [authorizeRoles] Access granted.");
    next();
  };
};