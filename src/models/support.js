const pool = require('../modules/pool');
const table = 'SUPPORT_TB';

exports.postSupport = async(req, support_createdat) => {
    const query = `INSERT INTO ${table}
                    (support_nickname, support_amount , support_comment, support_phone_number, support_createdat, story_idx) 
                    VALUES("${req.body.support_nickname}", ${req.body.support_amount}, "${req.body.support_comment}", "${req.body.support_phone_number}", "${support_createdat}", ${req.query.story_idx});`;

    try {
        const result = await pool.queryParam(query);
        return result.insertId;
    } catch (err) {
        console.log('postSupport error: ', err.message);
        throw err;
    }
}

exports.getSupportTop = async(req) => {
    const query = `SELECT support_nickname, support_amount, support_comment 
                    FROM ${table} WHERE story_idx = ${req.query.story_idx} 
                    ORDER BY support_createdat DESC 
                    LIMIT 3;`;

    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        console.log('getSupportTop error: ', err.message);
        throw err;
    }
}

exports.getSupportCount = async(req) => {
    const query = `SELECT count(*) AS count 
                    FROM ${table} 
                    WHERE story_idx = ${req.query.story_idx};`;

    try {
        const result = await pool.queryParam(query);
        return result[0].count;
    } catch (err) {
        console.log('getSupportCount error: ', err.message);
        throw err;
    }
}

exports.getSupportByRecent = async(req) => {
    const query = `SELECT support_nickname, support_amount, support_comment 
                    FROM ${table} 
                    WHERE story_idx = ${req.query.story_idx} 
                    ORDER BY support_createdat DESC;`;

    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        console.log('getSupportByRecent error: ', err.message);
        throw err;
    }
}


exports.getSupportByAmount = async(req) => {
    const query = `SELECT support_nickname, support_amount, support_comment 
                    FROM ${table} 
                    WHERE story_idx = ${req.query.story_idx} 
                    ORDER BY support_amount DESC;`;

    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        console.log('getSupportByAmount error: ', err.message);
        throw err;
    }
}

exports.postSupportComment = async(req, comment_createdat, host_idx) => {
    const query = `INSERT INTO SUPPORT_COMMENT_TB
                    (comment_content, comment_createdat , support_idx, host_idx) 
                    VALUES("${req.body.comment_content}", "${comment_createdat}", ${req.params.support_idx}, ${host_idx});`;

    try {
        const result = await pool.queryParam(query);
        return result.insertId;
    } catch (err) {
        console.log('postSupportComment error: ', err.message);
        throw err;
    }
}