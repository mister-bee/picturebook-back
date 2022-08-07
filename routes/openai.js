var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with an ai resource');
});

module.exports = router;
