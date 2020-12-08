var express = require('express');
var router = express.Router();
const newsController = require('../controllers/newsController');

// 새소식 등록
router.post('/', newsController.postNews);

// 새소식 조회
router.get('/', newsController.getNews);

module.exports = router;