const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const story = require('../models/story');
const support = require('../models/support');
const moment = require('moment');
const transferTime = require('../modules/transferTime');

exports.postSupport = async(req, res) => {
    const story_idx = req.query.story_idx;
    const {support_nickname, support_amount , support_comment, support_phone_number} = req.body;

    try{
        // story_idx 안줬을 때
        if(story_idx === undefined)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.PARAMETER_ERROR));

        // 해당하는 스토리가 존재하지 않을 때
        const storyInfo = await story.getStoryInfo(story_idx);
        if (!storyInfo[0])
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_CONTENT));

        // 응원 날짜 생성
        const support_createdat = moment().format('YYYY-MM-DD HH:mm:ss');

        const support_idx = await support.postSupport(req, support_createdat);
        if(support_idx === undefined)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));

        return res.status(statusCode.CREATED).send(util.successWithoutData(statusCode.CREATED, responseMessage.POST_SUPPORT_SUCCESS));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
}

exports.getSupportTop = async(req, res) => {
    const story_idx = req.query.story_idx;

    try{
        // story_idx 안줬을 때
        if(story_idx === undefined)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.PARAMETER_ERROR));

        // 해당하는 스토리가 존재하지 않을 때
        const storyInfo = await story.getStoryInfo(story_idx);
        if (!storyInfo[0])
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_CONTENT));

        const supportCount = await support.getSupportCount(req);
        const result = await support.getSupportTop(req);
        if(result === undefined)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));

        return res.status(statusCode.OK)
            .send(util.success(
                    statusCode.OK,
                    responseMessage.GET_SUPPORT_TOP_SUCCESS,
                {supportCount: supportCount, support: result }));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
}

exports.getSupport = async(req, res) => {
    let {story_idx, filter} = req.query;
    let comments;

    try{
        // story_idx 안줬을 때
        if(story_idx === undefined)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.PARAMETER_ERROR));
        if(filter === undefined)
            filter = 0;

        // 해당하는 스토리가 존재하지 않을 때
        const storyInfo = await story.getStoryInfo(story_idx);
        if (!storyInfo[0])
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_CONTENT));

        const supportCount = await support.getSupportCount(req);

        // 최신순
        if(filter == 0)
            comments = await support.getSupportByRecent(req);
        // 후원 많은 순
        else if(filter == 1)
            comments  = await support.getSupportByAmount(req);
        else
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.PARAMETER_ERROR));

        const supportComment = await support.getSupportComment(req);
        if(comments === undefined || supportComment === undefined)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));

        for (const element of comments) {
            element.support_date = await transferTime.transferTime(element.support_date);
        }
        for (const element of supportComment) {
            element.comment_date = await transferTime.transferTime(element.comment_date);
        }

        return res.status(statusCode.OK)
            .send(util.success(
                statusCode.OK,
                responseMessage.GET_SUPPORT_SUCCESS,
                {supportCount: supportCount, support: comments, supportComment: supportComment }));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
}


exports.postSupportComment = async(req, res) => {
    const support_idx = req.params.support_idx;
    // 로그인 구현 전 임시 host_idx 사용 -> 수정 해야 됨
    const host_idx = 1;
    try{
        // support_idx 안줬을 때
        if(support_idx === undefined || support_idx === null || support_idx == 0)
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.PARAMETER_ERROR));

        // 대댓글 날짜 생성
        const comment_createdat = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = await support.postSupportComment(req, comment_createdat, host_idx);

        if(result === undefined)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.DB_ERROR));

        return res.status(statusCode.CREATED)
            .send(util.successWithoutData(
                statusCode.CREATED,
                responseMessage.POST_SUPPORT_COMMENT_SUCCESS));
    } catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
        throw err;
    }
}