var express = require('express');
var router = express.Router();
const supportController = require('../controllers/supportController');


router.post('/', supportController.postSupport);


module.exports = router;