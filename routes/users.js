const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
const User = require("../models/user");
var bodyParser = require("body-parser");
const controller = require('../controllers/userController');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

//GET /users/new: send html form for creating a new user account

router.get('/new', isGuest, controller.new);

//POST /users: create a new user account

router.post('/', isGuest, validateSignUp, validateResults, controller.create);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResults, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;

----------




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
