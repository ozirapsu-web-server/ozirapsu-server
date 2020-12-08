var express = require('express');
var router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middlewares/auth');

// 새소식 등록
router.post('/', auth.checkToken, newsController.postNews);

module.exports = router;