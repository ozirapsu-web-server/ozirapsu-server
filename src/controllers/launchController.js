const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');

exports.getLaunchVideo = async (req, res) => {
    try {
        return res
            .status(statusCode.OK)
            .send(
                util.success(
                    statusCode.OK,
                    responseMessage.GET_LAUNCH_VIDEO_SUCCESS,
                    {video: "https://whowants2.s3.ap-northeast-2.amazonaws.com/images/origin/login.mp4"}
                )
            );
    } catch (err) {
        console.log(err.message);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
    }
};
