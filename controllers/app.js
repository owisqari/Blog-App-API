const express = require("express");
const app = express();
const url = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const UsersDB = require("../modules/Users");
require("dotenv").config();

const saltRounds = process.env.SALT_ROUNDS;

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
url
  .connect(process.env.DB_URL)
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

// get all users api here
app.get("/list", (req, res) => {
  UsersDB.find()
    .then((users) => {
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

// get user by id api here
app.get("/usersAPI/:id", (req, res) => {
  UsersDB.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

// creeate users api here
app.post("/RegisterAPI", (req, res) => {
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
      if (password && username && email && city && about) {
        UsersDB.create({
          username: username,
          password: hash,
          email: email,
          city: city,
          about: about,
        })
          .then((savedUser) => {
            res.status(200).json(savedUser);
          })
          .catch((err) => {
            console.log("Error: ", err);
          });
      } else {
        res.status(400).json({ message: "Please fill all the fields" });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/CreateUserAPI", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const city = req.body.city;
  const about = req.body.about;
  if (password && username && email && city && about) {
    UsersDB.create({
      username: username,
      password: password,
      email: email,
      city: city,
      about: about,
    })
      .then((savedUser) => {
        res.status(200).json(savedUser);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  } else {
    res.status(400).json({ message: "Please fill all the fields" });
  }
});

//users update api here
app.put("/UpdateUserAPI/:id", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const city = req.body.city;
  const about = req.body.about;
  UsersDB.findByIdAndUpdate(req.params.id, {
    username: username,
    password: password,
    email: email,
    city: city,
    about: about,
  })
    .then((updateUser) => {
      if (updateUser) {
        res.status(200).json(updateUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// delete users api here
app.delete("/DeleteUserAPI/:id", (req, res) => {
  UsersDB.findByIdAndDelete(req.params.id)
    .then((deleteUser) => {
      if (deleteUser) {
        res.status(200).json(deleteUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// login api here
app.post("/loginAPI", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  UsersDB.findOne({ username })
    .then((user) => {
      if (user) {
        const hash = user.password;
        bcrypt
          .compare(password, hash)
          .then((result) => {
            if (result) {
              res.status(200).json(user);
            } else {
              res.status(404).json({ message: "Wrong credentials" });
            }
          })
          .catch((err) => {
            res.json({ err: err });
          });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});
// listen to port 2020
app.listen(process.env.PORT, () => {
  console.log("Server running on port 8080");
});
