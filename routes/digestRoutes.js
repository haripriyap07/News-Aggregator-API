const express = require("express");
const auth = require("../middleware/auth");
const { getDailyDigest } = require("../controllers/digestController");

const router = express.Router();

router.get("/daily", auth, getDailyDigest);

module.exports = router;
