var express = require('express');
var router = express.Router();
const storyController = require('../controllers/storyController');
const upload = require('../modules/multer');

/**
 * 사연 조회
 */
router.get('/info/:idx', storyController.getStoryInfo);

/**
 * 사연 이미지 조회
 */
router.get('/info/:idx/image', storyController.getStoryImages);

/**
 * 사연 등록
 */
router.post('/', upload.array('images', 10), storyController.postStory);

/**
 * 최근 사연 조회
 */
router.get('/recent', storyController.getRecentStory);

module.exports = router;
