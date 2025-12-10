const axios = require("axios");

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

exports.fetchTopNews = async (category) => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        category: category || "general",
        apiKey: process.env.NEWS_API_KEY,
        language: "en",
        pageSize: 20
      }
    });

    return response.data.articles;
  } catch (error) {
    console.error("NEWS FETCH ERROR:", error.message);
    return [];
  }
};
