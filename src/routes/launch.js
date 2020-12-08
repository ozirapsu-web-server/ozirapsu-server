var express = require('express');
var router = express.Router();
const launchController = require('../controllers/launchController');

// 로그인 배경 비디오 가져오기
router.get('/', launchController.getLaunchVideo);

module.exports = router;