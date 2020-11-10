var express = require('express');
var router = express.Router();
const support = require('./support');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/support', support);

module.exports = router;
