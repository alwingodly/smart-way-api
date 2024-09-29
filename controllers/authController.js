import User from "../models/User.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import { generateToken } from "../utils/tokenUtils.js";
import { handleValidationErrors } from "../utils/validationUtils.js";
import cookie from "cookie";

export const userLogin = async (req, res) => {
  handleValidationErrors(req, res);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt failed for non-existent user: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login attempt failed for: ${email} - Incorrect password`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    logger.info(`User logged in: ${email}`);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      })
    );

    return res.json({
      success: true,
      error: false,
      message: "Login successful",
      data: {
        name: user.name,
        department: user.department,
        personalPassword: user.personalPassword,
        employeeId: user.employeeId,
        admin:false
      },
    });
  } catch (error) {
    logger.error("User login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const ADMIN_EMAIL = "smartway.admin@gmail.com"
const ADMIN_PASSWORD = "admin%9090"
export const adminLogin = async (req, res) => {
  handleValidationErrors(req, res);
  const { email, password } = req.body;
  try {
    
    if (email !== ADMIN_EMAIL) {
      logger.warn(`Login attempt failed for non-existent or non-admin user: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (password !== ADMIN_PASSWORD) {
      logger.warn(`Login attempt failed for email: ${email} - Incorrect password`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(ADMIN_EMAIL);
    logger.info(`Admin logged in: ${email}`);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      })
    );

    return res.json({
      success: true,
      error: false,
      message: "Login successful",
      data: {
        admin: true, 
      },
    });
  } catch (error) {
    logger.error("Admin login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
