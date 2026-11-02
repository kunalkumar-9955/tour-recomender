const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();
const resetTokens = new Map();
const memoryUsers = new Map();

function getMemoryUserByEmail(email) {
  for (const user of memoryUsers.values()) {
    if (user.email === email) return user;
  }
  return null;
}

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      country,
      travelInterest,
      budgetPreference,
    } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: "Email already registered." });
      const hash = await bcrypt.hash(password, 10);
      const budgetNum = budgetPreference != null ? Number(budgetPreference) : undefined;
      const user = await User.create({
        name,
        email,
        password: hash,
        mobile,
        country,
        travelInterest,
        preferences: {
          ...(budgetNum && !Number.isNaN(budgetNum) ? { budget: budgetNum } : {}),
          tripType: travelInterest || undefined,
          location: country || undefined,
        },
      });
      return res.status(201).json({ id: user._id, email: user.email });
    } catch {
      if (getMemoryUserByEmail(email)) {
        return res.status(409).json({ message: "Email already registered." });
      }
      const hash = await bcrypt.hash(password, 10);
      const id = `mem_${Date.now()}`;
      memoryUsers.set(id, { id, name, email, password: hash, mobile, country, travelInterest });
      return res.status(201).json({ id, email });
    }
  } catch (e) {
    res.status(500).json({ message: "Signup failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch {
      const user = getMemoryUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }
  } catch (e) {
    res.status(500).json({ message: "Login failed." });
  }
});

router.post("/forgot-password", async (req, res) => {
  const email = req.body.email;
  let userId = null;
  try {
    const user = await User.findOne({ email });
    userId = user?._id?.toString() || null;
  } catch {
    userId = getMemoryUserByEmail(email)?.id || null;
  }
  if (!userId) return res.json({ message: "If that email exists, reset instructions were sent." });
  const token = crypto.randomBytes(24).toString("hex");
  resetTokens.set(token, userId);
  return res.json({
    message: "Reset link generated. Use the token below in development.",
    resetToken: token,
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password required." });
  }
  const userId = resetTokens.get(token);
  if (!userId) return res.status(400).json({ message: "Invalid or expired reset token." });
  const hash = await bcrypt.hash(password, 10);
  try {
    await User.findByIdAndUpdate(userId, { password: hash });
  } catch {
    const user = memoryUsers.get(userId);
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token." });
    memoryUsers.set(userId, { ...user, password: hash });
  }
  resetTokens.delete(token);
  res.json({ message: "Password reset successful" });
});

module.exports = router;
