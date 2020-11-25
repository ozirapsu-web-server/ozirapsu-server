var express = require('express');
var router = express.Router();
const hostController = require('../controllers/hostController');

// 회원 가입
router.post('/signup', hostController.signUp);

// 로그인
router.post('/signin', hostController.singIn);

module.exports = router;
