const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { articleUrl, text } = req.body;

    if (!userId || !articleUrl || !text) {
      if (req.accepts('html')) {
        return res.redirect("/login");
      }
      return res.status(400).json({ message: "userId, articleUrl, and text are required" });
    }

    const comment = await Comment.create({
      user: userId,
      articleUrl,
      text
    });

    // If HTML form submission, redirect back to feed
    if (req.accepts('html')) {
      return res.redirect("/feed");
    }

    res.status(201).json({
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    if (req.accepts('html')) {
      return res.redirect("/feed");
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { articleUrl } = req.query;

    if (!articleUrl) {
      return res.status(400).json({ message: "articleUrl is required" });
    }

    const comments = await Comment.find({ articleUrl })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json({
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
