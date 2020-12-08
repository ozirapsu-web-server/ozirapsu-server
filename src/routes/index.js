var express = require('express');
var router = express.Router();
const support = require('./support');
const story = require('./story');
const host = require('./host');
const auth = require('./auth');
const news = require('./news');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/story', story);
router.use('/support', support);
router.use('/host', host);
router.use('/auth', auth);
router.use('/news', news);

module.exports = router;
