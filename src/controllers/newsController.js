const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const news = require('../models/news');
const story = require('../models/story');
const moment = require('moment');
const transferTime = require('../modules/transferTime');

exports.postNews = async(req, res) => {
    const story_idx = req.query.story_idx;

    try{
        // story_idx 안줬을 때
        if(story_idx === undefined || story_idx === null || story_idx == 0)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.PARAMETER_ERROR));

        // 해당하는 스토리가 존재하지 않을 때
        const storyInfo = await story.getStoryInfo(story_idx);
        if (!storyInfo[0])
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_CONTENT));

        // 새소식 등록 날짜 생성
        const news_createdat = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = await news.postNews(req, news_createdat);

        if(result === undefined)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));

        return res.status(statusCode.CREATED)
            .send(util.successWithoutData(
                statusCode.CREATED,
                responseMessage.POST_NEWS_SUCCESS));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
}