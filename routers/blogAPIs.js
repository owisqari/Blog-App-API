const express = require("express");
const router = express.Router();
const UsersDB = require("../models/Users");
const BlogsDB = require("../models/Blogs");
const {
  allBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogController");
const { verifyToken, BlogAuthUser } = require("../middlewares/auth");

// blogs api here
router.get("/allBlogs", verifyToken, allBlogs);

// create blog api here
router.post("/createBlog", verifyToken, createBlog);

// delete blog api here
router.delete("/deleteBlog", verifyToken, BlogAuthUser, deleteBlog);

// update blog api here
router.put("/updateBlog", verifyToken, BlogAuthUser, updateBlog);
//export router
module.exports = router;
