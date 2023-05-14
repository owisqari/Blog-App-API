const app = require("express")();
const url = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const UsersDB = require("../modules/Users");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
app.use(cookieParser());
app.use(
  session({
    secret: "my secret",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

url
  .connect(
    "mongodb+srv://admin:admin@cluster0.e0ld66h.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Cannot connect to the database", err);
  });

//config ejs
app.set("view engine", "ejs");
app.set("views", "./views");

//home route here (render the home page)
app.get("/", (req, res) => {
  UsersDB.find()
    .then((users) => {
      res.render("home.ejs", { users, isLogged: req.session.userId });
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

// signup route here (render the signup form)
app.get("/signup", (req, res) => {
  res.render("signup.ejs", { isLogged: req.session.userId });
});

//signup route and logic here (use bcrypt to hash the password)
app.post("/signup", (req, res) => {
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
app.get("/login", (req, res) => {
  res.render("login.ejs", { isLogged: req.session.userId });
});
// login route and logic here (use bcrypt to compare the password)
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  UsersDB.findOne({ username })
    .then((user) => {
      if (user) {
        const hash = user.password;
        bcrypt.compare(password, hash).then((result) => {
          if (result) {
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
app.get("/profile", (req, res) => {
  if (req.session.userId) {
    UsersDB.findOne({ _id: req.session.userId }).then((user) => {
      res.render("profile.ejs", { user });
    });
  } else {
    res.redirect("/login");
  }
});

// logout route here (destroy the session)
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// listen to port 2020
app.listen(2020, () => {
  console.log("Server running on port 2020");
});
