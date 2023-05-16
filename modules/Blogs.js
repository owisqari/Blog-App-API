const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogsSchema = new Schema(
  {
    title: String,
    body: String,
    userId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blogs = mongoose.model("Blogs", blogsSchema);

module.exports = Blogs;
