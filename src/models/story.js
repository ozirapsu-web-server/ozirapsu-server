const pool = require("../modules/pool");
const table = "STORY_TB";

exports.getStoryInfo = async (story_idx) => {
  const query = `SELECT 
                story_idx as idx, story_title as title, story_summary as summary, story_content as content, 
                story_target_amount as target_amount, story_current_amount as current_amount, ROUND(story_current_amount*100/story_target_amount, 0) as amount_rate, 
                story_createat as created_at, H.host_idx, host_name, host_profile, host_authorized 
                FROM (SELECT * FROM ${table} where story_idx=${story_idx}) as S join HOST_TB as H ON S.host_idx=H.host_idx;`;

  try {
    return await pool.queryParam(query);
  } catch (err) {
    console.log("getStoryInfo error: ", err.message);
    throw err;
  }
};
