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
require("dotenv").config();

module.exports = {
  express,
  app,
  url,
  bodyParser,
  cookieParser,
  jwt,
  bcrypt,
  session,
  UsersDB,
  BlogsDB,
  adminRouter,
  apiRouter,
};
