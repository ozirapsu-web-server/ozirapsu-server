var express = require('express');
var router = express.Router();
const newsController = require('../controllers/newsController');

// 새소식 등록
router.post('/', newsController.postNews);

module.exports = router;