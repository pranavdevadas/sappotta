import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { upload } from "../middleware/uploadMiddleware.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

export const authController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // Validate
      if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all fields");
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400);
        throw new Error("User already exists with this email");
      }

      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        res.status(400);
        throw new Error("Username already exists, try with another username");
      }

      if (!req.file) {
        res.status(400);
        throw new Error("Please add a profile picture");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const profilePhoto = `/uploads/${req.file.filename}`;

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        profilePhoto,
      });

      res.status(201).json({
        message: "User registered successfully",
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePhoto: newUser.profilePhoto,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validate
      if (!email || !password) {
        res.status(400);
        throw new Error("Please provide both email and password");
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400);
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400);
        throw new Error("Invalid email or password");
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePhoto: user.profilePhoto,
        },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const oldRefreshToken = req.cookies.refreshToken;

      if (!oldRefreshToken) {
        res.status(400);
        throw new Error("Refresh token is required");
      }

      jwt.verify(oldRefreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(403);
          throw new Error("Invalid or expired refresh token");
        }

        const userId = decoded.id;

        const newAccessToken = jwt.sign(
          { id: userId },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_ACCESS_EXPIRY }
        );

        res.status(200).json({
          message: "Token refreshed successfully",
          accessToken: newAccessToken,
        });
      });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      next(error);
    }
  },
};
