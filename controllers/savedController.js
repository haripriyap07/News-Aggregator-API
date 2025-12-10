const SavedArticle = require("../models/SavedArticle");

exports.saveArticle = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      if (req.accepts('html')) {
        return res.redirect("/login");
      }
      return res.status(400).json({ message: "User ID required" });
    }

    const articleData = {
      user: userId,
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      sourceName: req.body.sourceName,
      imageUrl: req.body.imageUrl,
      publishedAt: req.body.publishedAt
    };

    const article = await SavedArticle.create(articleData);

    // If HTML form submission, redirect back to feed
    if (req.accepts('html')) {
      return res.redirect("/feed?saved=true");
    }

    res.json({
      message: "Article saved successfully",
      article
    });

  } catch (error) {
    console.error("SAVE ARTICLE ERROR:", error);
    if (req.accepts('html')) {
      return res.redirect("/feed?error=true");
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSavedArticles = async (req, res) => {
  try {
    const userId = req.query.userId;

    const articles = await SavedArticle.find({ user: userId }).sort({ savedAt: -1 });

    res.json({
      count: articles.length,
      articles
    });

  } catch (error) {
    console.error("FETCH SAVED ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSavedArticle = async (req, res) => {
  try {
    const id = req.params.id;

    await SavedArticle.findByIdAndDelete(id);

    // If HTML form submission, redirect back to saved page
    if (req.accepts('html')) {
      return res.redirect("/saved");
    }

    res.json({ message: "Article removed from saved list" });

  } catch (error) {
    console.error("DELETE SAVED ERROR:", error);
    if (req.accepts('html')) {
      return res.redirect("/saved");
    }
    res.status(500).json({ message: "Server error" });
  }
};
