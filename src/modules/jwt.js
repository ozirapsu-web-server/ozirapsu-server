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

exports.refresh = async (refreshToken) => {
  try {
    const result = await jwt.verify(refreshToken, secretKey);
    if (result.idx === undefined) {
      return TOKEN_INVALID;
    }
    const user = await hostModel.getUserInfo(result.idx);
    if (refreshToken !== user.refreshToken) {
      console.log('invalid refresh token');
      return TOKEN_INVALID;
    }
    const payload = {
      idx: user.host_idx,
    };
    const dto = {
      token: jwt.sign(payload, secretKey, options),
    };
    return dto;
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