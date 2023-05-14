const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    about: String,
    city: String,
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
