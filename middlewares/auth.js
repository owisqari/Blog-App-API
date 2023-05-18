// verify token middleware
exports.verifyToken = (req, res, next) => {
  // return res.send(req.headers);
  if (!req.headers.authorization) {
    return res.status(401).json({ errorMessage: "unauthorized" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ errorMessage: "unverified" });
    } else {
      res.locals.currentUser = data;
      res.locals.userId = data.userId;
      res.locals.token = token;
      next();
    }
  });
};

// auth user middleware
exports.BlogAuthUser = (req, res, next) => {
  BlogsDB.findById(req.body.id)
    .then((blog) => {
      if (blog) {
        if (blog.userId == res.locals.userId) {
          res.locals.blog = blog;
          next();
        } else {
          res.status(401).json({ message: "You are unauthorized" });
        }
      } else {
        res.status(400).json({ message: "Blog not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
