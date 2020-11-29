var express = require('express');
var router = express.Router();
const hostController = require('../controllers/hostController');
const auth = require('../middlewares/auth');
const upload = require('../modules/multer');

// 회원 가입
router.post('/signup', hostController.signUp);

// 로그인
router.post('/signin', hostController.singIn);

// 프로필 수정
router.patch(
  '/profile',
  auth.checkToken,
  upload.single('image'),
  hostController.editProfile
);

module.exports = router;
