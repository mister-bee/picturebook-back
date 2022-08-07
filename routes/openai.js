var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with an ai resource');
});

router.post('/', function (req, res, next) {
  console.log("req.body: ", req.body)
  res.send('respond with POST ai resource');
});



module.exports = router;
