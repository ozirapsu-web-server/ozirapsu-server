const pool = require('../modules/pool');
const story_tb = 'STORY_TB';
const img_tb = 'STORY_IMAGE_TB';

/**
 * 사연 정보 조회
 */
exports.getStoryInfo = async (story_idx) => {
  const query = `SELECT 
                story_idx as idx, story_title as title, story_summary as summary, story_content as content, 
                story_target_amount as target_amount, story_current_amount as current_amount, ROUND(story_current_amount*100/story_target_amount, 0) as amount_rate, 
                story_createat as created_at, H.host_idx, host_name, host_profile, host_authorized 
                FROM (SELECT * FROM ${story_tb} where story_idx=${story_idx}) as S join HOST_TB as H ON S.host_idx=H.host_idx;`;

  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('getStoryInfo error: ', err.message);
    throw err;
  }
};

/**
 * 사연 이미지 조회
 */
exports.getStoryImages = async (story_idx) => {
  const query = `SELECT image_path FROM ${img_tb} where story_idx=${story_idx};`;

  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log('getStoryImages error: ', err.message);
    throw err;
  }
};
