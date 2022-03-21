//require modules
const express = require("express");
var request = require("request");

const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const userRoutes = require("./routes/userRoutes");
const popularRoutes = require("./routes/popular");
const fetch = require("node-fetch");
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

//create app
const app = express();

//configure app
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

//connect to database
mongoose
  .connect("mongodb://localhost:27017/capstone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //start app
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

// //mount middlware
app.use(
  session({
    secret: "ajfeirf90aeu9eroejfoefj",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: "mongodb://localhost:27017/capstone" }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(flash());

app.use((req, res, next) => {
  //console.log(req.session);
  res.locals.user = req.session.user || null;
  res.locals.firstName = req.session.firstName || "Guest";
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

//mount middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

app.use("/users", userRoutes);
app.use("/popular", popularRoutes);
app.use("/movie", popularRoutes);

// set up routes
app.get("/", async (req, res) => {
  try {
    const popular = urls.popular + apiKey;
    // load initial main movie
    const response = await fetch(popular);
    const parsedData = await response.json();
    res.render("index", { parsedData, user: req.session.user });
  } catch (e) {
    throw e;
  }
});

app.post("/search", (req, res, next) => {
  // res.send("Sanity Check")
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${userSearchTerm}&api_key=1f809315a3a8c0a1456dd83615b4d783`;
  // res.send(movieUrl)
  request.get(movieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    // res.json(parsedData);
    res.render("index", {
      parsedData: parsedData,
      user: req.session.user,
      title: `Search Results for ${userSearchTerm} -`,
    });
  });
});
// UN COMMENT LATER
app.use((req, res, next) => {
  let err = new Error("The server cannot locate" + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }
  res.status(err.status);
  res.render("error", { error: err });
});
