const mongoose = require("mongoose");

const savedArticleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: String,
  description: String,
  url: String,
  sourceName: String,
  imageUrl: String,
  publishedAt: String,

  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SavedArticle", savedArticleSchema);
