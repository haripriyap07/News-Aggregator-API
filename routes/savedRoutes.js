const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  saveArticle,
  getSavedArticles,
  deleteSavedArticle
} = require("../controllers/savedController");

router.post("/save", auth, saveArticle);
router.get("/list", auth, getSavedArticles);
router.delete("/:id", auth, deleteSavedArticle);
router.post("/:id", auth, deleteSavedArticle);

module.exports = router;
