const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addComment,
  getComments,
  deleteComment
} = require("../controllers/commentsController");

router.post("/", auth, addComment);
router.get("/", getComments);
router.delete("/:id", auth, deleteComment);

module.exports = router;

