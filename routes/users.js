const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
const User = require("../models/user");
var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/", function (req, res, next) {
  res.render("user/login");
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

  res.render("index");
});

router.get("/newUser", function (req, res, next) {
  res.render("user/new");
});


module.exports = router;
