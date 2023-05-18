const express = require("express");
const router = express.Router();
const UsersDB = require("../models/Users");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS);
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

router.use(cookieParser());
router.use(
  session({
    secret: process.env.SECRET,
  })
);
router.use(bodyParser.urlencoded({ extended: false }));

//home route here (render the home page)
router.get("/", (req, res) => {
  UsersDB.find()
    .then((users) => {
      res.render("home.ejs", { users, isLogged: req.session.userId });
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

// signup route here (render the signup form)
router.get("/signup", (req, res) => {
  res.render("signup.ejs", { isLogged: req.session.userId });
});

//signup route and logic here (use bcrypt to hash the password)
router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const city = req.body.city;
  const about = req.body.about;
  bcrypt
    .genSalt(saltRounds)
    .then(() => {
      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => {
      UsersDB.create({
        username: username,
        password: hash,
        email: email,
        city: city,
        about: about,
      })
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    })
    .catch((err) => console.error(err.message));
});

// login route here (render the login form)
router.get("/login", (req, res) => {
  res.render("login.ejs", { isLogged: req.session.userId });
});
// login route and logic here (use bcrypt to compare the password)
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  UsersDB.findOne({ username })
    .then((user) => {
      if (user) {
        const hash = user.password;
        bcrypt.compare(password, hash).then((isPassword) => {
          if (isPassword) {
            req.session.userId = user._id;
            console.log(req.session);
            res.redirect("/");
          } else {
            console.log("User not found");
            res.redirect("/login");
          }
        });
      } else {
        console.log("User not found");
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});
//you can use this to check if the user is logged in or not
router.get("/profile", (req, res) => {
  if (req.session.userId) {
    UsersDB.findOne({ _id: req.session.userId }).then((user) => {
      res.render("profile.ejs", { user });
    });
  } else {
    res.redirect("/login");
  }
});

// logout route here (destroy the session)
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
