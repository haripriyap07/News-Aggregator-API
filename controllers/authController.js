const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      if (req.accepts('html')) {
        return res.render("register", { 
          errorMessage: "Username, email and password are required",
          title: "Register"
        });
      }
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (req.accepts('html')) {
        return res.render("register", { 
          errorMessage: "Email already registered",
          title: "Register"
        });
      }
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // If HTML request, log them in and redirect to feed
    if (req.accepts('html')) {
      const secret = process.env.JWT_SECRET || 'default-secret-key-for-testing';
      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        secret,
        { expiresIn: "24h" }
      );
      
      // Set cookie with user info
      res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("user", JSON.stringify({
        id: user._id,
        email: user.email,
        username: user.username
      }), { maxAge: 24 * 60 * 60 * 1000 });
      
      return res.redirect("/feed");
    }

    // API response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.log(error);
    if (req.accepts('html')) {
      return res.render("register", { 
        errorMessage: "Server error",
        title: "Register"
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trim whitespace from email and password
    const trimmedEmail = email ? email.trim().toLowerCase() : '';
    const trimmedPassword = password ? password.trim() : '';

    if (!trimmedEmail || !trimmedPassword) {
      if (req.accepts('html')) {
        return res.render("login", { 
          errorMessage: "Email and password required",
          title: "Login"
        });
      }
      return res.status(400).json({ message: "Email and password required" });
    }

    // find user (case-insensitive search)
    console.log("Looking for user with email:", trimmedEmail);
    const user = await User.findOne({ email: trimmedEmail });
    console.log("User found:", user ? "yes" : "no");
    
    if (!user) {
      console.log("User not found in database");
      if (req.accepts('html')) {
        return res.render("login", { 
          errorMessage: "Invalid email or password",
          title: "Login"
        });
      }
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    console.log("Comparing password...");
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      if (req.accepts('html')) {
        return res.render("login", { 
          errorMessage: "Invalid email or password",
          title: "Login"
        });
      }
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const secret = process.env.JWT_SECRET || 'default-secret-key-for-testing';
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      secret,
      { expiresIn: "24h" }
    );

    // If HTML request, set cookies and redirect
    if (req.accepts('html')) {
      res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("user", JSON.stringify({
        id: user._id,
        email: user.email,
        username: user.username
      }), { maxAge: 24 * 60 * 60 * 1000 });
      
      return res.redirect("/feed");
    }

    // API response
    res.json({
      message: "Logged in successfully",
      token
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    if (req.accepts('html')) {
      return res.render("login", { 
        errorMessage: "Server error",
        title: "Login"
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
