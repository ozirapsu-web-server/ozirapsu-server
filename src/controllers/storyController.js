const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const storyModel = require('../models/story');
const moment = require('moment');
const STORY_URL = 'http://whowants.ga/storyPage/';

/**
 * 사연 정보 조회
 * @param {idx} req 사연 idx
 */
exports.getStoryInfo = async (req, res) => {
  const idx = req.params.idx;

  try {
    const storyInfo = await storyModel.getStoryInfo(idx);
    const tagInfo = await storyModel.getTags(idx);
    let tags = [];
    tagInfo.map((tag, idx) => {
      tags[idx] = tag.tag_content;
    });

    if (!storyInfo[0]) {
      return res
        .status(statusCode.NO_CONTENT)
        .send(util.success(statusCode.NO_CONTENT, responseMessage.NO_CONTENT));
    }

    storyInfo[0].tags = tags;

    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.GET_STORY_SUCCESS,
          storyInfo[0]
        )
      );
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
    throw err;
  }
};

/**
 * 사연 이미지 조회
 * @param {idx} req 사연 idx
 */
exports.getStoryImages = async (req, res) => {
  const idx = req.params.idx;

  try {
    // story_idx에 해당하는 사연이 없는 경우
    if (!(await storyModel.checkStoryIdx(idx))[0]) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(
          util.fail(statusCode.BAD_REQUEST, responseMessage.GET_STORY_IMG_FAIL)
        );
    }
    const result = await storyModel.getStoryImages(idx);
    const storyImages = result.map((data) => data.image_path);

    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.GET_STORY_IMG_SUCCESS,
          storyImages
        )
      );
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
    throw err;
  }
};

/**
 * 사연 등록
 */
exports.postStory = async (req, res) => {
  const hostIdx = req.decoded.idx;

  // 입력받은 파일이 단 한 장도 없는 경우
  if (req.files === undefined || req.files.length === 0) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_FILE));
  }

  // 입력받은 파일 중 하나라도 확장자가 png, jpg, jpeg가 아닌 파일이 있는 경우 === extensionFlag이 0인 경우
  let extensionFlag = 1;
  req.files.map((img) => {
    const type = img.mimetype.split('/')[1];
    if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
      extensionFlag = 0;
    }
  });
  if (extensionFlag === 0) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, responseMessage.INVALID_FILE_ERROR)
      );
  }

  const { targetAmount, title, contents, tagList } = req.body;
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  // 입력받은 태그 개수가 3개를 넘는 경우
  if (tagList.length > 3) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, responseMessage.INVALID_TAG_NUMBER)
      );
  }

  try {
    const result = await storyModel.postStory(
      title,
      contents,
      targetAmount,
      createdAt,
      hostIdx,
      tagList,
      req.files
    );

    if (!result) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
    }

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, responseMessage.POST_STORY_SUCCESS, {
        storyURL : STORY_URL+result
      }));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
    throw err;
  }
};

/**
 * 최근 사연 조회
 */
exports.getRecentStory = async (req, res) => {
  try {
    const storyResult = await storyModel.getRecentStory();

    for (const story of storyResult) {
      // 사연 태그 조회
      const tagInfo = await storyModel.getTags(story.idx);
      let tags = [];
      tagInfo.map((tag, idx) => {
        tags[idx] = tag.tag_content;
      });
      story.tags = tags;
    }

    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.GET_RECENT_STORY_SUCCESS,
          storyResult
        )
      );
  } catch (err) {
    console.log(err.message);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
  }
};

/**
 * 주목할 만한 사연 조회
 */
exports.getHotStory = async (req, res) => {
  try {
    const storyResult = await storyModel.getHotStory();

    for (const story of storyResult) {
      // 사연 태그 조회
      const tagInfo = await storyModel.getTags(story.idx);
      let tags = [];
      tagInfo.map((tag, idx) => {
        tags[idx] = tag.tag_content;
      });
      story.tags = tags;
    }
    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.GET_HOT_STORY_SUCCESS,
          storyResult
        )
      );
  } catch (err) {
    console.log(err.message);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
  }
};
