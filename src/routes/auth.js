const express = require('express');
const router = express.Router();
const authController = require('../../controller/authController');

// 토큰 재발행
router.get('/reissue', authController.reIssue);

module.exports = router;
