const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();

mongoose
  .connect(
    "mongodb+srv://bharath:" +
      process.env.MONGO_ATLAS_PASSWORD +
      "@cluster0.x73qz8d.mongodb.net/vinay"
  )
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch(() => {
    console.log("Mongo Not Connected");
  });
app.use(bodyParser.json());
app.use("/images", express.static(path.join("images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
module.exports = app;
