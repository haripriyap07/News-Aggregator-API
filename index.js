require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const auth = require("./middleware/auth");

const app = express();
connectDB();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/news", require("./routes/newsRoutes"));
app.use("/preferences", require("./routes/preferencesRoutes"));
app.use("/saved", require("./routes/savedRoutes"));
app.use("/comments", require("./routes/commentsRoutes"));
app.use("/digest", require("./routes/digestRoutes"));

// Frontend Routes
app.get("/", (req, res) => {
  try {
    const user = req.cookies && req.cookies.user ? JSON.parse(req.cookies.user) : null;
    res.render("index", { 
      user, 
      title: "Home",
      successMessage: null,
      errorMessage: null
    });
  } catch (error) {
    console.error("Error rendering home:", error);
    res.status(500).send("Error loading page: " + error.message);
  }
});

app.get("/register", (req, res) => {
  res.render("register", { 
    title: "Register",
    successMessage: null,
    errorMessage: null
  });
});

app.get("/login", (req, res) => {
  res.render("login", { 
    title: "Login",
    successMessage: null,
    errorMessage: null
  });
});

app.get("/feed", auth, async (req, res) => {
  try {
    const newsService = require("./services/newsService");
    const category = req.query.category || "general";
    const articles = await newsService.fetchTopNews(category);
    res.render("feed", { 
      user: req.user, 
      articles: articles || [], 
      category,
      title: "News Feed" 
    });
  } catch (error) {
    res.render("feed", { 
      user: req.user, 
      articles: [], 
      category: req.query.category || "general",
      errorMessage: "Failed to load articles: " + error.message,
      title: "News Feed" 
    });
  }
});

app.get("/saved", auth, async (req, res) => {
  try {
    const SavedArticle = require("./models/SavedArticle");
    const savedArticles = await SavedArticle.find({ user: req.user.id });
    res.render("saved", { 
      user: req.user, 
      savedArticles,
      title: "Saved Articles" 
    });
  } catch (error) {
    res.render("saved", { 
      user: req.user, 
      savedArticles: [],
      errorMessage: "Failed to load saved articles",
      title: "Saved Articles" 
    });
  }
});

app.get("/preferences", auth, async (req, res) => {
  try {
    const User = require("./models/user");
    const user = await User.findById(req.user.id);
    const preferences = user.preferences || {};
    res.render("preferences", { 
      user: req.user, 
      preferences,
      title: "Preferences" 
    });
  } catch (error) {
    res.render("preferences", { 
      user: req.user, 
      preferences: {},
      errorMessage: "Failed to load preferences",
      title: "Preferences" 
    });
  }
});

app.get("/digest", auth, async (req, res) => {
  try {
    const newsService = require("./services/newsService");
    const User = require("./models/user");
    const user = await User.findById(req.user.id);
    
    const interests = user.preferences?.interests || ["technology", "science"];
    const articles = {};
    
    for (const interest of interests) {
      const newsData = await newsService.fetchTopNews(interest);
      articles[interest] = newsData || [];
    }
    
    res.render("digest", { 
      user: req.user, 
      articles,
      title: "Daily Digest" 
    });
  } catch (error) {
    res.render("digest", { 
      user: req.user, 
      articles: {},
      errorMessage: "Failed to generate digest: " + error.message,
      title: "Daily Digest" 
    });
  }
});

app.get("/dashboard", auth, async (req, res) => {
  try {
    const User = require("./models/user");
    const SavedArticle = require("./models/SavedArticle");
    const Comment = require("./models/Comment");
    
    const user = await User.findById(req.user.id);
    const savedCount = await SavedArticle.countDocuments({ user: req.user.id });
    const commentCount = await Comment.countDocuments({ user: req.user.id });
    const preferences = user.preferences || {};
    
    const stats = {
      savedArticles: savedCount,
      comments: commentCount,
      interests: preferences.interests ? preferences.interests.length : 0
    };
    
    res.render("dashboard", { 
      user: req.user, 
      stats,
      preferences,
      title: "Dashboard" 
    });
  } catch (error) {
    res.render("dashboard", { 
      user: req.user, 
      stats: { savedArticles: 0, comments: 0, interests: 0 },
      preferences: {},
      errorMessage: "Failed to load dashboard",
      title: "Dashboard" 
    });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
