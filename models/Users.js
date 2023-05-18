const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false,
    },
    email: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    blogId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blogs",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
