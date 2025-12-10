const express = require("express");
const router = express.Router();

// Get user preferences
router.get("/", (req, res) => {
  res.json({ message: "Get user preferences" });
});

// Save/Update user preferences
router.post("/save", (req, res) => {
  try {
    const { userId, interests, preferredSources, keywordFilters } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // TODO: Save preferences to database
    res.json({
      message: "Preferences saved successfully",
      preferences: {
        userId,
        interests: interests || [],
        preferredSources: preferredSources || [],
        keywordFilters: keywordFilters || {}
      }
    });
  } catch (error) {
    console.error("PREFERENCES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

