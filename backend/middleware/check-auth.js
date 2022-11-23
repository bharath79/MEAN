const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //   "secret" should be same as the one used during creating post
    const decodedToken = jwt.verify(token, "secret");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Auth failed!" });
  }
};
