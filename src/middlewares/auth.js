const jwt = require('../modules/jwt');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

exports.checkToken = async (req, res, next) => {
  let token = req.headers.jwt;

  // 토큰이 없는 경우
  if (!token) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
  }

  const user = await jwt.verify(token);
  // 토큰 만료
  if (user === TOKEN_EXPIRED) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN));
  }
  // 유효하지 않은 토큰
  if (user === TOKEN_INVALID) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN));
  }
  if (user.idx === undefined) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN));
  }
  req.decoded = user;
  next();
};
