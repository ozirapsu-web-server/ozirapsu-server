const jwt = require('jsonwebtoken');
const { secretKey, options, refreshOptions } = require('../config/secretKey');
const hostModel = require('../models/host');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

exports.sign = async (user) => {
  const payload = {
    idx: user.host_idx,
  };
  const result = {
    accessToken: jwt.sign(payload, secretKey, options),
    refreshToken: jwt.sign(payload, secretKey, refreshOptions),
  };
  return result;
};

exports.verify = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, secretKey);
  } catch (err) {
    if (err.message === 'jwt expired') {
      console.log('expired token');
      return TOKEN_EXPIRED;
    } else if (err.message === 'invalid token') {
      console.log('invalid token');
      return TOKEN_INVALID;
    } else {
      console.log('invalid token');
      return TOKEN_INVALID;
    }
  }
  return decoded;
};

exports.refresh = async (idx, refreshToken) => {
  try {
    const result = await jwt.verify(refreshToken, secretKey);
    if (result.idx === undefined) {
      return TOKEN_INVALID;
    }

    const payload = {
      idx: idx,
    };
    return jwt.sign(payload, secretKey, options);
  } catch (err) {
    if (err.message === 'jwt expired') {
      console.log('expired token');
      return TOKEN_EXPIRED;
    } else if (err.message === 'invalid token') {
      console.log('invalid token');
      console.log(TOKEN_INVALID);
      return TOKEN_INVALID;
    } else {
      console.log('invalid token');
      return TOKEN_INVALID;
    }
  }
};

exports.getIdx = async (refreshToken) => {
  try {
    const decoded = jwt.decode(refreshToken, { complete: true });
    const payload = decoded.payload;
    return payload.idx;
  } catch (err) {
    console.log(err.message);
  }
};

exports.checkExpiration = async (refreshToken) => {
  const decoded = jwt.decode(refreshToken, { complete: true });
  const payload = decoded.payload;

  const sevenDays = 60 * 60 * 24 * 7;
  const today = Math.floor(Date.now() / 1000);
  if (payload.exp - today <= sevenDays) {
    // 만료기간이 7일 이하로 남은 경우
    return true;
  } else {
    // 만료기간이 7일 넘게 남은 경우
    return false;
  }
};
