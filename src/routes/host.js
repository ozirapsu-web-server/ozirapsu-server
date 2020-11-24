var express = require('express');
var router = express.Router();
const hostController = require('../controllers/hostController');

// 회원 가입
router.post('/signup', hostController.signUp);

module.exports = router;
