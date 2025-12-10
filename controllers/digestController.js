const User = require("../models/user");
const { fetchNews } = require("../services/newsService");

exports.getDailyDigest = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.interests.length === 0) {
      return res.json({ message: "No interests found for user" });
    }

    let digest = [];

    for (let topic of user.interests) {
      const articles = await fetchNews(topic);
      digest.push(...articles.slice(0, 3)); // top 3 per interest
    }

    digest.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({
      message: "Daily digest",
      count: digest.length,
      articles: digest
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
