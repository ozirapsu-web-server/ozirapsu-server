const pool = require('../modules/pool');
const table = 'SUPPORT_TB';

exports.postSupport = async(req, support_createdat) => {
    const query = `INSERT INTO ${table}(support_nickname, support_amount , support_comment, support_phone_number, support_createdat, story_idx) 
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
    const query = `SELECT support_nickname, support_amount, support_comment FROM ${table} WHERE story_idx = ${req.query.story_idx} LIMIT 3;`;

    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        console.log('getSupportTop error: ', err.message);
        throw err;
    }
}

exports.getSupportCount = async(req) => {
    const query = `SELECT count(*) AS count FROM ${table} WHERE story_idx = ${req.query.story_idx};`;

    try {
        const result = await pool.queryParam(query);
        return result[0].count;
    } catch (err) {
        console.log('getSupportCount error: ', err.message);
        throw err;
    }
}