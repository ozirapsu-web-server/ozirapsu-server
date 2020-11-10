var express = require("express");
var router = express.Router();
const storyController = require("../controllers/storyController");

/**
 * 사연 조회
 */
router.get("/:idx", storyController.getStoryInfo);

module.exports = router;
