import express from 'express';
var router = express.Router();



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/h', function (req, res, next) {
  res.send("HEllo");
});

module.exports = router;
