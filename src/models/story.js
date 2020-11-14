const pool = require('../modules/pool');
const story_tb = 'STORY_TB';
const img_tb = 'STORY_IMAGE_TB';
const tag_tb = 'STORY_TAG_TB';

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

/**
 * 사연 등록
 */
exports.postStory = async (
  title,
  contents,
  targetAmount,
  createdAt,
  hostIdx,
  tagList,
  imgFiles
) => {
  // summary 넣는지 확인하기
  const storyColumns =
    'story_title, story_summary, story_target_amount, story_content, story_createat, host_idx';
  const insertStoryQuery = `INSERT INTO ${story_tb}(${storyColumns}) 
                  VALUES("${title}", "===summary===", ${targetAmount}, "${contents}", "${createdAt}", ${hostIdx});`;
  const insertTagQuery = `INSERT INTO ${tag_tb}(tag_content, story_idx) VALUES (?, ?)`;

  const insertImgQuery = `INSERT INTO ${img_tb}(image_path, image_original_name, story_idx) VALUES (?, ?, ?)`;

  return await pool
    .Transaction(async (conn) => {
      // 1. STORY_TB에 사연 정보 삽입
      let insertStoryResult = await conn.query(insertStoryQuery);

      // 2. STORY_TAG_TB에 태그 삽입
      tagList.forEach(async (tag) => {
        await conn.query(insertTagQuery, [tag, insertStoryResult.insertId]);
      });

      // 3. STORY_IMAGE_TB에 이미지 삽입
      imgFiles.forEach(async (img) => {
        const type = img.mimetype.split('/')[1];
        if (type === 'jpeg' || type === 'jpg' || type === 'png') {
          await conn.query(insertImgQuery, [
            img.location,
            img.originalname,
            insertStoryResult.insertId,
          ]);
        }
      });
    })
    .catch((err) => {
      console.log('postStory error: ', err.message);
      throw err;
    });
};
