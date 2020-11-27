const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const storyModel = require('../models/story');
const moment = require('moment');

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
    if (!((await storyModel.checkStoryIdx(idx))[0])) {
      return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.GET_STORY_IMG_FAIL));
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
  //---------로그인 구현 이후 header로 토큰 받아서 host_idx 받기---------//
  const hostIdx = 1; // 임시 hostIdx

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

  //---------사연 요약 확정되면 추가하기---------//
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

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, responseMessage.POST_STORY_SUCCESS));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
    throw err;
  }
};
