const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
const User = require("../models/user");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();

router.post("/login", urlencodedParser, async function (req, res, next) {
  if (!req.body.userName || !req.body.password) {
    res.status("400");
    res.send("Invalid credentails");
  } else {
    await User.findOne(
      { userName: req.body.userName },
      { password: req.body.password }
    ).exec();
    var newUser = { userName: req.body.userName, password: req.body.password };
    req.session.user = newUser;
    res.render("index", { user: newUser });
  }
});

router.get("/", function (req, res, next) {
  res.render("user/login", { user: req.session.user });
});

router.post("/", urlencodedParser, async function (req, res, next) {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  await newUser.save();

  var User = { userName: req.body.userName, password: req.body.password };
  res.render("index", { user: User });
});

router.get("/newUser", function (req, res, next) {
  res.render("user/new");
});

module.exports = router;
