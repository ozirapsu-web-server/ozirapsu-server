const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const jwt = require('../modules/jwt');
const authModel = require('../models/auth');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

// 토큰 재발행
exports.reIssue = async (req, res) => {
  try {
    const refreshToken = req.headers.refreshtoken;

    if (!refreshToken) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
    }

    // DB에 저장된 refreshToken과 요청의 헤더의 refreshToken이 같은지 확인
    const hostIdx = await jwt.getIdx(refreshToken);
    const hostRefreshToken = await authModel.getRefreshToken(hostIdx);
    if (refreshToken !== hostRefreshToken[0].host_refresh_token) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN)
        );
    }

    // refreshToken 만료 기간이 7일 이하로 남은 경우 => accessToken과 refreshToken 모두 갱신
    const canRefresh = await jwt.checkExpiration(refreshToken);
    if (canRefresh) {
      const { accessToken, refreshToken } = await jwt.sign({
        host_idx: hostIdx,
      });
      await authModel.putRefreshToken(hostIdx, refreshToken);
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.ISSUE_SUCCESS, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      );
    }

    const newToken = await jwt.refresh(hostIdx, refreshToken);
    if (newToken == TOKEN_EXPIRED) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN)
        );
    }
    if (newToken == TOKEN_INVALID) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN)
        );
    }
    res.status(statusCode.OK).send(
      util.success(statusCode.OK, responseMessage.ISSUE_SUCCESS, {
        accessToken: newToken,
        refreshToken: refreshToken,
      })
    );
  } catch (err) {
    console.log(err);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  }
};
