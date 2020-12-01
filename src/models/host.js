const pool = require('../modules/pool');
const table = 'HOST_TB';
const story_tb = 'STORY_TB';
const img_tb = 'STORY_IMAGE_TB';
const support_tb = 'SUPPORT_TB';

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

/**
 * 본인 프로필 조회
 */
exports.getProfile = async (idx) => {
  const query = `SELECT host_name AS name, host_email AS email, host_profile AS image, host_authorized AS authorized, host_introduction AS introduction
                FROM ${table} WHERE host_idx=${idx};`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('getProfile error: ', err.message);
    throw err;
  }
};

/**
 * 프로필 수정
 */
exports.editProfile = async (idx, name, image, introduction) => {
  const query = `UPDATE ${table} SET host_name='${name}', host_profile='${image}', host_introduction='${introduction}' WHERE host_idx=${idx};`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('editProfile error: ', err.message);
    throw err;
  }
};

/**
 * 호스트별 사연 조회
 */
exports.getStoryListByHost = async (idx) => {
  const query = `SELECT idx, title, I.image_path as image, amount_rate, support_cnt
                FROM (
                  SELECT ST.story_idx as idx, story_title AS title, ROUND(story_current_amount*100/story_target_amount, 0) AS amount_rate, story_createdat, host_idx, count(support_idx) as support_cnt 
                  FROM ${story_tb} as ST LEFT OUTER JOIN ${support_tb} AS SP ON ST.story_idx=SP.story_idx 
                  GROUP BY ST.story_idx
                  ) AS S JOIN ${img_tb} as I ON S.idx=I.story_idx
                WHERE host_idx=${idx}
                GROUP BY idx
                ORDER BY story_createdat DESC;`;
  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('getStoryListByHost error: ', err.message);
    throw err;
  }
};
