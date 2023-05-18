const express = require("express");
const app = express();
const url = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const adminRouter = require("./routers/admin");
const BlogapiRouter = require("./routers/blogAPIs");
const userapiRouter = require("./routers/userApi");

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
app.use("/api/user", userapiRouter);
app.use("/api/blog", BlogapiRouter);

//config ejs
app.set("view engine", "ejs");
app.set("views", "./views");

// listen to port 2020
app.listen(process.env.PORT, () => {
  console.log("Server running on port 8080");
});
