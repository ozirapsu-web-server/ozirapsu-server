const encrypt = require('../modules/cryto');
const hostModel = require('../models/host');
const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

exports.signUp = async (req, res) => {
  let { email, pw, name, phoneNumber, isAuthorized } = req.body;

  // 파라미터 확인
  if (!email || !pw || !name || !phoneNumber) {
    res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.PARAMETER_ERROR));
    return;
  }

  email = email.replace(/ /g, ''); // 이메일 전체 공백 제거
  name = name.trim(); // 닉네임 앞과 뒤 공백 제거

  // 이메일이 이미 존재하는 경우
  const result = await hostModel.checkEmail(email);
  if (result[0]) {
    return res
      .status(statusCode.FORBIDDEN)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_EMAIL));
  }

  // 회원 정보 저장
  const { salt, hashed } = await encrypt.encrypt(pw);
  await hostModel.saveUserInfo(
    email,
    name,
    phoneNumber,
    hashed,
    salt,
    isAuthorized,
    0
  ); // 자체 회원가입 => 로그인 타입:0
  return res
    .status(statusCode.CREATED)
    .send(
      util.success(statusCode.CREATED, responseMessage.POST_SIGNUP_SUCCESS)
    );
};
