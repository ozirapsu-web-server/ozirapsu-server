const pool = require('../modules/pool');
const table = 'HOST_TB';

// 회원 정보 저장
exports.saveUserInfo = async (
  email,
  name,
  phoneNumber,
  hashed,
  salt,
  authorized,
  login_type
) => {
  const columns =
    'host_email, host_name, host_phone_number, host_password, host_salt, host_authorized, host_login_type';
  const query = `INSERT INTO ${table}(${columns}) VALUES('${email}', '${name}', '${phoneNumber}', '${hashed}', '${salt}', ${authorized}, ${login_type})`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('saveUserInfo error: ', err.message);
    throw err;
  }
};

// 이메일 중복 확인
exports.checkEmail = async (email) => {
  const query = `SELECT host_idx, host_password, host_salt FROM ${table} WHERE host_email='${email}'`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('checkEmail error: ', err.message);
    throw err;
  }
};

// 리프레시 토큰 저장
exports.putRefreshToken = async (idx, refreshToken) => {
  const query = `UPDATE ${table} SET host_refresh_token = '${refreshToken}' where host_idx=${idx};`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('putRefreshToken error: ', err.message);
    throw err;
  }
};

// idx로 호스트 정보 조회
exports.getUserInfo = async (idx) => {
  const columns =
    'host_idx, host_email, host_name, host_profile, host_phone_number, host_authorized, host_ios_token, host_login_type, host_refresh_token';
  const query = `SELECT ${columns} FROM ${table} WHERE host_idx=${idx};`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('saveUserInfo error: ', err.message);
    throw err;
  }
};
