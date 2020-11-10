const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const support = require('../models/support');
const moment = require('moment');

exports.postSupport = async(req, res) => {
    const story_idx = req.query.story_idx;
    const {support_nickname, support_amount , support_comment, support_phone_number} = req.body;

    try{
        if(story_idx === undefined)
            return res.status(statusCode.OK).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_PARAMETER));

        const support_createdat = moment().format('YYYY-MM-DD HH:mm:ss');
        const support_idx = await support.postSupport(req, support_createdat);
        if(support_idx === undefined)
            return res.status(statusCode.OK).send(util.fail(statusCode.DB_ERROR, responseMessage.DB_ERROR));

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.POST_SUPPORT_SUCCESS));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
}