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
const { default: axios } = require("axios");
const { parse } = require("cookie");
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
    store: new MongoStore({
      mongoUrl: "mongodb://localhost:27017/capstone",
    }),
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

app.post("/search", async (req, res, next) => {
  // res.send("Sanity Check")
  let netflixCheck = req.body["netflix"];
  //   console.log(netflixCheck);
  let data = await search(encodeURI(req.body.movieSearch));
  //   if (netflixCheck === "on") {
  map = await filters(data[1]);
  //   }
  console.log("map from function " + map[ids[5]]);
  res.render("index", {
    parsedData: data[0],
    map: map,
    user: req.session.user,
    title: `Search Results for ${encodeURI(req.body.movieSearch)} -`,
  });
});

// this function does the search and returns an array of two where res is the search results and ids is an array of all the movie ids from the search
// axios is the new meta!! its an NPM module and we can use it with async/await to get the promises to resolve before rendering the page
// Axios also parses the data for you so you don't have to call json.parse() or whatever on it. just do results.data and you're good to go.
async function search(userSearchTerm) {
  const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${userSearchTerm}&api_key=1f809315a3a8c0a1456dd83615b4d783`;
  try {
    const response = await axios.get(movieUrl);
    let res = response.data;
    let ids = await getIds(res);
    return [res, ids];
  } catch (error) {
    console.log(error.response);
  }
}

//this fuction gets all the ID's for movies that show up in the search
async function getIds(parsedData) {
  console.log("length " + parsedData.length);
  ids = [];
  for (let i = 0; i < 20; i++) {
    ids.push(parsedData.results[i].id);
  }
  return ids;
}

//This fuction creates a hashmap with movie id's as keys and the movie provider (streaming service) as values
async function filters(ids) {
  let map = new Map();
  //   console.log("ids from filters: ", ids);

  for (var i = 0; i < ids.length; i++) {
    let providerURL =
      "https://api.themoviedb.org/3/movie/" +
      ids[i] +
      "/watch/providers?api_key=" +
      apiKey;
    let response = await axios.get(providerURL);
    // console.log("response data" + response.data.us.flatrate[0].provider_name);
    if (response.data.results.US) {
      if (response.data.results.US.flatrate !== undefined) {
        console.log(response.data.results.US.flatrate[0].provider_name);
        map.set(ids[i], response.data.results.US.flatrate[0].provider_name);
      }
    }
  }
  return map;
}

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
