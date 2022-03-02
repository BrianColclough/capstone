
const model = require('../models/connection');
const rsvpModel = require('../models/rsvp');
// const model = require('../models/rsvp');
const {isAuthor} = require('../middleware/auth');
const connection = require('../models/connection');


exports.index = (req, res, next)=>{
    model.find()
    .then(connections=>{
        let topic = model.getTopics(connections); 
            res.render('./connection/connectionsExist', {connections, topic})
        })

    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./connection/new');
};

exports.create = (req, res, next)=>{
    let connection = new model(req.body);//create a new story document
    connection.author = req.session.user;
    let id = req.params.id;
    // console.log(connection);
    connection.save()//insert the document to the database
    .then(connection=> {
         console.log(connection);
         req.flash('success', 'Connection has been created successfully');
        res.redirect('/connections');
    })
    .catch(err=>{
        console.log(err);
        if(err.name === 'ValidationError' ) {
         req.flash('error', err.message);
        
        return res.redirect('/connections/new');
        }
        next(err);
    });
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    let user = req.session.user;
    Promise.all([model.findById(id), rsvpModel.count({connection:id, rsvp: "YES"})])
     .then(results=>{
         const [connection, rsvps] = results;
        if(connection) {       
            // after user click on connection, check if the user clicked "yes" or "no"
            //check to make sure
            //add answer to rsvp database
           res.render('./connection/connectionDetail', {connection, user, rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
         }
     })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(connection=>{
        return res.render('./connection/edit', {connection});
    })
    .catch(err=>next(err));
};


exports.update = (req, res, next)=>{
    let user = req.session.user;
    if (user){
    let connection = req.body;
    connection.author = user;
    let id = req.params.id;
    
    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{ 
        req.flash('Successfully updated connection');
        return res.redirect('/connections/'+id);
    })
    .catch(err=> {
        console.log("catch");
        if(err.name === 'ValidationError') {
             req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
    }
};


exports.delete = (req, res, next)=>{
    let user = req.session;
    if (user){
    let userID = user.user;
    let id = req.params.id;
    
     // after user click on connection, check if the user clicked "yes" or "no"
            //check to make sure
            //add answer to rsvp database
    isAuthor(req, res, next);
    Promise.all([model.findByIdAndDelete(id,{useFindAndModify: false}), rsvpModel.deleteMany({connection:id})])
    .then(connection =>{
        req.flash('Successfully deleted connection');
        res.redirect('/connections');
    })
    .catch(err=> {
        console.log("catch");
        if(err.name === 'ValidationError') {
             req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
 }
};

exports.editRsvp = (req,res,next)=>{
console.log(req.body.rsvp);
 let id = req.params.id;
 rsvpModel.findOne({connection:id, user: req.session.user}).then(rsvp=>{
 if (rsvp){
     rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp:req.body.rsvp},{useFindAndModify: false, runValidators: true})
     .then(rsvp=>{
         req.flash('success','Successfully updated RSVP');
         res.redirect('/users/profile');
     })
     .catch(err=>{
 console.log(err);
 if (err.name == 'validatonError'){
     req.flash('error', err.message);
     return res.redirect('/back');
 }
 next(err);});
 }
 else{
     let rsvp = new rsvpModel({
         connection: id,
         rsvp: req.body.rsvp,
         user: req.session.user
     });
     rsvp.save()
     .then(rsvp=> {
     req.flash('success','Successfully updated RSVP')
          res.redirect('/users/profile');
 })
 .catch (err=>
     next(err))
 }
 })
}


exports.deleteRsvp = (req,res, next)=>{
    let id = req.params.id;
    rsvpModel.findOneAndDelete({connection:id, user:req.session.user})
    .then(rsvp=>{
        req.flash('success','Successfully updated RSVP');
        res.redirect('/users/profile');
    })
    .catch(err=>{
        req.flash('error', err.message);
        next(err)});


}

























