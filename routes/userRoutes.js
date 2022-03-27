const express = require('express');
const {body} = require ('express-validator');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const {logInLimiter} = require('../middleware/rateLimiters');
const {validateSignUp, validateLogIn, validateResults} = require('../middleware/validator');
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