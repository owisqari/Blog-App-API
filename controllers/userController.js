const UsersDB = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS);

exports.profile = async (req, res) => {
  res.status(200).json({ message: "Welcome to the profile page" });
};

exports.home = async (req, res) => {
  res.status(200).json({ message: "Welcome to the home page" });
};

exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await UsersDB.findOne({ username }).select("+password");

  if (user) {
    const hash = user.password;
    const isPassword = await bcrypt.compare(password, hash);
    if (isPassword) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token, user: user._id });
    } else {
      res.status(401).json({ message: "Wrong credentials" });
    }
  } else {
    res.status(401).json({ message: "User not found" });
  }
};

exports.register = async (req, res) => {
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
  try {
    // Check if the username already exists
    const user = await UsersDB.findOne({ username });
    if (user) {
      res.status(400).json({ message: "Username already exist" });
      return;
    }

    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const savedUser = await UsersDB.create({
      username: username,
      password: hash,
      email: email,
      city: city,
      about: about,
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token
    res.status(201).json({ token });
  } catch (err) {
    console.log(err);
  }
};
