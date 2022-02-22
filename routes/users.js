var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('user/login');
});

router.get('/newUser', function(req, res, next) {
  res.render('user/new');
});



module.exports = router;