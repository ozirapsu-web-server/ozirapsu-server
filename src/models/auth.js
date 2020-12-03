const pool = require('../modules/pool');
const table = 'HOST_TB';

/**
 * reIssue : refreshToken 조회
 */
exports.getRefreshToken = async (idx) => {
  const query = `SELECT host_refresh_token FROM ${table} where host_idx=${idx}`;

  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('getRefreshToken error: ', err.message);
    throw err;
  }
};

/**
 * 리프레시 토큰 저장
 */
exports.putRefreshToken = async (idx, refreshToken) => {
  const query = `UPDATE ${table} SET host_refresh_token='${refreshToken}' where host_idx=${idx};`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('putRefreshToken error: ', err.message);
    throw err;
  }
};
