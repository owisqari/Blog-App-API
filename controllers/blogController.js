const express = require("express");
const router = express.Router();
const UsersDB = require("../models/Users");
const BlogsDB = require("../models/Blogs");

exports.allBlogs = async (req, res) => {
  const blogs = await BlogsDB.find();
  try {
    res.status(200).json(blogs);
  } catch (err) {
    console.log(err);
  }
};

exports.createBlog = async (req, res) => {
  try {
    const savedBlog = await BlogsDB.create({
      title: req.body.title,
      body: req.body.body,
      userId: res.locals.userId,
    });
    const blogIdUpdate = await UsersDB.findByIdAndUpdate(res.locals.userId, {
      $push: { blogId: savedBlog._id },
    });
    const blogId = blogIdUpdate.blogId;
    res.status(201).json({ savedBlog, blogId });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await res.locals.blog.deleteOne();
    res.status(200).json({ blog: deleted, message: "Blog deleted" });
  } catch (err) {
    console.log(err);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    res.locals.blog.title = req.body.title;
    res.locals.blog.body = req.body.body;
    const updateBlog = await res.locals.blog.save();
    res.status(200).json({ updateBlog, message: "Blog updated" });
  } catch (err) {
    console.log(err);
  }
};
