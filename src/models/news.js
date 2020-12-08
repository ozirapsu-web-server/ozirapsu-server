const pool = require('../modules/pool');
const table = 'NEWS_TB';

exports.postNews = async(req, news_createdat) => {
    const query = `INSERT INTO ${table}
                    (story_idx, news_createdat , news_content) 
                    VALUES(${req.query.story_idx}, "${news_createdat}", "${req.body.news_content}");`;

    try {
        const result = await pool.queryParam(query);
        return result.insertId;
    } catch (err) {
        console.log('postNews error: ', err.message);
        throw err;
    }
}