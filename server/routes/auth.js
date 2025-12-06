import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, age });
    await newUser.save();

    // 🔥 Create JWT token during signup (just like login)
    const token = jwt.sign(
      { id: newUser._id },
      process.env.WhatIsYourName,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,                // ✅ Added token
      name: newUser.name,
      email: newUser.email,
      age: newUser.age,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.WhatIsYourName, { expiresIn: "1d" });

    res.status(200).json({
      token,
      name: user.name,
      email: user.email,
      age: user.age,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
