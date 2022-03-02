// Routes: This component is responsible for directing all requests to proper controller function. In your application, create two route modules:
// connection route module: include 7 RESTful routes for requests associated with connections.
// main route module: include routes for the general site navigation, including home, contact and about. 
const express = require('express');
const controller = require('../controllers/connectionController')
const{isLoggedIn, isAuthor, isNotAuthor} = require('../middleware/auth');

const{validateId, validateConnection, validateResults, validateRsvp} = require('../middleware/validator');
const router = express.Router();

//GET /connections: send all stories to the user

router.get('/', controller.index);

//GET /connections/new: send html form for creating a new story

router.get('/new', isLoggedIn, controller.new);

//POST /connections: create a new story

router.post('/', isLoggedIn, validateConnection, validateResults, controller.create);

//GET /connections/:id: send details of story identified by id
 router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: send the html form for editing an existing story
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /connections/:id: update the story identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor, validateConnection, validateResults, controller.update);

//DELETE /connections/:id, delete the story identified by the id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

//validate author
router.post('/:id/rsvp', validateId, isLoggedIn, isNotAuthor, validateRsvp, validateResults, controller.editRsvp);

//DELETE /connections/:id, delete the story identified by the id
router.delete('/:id/rsvp', validateId, isLoggedIn, isNotAuthor, controller.deleteRsvp);


module.exports = router;