const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts");
const app = express();

mongoose
  .connect(
    "mongodb+srv://bharath:nV4Ma5TWuSjC0Uy6@cluster0.x73qz8d.mongodb.net/vinay?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch(() => {
    console.log("Mongo Not Connected");
  });
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
module.exports = app;
