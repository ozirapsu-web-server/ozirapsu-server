var express = require('express');
var router = express.Router();
const storyController = require('../controllers/storyController');

/**
 * 사연 조회
 */
router.get('/:idx', storyController.getStoryInfo);

/**
 * 사연 이미지 조회
 */
router.get('/:idx/image', storyController.getStoryImages);

module.exports = router;
