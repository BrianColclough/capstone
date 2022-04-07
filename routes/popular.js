const express = require("express");
const router = express.Router();
const model = require("../models/user");
const comment = require("../models/comment");
const fetch = require("node-fetch");
const session = require("express-session");
const user = require("../models/user");

const apiKey = "b85b3c13a595dcf1d03f1878600fb10e";
const urls = {
  nowPlaying: "https://api.themoviedb.org/3/movie/now_playing?api_key=",
  popular: "https://api.themoviedb.org/3/movie/popular?api_key=",
  top_rated: "https://api.themoviedb.org/3/movie/top_rated?api_key=",
  upcoming: "https://api.themoviedb.org/3/movie/upcoming?api_key=",
  singleMovieInfo: "https://api.themoviedb.org/3/movie/",
  movieInfobyTitle: "https://api.themoviedb.org/3/search/movie?api_key=",
  youtubeVideo: "https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=",
};

// Index Route
router.get("/", async (req, res) => {
  try {
    const popular = urls.popular + apiKey;
    // load initial main movie
    const response = await fetch(popular);
    const parsedData = await response.json();
    res.render("index", { parsedData });
  } catch (e) {
    throw e;
  }
});

//Adding users Comment
router.post("/:id/comment", (req, res) => {
  const ID = req.params.id;
  console.log("comment");
  console.log(req.session.user.userName.toString());
  comment
    .findOneAndUpdate(
      { movie: req.params.id },
      {
        $push: { user: req.session.user.userName, comment: req.body.comment },
      },
      { upsert: true }
    )
    // do not remove this then statement, it breaks everything lol
    .then((user) => {
      //   console.log("session after like");
      //   console.log(user);
      res.redirect("/movie/" + ID);
    });
});

// SHOW - Show info about one movie
router.get("/:id", async (req, res) => {
  model.findOne({ _id: req.session.user }).then((user) => {
    req.session.user = user;
  });
  console.log(req.session.user);
  try {
    const ID = req.params.id;
    const movieInfobyTitle = `${urls.movieInfobyTitle + apiKey}&query=${ID}`;
    const response = await fetch(movieInfobyTitle);
    const foundMovie = await response.json();
    const singleMovieInfo = `${
      urls.singleMovieInfo + req.params.id
    }?api_key=${apiKey}`;
    const singleMovieCredits = `${
      urls.singleMovieInfo + req.params.id
    }/credits?api_key=${apiKey}`;
    const popular = urls.popular + apiKey;
    const youtube = `http://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${apiKey}&language=en-US`;
    const recommendations = `https://api.themoviedb.org/3/movie/${req.params.id}/recommendations?api_key=${apiKey}&language=en-US&page=1`;
    // singleMovieInfo
    try {
      const singleMovieRequest = await fetch(singleMovieInfo);
      var info = await singleMovieRequest.json();
    } catch (e) {
      throw e;
    }
    // youtube
    try {
      const YoutubeRequest = await fetch(youtube);
      var video = await YoutubeRequest.json();
    } catch (e) {
      throw e;
    }
    // singleMovieCredits
    try {
      const singleMovieCreditsRequest = await fetch(singleMovieCredits);
      var credit = await singleMovieCreditsRequest.json();
    } catch (e) {
      throw e;
    }
    // recommendations
    try {
      const recommendationsRequest = await fetch(recommendations);
      var recommend = await recommendationsRequest.json();
    } catch (e) {
      throw e;
    }
    // currPopular
    try {
      const currPopularRequest = await fetch(popular);
      var currPopular = await currPopularRequest.json();
    } catch (e) {
      throw e;
    }
    var movieComments;
    await comment.findOne({ movie: req.params.id }).then((comment) => {
      movieComments = comment;
    });
    if (movieComments) {
      res.render("popular/show", {
        Movie: info,
        Video: video,
        Credit: credit,
        Recommend: recommend,
        currPopular,
        layout: false,
        user: req.session.user,
        comment: movieComments,
      });
    } else {
      res.render("popular/show", {
        Movie: info,
        Video: video,
        Credit: credit,
        Recommend: recommend,
        currPopular,
        layout: false,
        user: req.session.user,
        comment: null,
      });
    }
  } catch (e) {
    throw e;
  }
});

router.get("/liked/:id", (req, res) => {
  console.log("from liking movie");
  console.log(req.session.user);
  const ID = req.params.id;
  //   console.log("session User");
  //   console.log(req.session.user);
  model
    .findOneAndUpdate(
      { _id: req.session.user },
      { $push: { likedMovies: ID } },
      { upsert: true }
    )
    // do not remove this then statement, it breaks everything lol
    .then((user) => {
      //   console.log("session after like");
      //   console.log(user);
      res.redirect("/movie/" + ID);
    });
});

router.get("/unliked/:id", (req, res) => {
  const ID = req.params.id;
  console.log("session User");
  console.log(req.session.user);
  model
    .findOneAndUpdate({ _id: req.session.user }, { $pull: { likedMovies: ID } })
    .then((user) => {
      sessionUser = user;
      res.redirect("/movie/" + ID);
    });
});

module.exports = router;
