const express = require("express");
const router = express.Router();
const model = require("../models/user");
const rsvpModel = require("../models/rsvp");
const Connection = require("../models/connection");
const fetch = require("node-fetch");
const comment = require('../models/comment');
const urls = {
  movieInfobyTitle: "https://api.themoviedb.org/3/search/movie?api_key=",
  singleMovieInfo: "https://api.themoviedb.org/3/movie/",
};
const apiKey = "b85b3c13a595dcf1d03f1878600fb10e";

exports.new = (req, res) => {
  return res.render("./user/new");
};

exports.add = (req, res)=>{
  res.render('./movie/id');
};





exports.create = (req, res, next) => {
  let user = new model(req.body);
  if (user.email) user.email = user.email.toLowerCase();
  user
    .save()
    .then((user) => {
      req.flash("success", "Registration succeeded!");
      res.redirect("/users/login");
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("back");
      }

      if (err.code === 11000) {
        req.flash("error", "Email has been used");
        return res.redirect("back");
      }
      next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
  return res.render("./user/login");
};

exports.login = (req, res, next) => {
  let email = req.body.email;
  if (email) email = email.toLowerCase();
  let password = req.body.password;
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Wrong Email Address");
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.firstName = user.firstName;
            req.session.user = user;
            req.flash("success", "You have successfully logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "Wrong Password");
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

exports.profile = async (req, res, next) => {
  // update user's profile to ensure we have all the movies they have liked
  model.findOne({ _id: req.session.user }).then((user) => {
    req.session.user = user;
  });

  // get all the movies the user has liked and put into arrays that we will pass to the view
  try {
    movieTitles = [];
    moviePosters = [];
    for (let i = 0; i < req.session.user.likedMovies.length; i++) {
      const singleMovieInfo = `${
        urls.singleMovieInfo + req.session.user.likedMovies[i]
      }?api_key=${apiKey}`;
      try {
        // get the movie info and put it into json format
        const singleMovieRequest = await fetch(singleMovieInfo);
        var info = await singleMovieRequest.json();
        console.log(info);

        // if movie is not already in the list then add it
        if (!movieTitles.includes(info.original_title)) {
          movieTitles.push(info.original_title);
          moviePosters.push(
            "https://image.tmdb.org/t/p/w500" + info.poster_path
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    throw err;
  }
  //   console.log(movieTitles);
  res.render("./user/profile", {
    user: req.session.user,
    movieTitles: movieTitles,
    moviePosters: moviePosters,
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    else res.redirect("/");
  });
};
