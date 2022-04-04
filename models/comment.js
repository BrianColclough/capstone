const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const commentSchema = new Schema({
    comment: {type:String, required:[true, 'Comment is required']},
    user: {type: Schema.Types.ObjectId, ref: 'User', required:[true, 'User is required']},
    movie: {type: Schema.Types.ObjectId, ref: 'Movie', required:[true, 'Movie is required']},
}
);

//  rsvpSchema.index({author: 1, connection: 1}, {unique: true});


// An RSVP is associated with a user and a connection.
//  Make sure that the models can reflect such relationship. 
//  Further, because an RSVP is associated with a connection, 
//  when a connection is deleted, its associated RSVPs should be deleted as well.


//collection name is stories in the database
module.exports = mongoose.model('comment', commentSchema);