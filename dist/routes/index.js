'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/h', function (req, res, next) {
  res.send("HEllo");
});

module.exports = router;