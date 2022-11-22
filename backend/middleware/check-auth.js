const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //   "secret" should be same as the one used during creating post
    jwt.verify(token, "secret");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
