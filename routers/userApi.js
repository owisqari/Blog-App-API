const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth");
require("dotenv").config();
const {
  profile,
  home,
  login,
  register,
} = require("../controllers/userController");

router.get("/profile", verifyToken, profile);

router.get("/home", verifyToken, home);

router.post("/login", login);

router.post("/register", register);

module.exports = router;
