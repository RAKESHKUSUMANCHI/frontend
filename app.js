const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our Little Secret",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("user", userSchema);

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    const num = Math.floor(Math.random() * 30);
    var imgSrc = "images/img" + num + ".jpeg";
    res.render("home", {
      imgSrc: imgSrc,
      topText: "",
      bottomText: ""
    });
  } else {
    res.redirect("/login");
  }

})

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      })
    }
  });
});

app.post("/login", function(req, res) {
      const user = new User({
        username: req.body.username,
        password: req.body.password
      });
      req.login(user, function(err) {
          if (err) {
            console.log(err);
          } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");});
            }
          })
      });

    app.post("/", function(req, res) {
      res.render("home", {
        imgSrc: req.body.imgSrc,
        topText: req.body.topText,
        bottomText: req.body.bottomText
      });
    });

    app.get("/logout",function(req,res){
      req.logout();
      res.redirect("/");
    });


    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });
