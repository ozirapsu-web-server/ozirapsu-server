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

exports.getNews = async(req) => {
    const query = ` SELECT host_idx, host_profile, host_name, news_createdat, news_content 
                    FROM ${table} 
                    JOIN STORY_TB USING(story_idx) 
                    JOIN HOST_TB USING(host_idx) 
                    WHERE story_idx = ${req.query.story_idx} 
                    ORDER BY news_createdat DESC;`;
    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        console.log('getNews error: ', err.message);
        throw err;
    }
}