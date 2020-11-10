const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const storyModel = require('../models/story');

/**
 * 사연 정보 조회
 * @param {idx} req 사연 idx
 */
exports.getStoryInfo = async (req, res) => {
  const idx = req.params.idx;

  try {
    const storyInfo = await storyModel.getStoryInfo(idx);

    if (!storyInfo[0]) {
      return res
        .status(statusCode.NO_CONTENT)
        .send(util.success(statusCode.NO_CONTENT, responseMessage.NO_CONTENT));
    }

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
