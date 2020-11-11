var express = require('express');
var router = express.Router();
const supportController = require('../controllers/supportController');

// 응원 등록
router.post('/', supportController.postSupport);

// 응원 응원 요약 조회
router.get('/top', supportController.getSupportTop);

// 응원 조회
router.get('/', supportController.getSupport);

module.exports = router;