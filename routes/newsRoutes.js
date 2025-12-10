const express = require("express");
const router = express.Router();
const { getNewsFeed } = require("../controllers/newsController");

router.get("/feed", getNewsFeed);

module.exports = router;
