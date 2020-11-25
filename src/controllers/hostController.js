const encrypt = require('../modules/cryto');
const hostModel = require('../models/host');
const jwt = require('../modules/jwt');
const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

/**
 * 회원 가입
 */
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

  try {
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
  } catch (err) {
    console.log(err);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
  }
};

/**
 * 로그인
 */
exports.singIn = async (req, res) => {
  const { email, pw } = req.body;

  try {
    // 해당하는 이메일이 없는 경우
    const result = await hostModel.checkEmail(email);
    if (!result[0]) {
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
      return;
    }

    const salt = result[0].host_salt;
    const hashed = await encrypt.encryptWithSalt(pw, salt);

    if (result[0].host_password === hashed) {
      const { accessToken, refreshToken } = await jwt.sign(result[0]);
      return res
        .status(statusCode.OK)
        .set({ token: accessToken, refreshToken: refreshToken })
        .send(util.success(statusCode.OK, responseMessage.POST_SIGNIN_SUCCESS));
    }
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));
  } catch (err) {
    console.error(err);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
  }
};
