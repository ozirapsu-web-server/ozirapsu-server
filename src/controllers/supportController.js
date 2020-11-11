const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const story = require('../models/story');
const support = require('../models/support');
const moment = require('moment');

exports.postSupport = async(req, res) => {
    const story_idx = req.query.story_idx;
    const {support_nickname, support_amount , support_comment, support_phone_number} = req.body;

    try{
        // story_idx 안줬을 때
        if(story_idx === undefined)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_PARAMETER));

        // 해당하는 스토리가 존재하지 않을 때
        const storyInfo = await story.getStoryInfo(story_idx);
        if (!storyInfo[0])
            return res.status(statusCode.NO_CONTENT).send(util.success(statusCode.NO_CONTENT, responseMessage.NO_CONTENT));

        // 응원 날짜 생성
        const support_createdat = moment().format('YYYY-MM-DD HH:mm:ss');

        const support_idx = await support.postSupport(req, support_createdat);
        if(support_idx === undefined)
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, responseMessage.DB_ERROR));

        return res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, responseMessage.POST_SUPPORT_SUCCESS));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
}