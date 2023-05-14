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

app.get("/", (req, res) => {
  res.send("hello");
});
//config ejs
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/home", (req, res) => {
  res.send("home");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
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

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  UsersDB.findOne({ username })
    .then((user) => {
      const hash = user.password;
      bcrypt
        .compare(password, hash)

        .then((result) => {
          if (result) {
            req.session.userId = user._id;
            console.log(req.session);
            res.redirect("/home");
          } else {
            console.log("User not found");
            res.redirect("/login");
          }
        });
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send(req.session);
});
app.listen(2020, () => console.log("Server running on port 2020"));
