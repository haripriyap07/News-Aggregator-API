const { fetchTopNews } = require("../services/newsService");

exports.getNewsFeed = async (req, res) => {
  try {
    const { category } = req.query; // optional filter

    const articles = await fetchTopNews(category);

    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error("NEWS FEED ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
