const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};



exports.validateSignUp = [body('firstName', 'First Name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last Name cannot be empty').notEmpty().trim().escape(),
body('userName', 'User Name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];


exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];


exports.validateRsvp = [body('rsvp').isIn(['YES','NO','MAYBE'])];




exports.validateResults =  (req, res, next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
        }else {
            return next();
        }
    }


// adding input validation/sanitization for creating and updating a story.
    exports.validateConnection = [body('connectionName', 'Connection Name cannot be empty').trim().escape(),
    body('connectionTopic', 'Connection Topic cannot be empty').trim().escape(),
    body('details', 'Details should have a minimum length least 5 characters').trim().escape(),
    body('date', ' Date cannot be empty').trim().escape(),
    body('startTime', 'cannot be empty').trim().escape(),
    body('endTime', 'End Time cannot be empty').trim().escape(),
    body('hostName', 'Host Name cannot be empty').trim().escape(),
    body('author', 'Author cannot be empty').trim().escape(),
    body('location', 'Location cannot be empty').trim().escape(),
    body('imageUrl', 'Must be a minimum length of 10 characters').trim()];

 




