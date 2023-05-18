const express = require("express");
const app = express();
const url = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const session = require("express-session");
const UsersDB = require("../models/Users");
const BlogsDB = require("../models/Blogs");
const adminRouter = require("../routers/admin");
const apiRouter = require("../routers/APIs");
const { verifyToken, BlogAuthUser } = require("../middlewares/auth");
require("dotenv").config();
const saltRounds = Number(process.env.SALT_ROUNDS);

app.use("/api", apiRouter);
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
app.use("/admin", adminRouter);

//config ejs
app.set("view engine", "ejs");
app.set("views", "./views");

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
            res.status(201).json(savedUser);
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
    // check if username exist
    UsersDB.findOne({ username }).then((user) => {
      if (user) {
        res.status(400).json({ message: "Username already exist" });
      } else {
        UsersDB.create({
          username: username,
          password: password,
          email: email,
          city: city,
          about: about,
        })
          .then((savedUser) => {
            res.status(201).json(savedUser);
          })
          .catch((err) => {
            console.log("Error: ", err);
          });
      }
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
        res.status(401).json({ message: "User not found" });
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
        res.status(401).json({ message: "User not found" });
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
          .then((isPassword) => {
            if (isPassword) {
              res.status(200).json(user);
            } else {
              res.status(401).json({ message: "Wrong credentials" });
            }
          })
          .catch((err) => {
            res.json({ err: err });
          });
      } else {
        res.status(401).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  UsersDB.findOne({ username })
    .select("+password")
    .then((user) => {
      if (user) {
        const hash = user.password;
        bcrypt
          .compare(password, hash)
          .then((isPassword) => {
            if (isPassword) {
              const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1h",
                }
              );
              res.status(200).json({ token, user: user._id });
            } else {
              res.status(401).json({ message: "Wrong credentials" });
            }
          })
          .catch((err) => {
            res.json({ err: err });
          });
      } else {
        res.status(401).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

app.get("/api/profile", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the profile page" });
});

app.get("/api/home", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the home page" });
});

// api/register  after register user will logic auto
app.post("/api/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const city = req.body.city;
  const about = req.body.about;

  // Validate the input
  if (!username || !password || !email || !city || !about) {
    res.status(400).json({ message: "Please fill all the fields" });
    return;
  }

  // Check if the username already exists
  UsersDB.findOne({ username }).then((user) => {
    if (user) {
      res.status(400).json({ message: "Username already exist" });
      return;
    }

    // Hash the password
    bcrypt
      .hash(password, saltRounds)
      .then((hash) => {
        // Create the user
        UsersDB.create({
          username: username,
          password: hash,
          email: email,
          city: city,
          about: about,
        })
          .then((savedUser) => {
            // Generate a JWT token
            const token = jwt.sign(
              { userId: savedUser._id },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );

            // Return the token
            res.status(201).json({ token });
          })
          .catch((err) => {
            console.log("Error: ", err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

// create blog api here
app.post("/api/createBlog", verifyToken, (req, res) => {
  BlogsDB.create({
    title: req.body.title,
    body: req.body.body,
    userId: res.locals.userId,
  })
    .then((savedBlog) => {
      UsersDB.findByIdAndUpdate(res.locals.userId, {
        $push: { blogId: savedBlog._id },
      })
        .then(() => {
          res.status(201).json(savedBlog);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

// blogs api here
app.get("/api/allBlogs", verifyToken, (req, res) => {
  BlogsDB.find()
    .then((blogs) => {
      res.status(200).json(blogs);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

// delete blog api here
app.delete("/api/deleteBlog", verifyToken, BlogAuthUser, (req, res) => {
  res.locals.blog
    .deleteOne()
    .then(() => {
      res.status(200).json({ blog: res.locals.blog, message: "Blog deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// update blog api here
app.put("/api/updateBlog", verifyToken, BlogAuthUser, (req, res) => {
  res.locals.blog.title = req.body.title;
  res.locals.blog.body = req.body.body;
  res.locals.blog
    .save()
    .then((updateBlog) => {
      res.status(200).json({ updateBlog, message: "Blog updated" });
    })
    .catch((err) => {
      console.log(err);
    });
});
// listen to port 2020
app.listen(process.env.PORT, () => {
  console.log("Server running on port 8080");
});
