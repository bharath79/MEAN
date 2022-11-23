const Post = require("../models/post");

const multer = require("multer");
const express = require("express");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime type");
    if (isValid) err = null;
    cb(err, "./backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    post.save().then((created) => {
      res.status(201).json({
        message: "Added Successfully",
        post: {
          ...created,
          id: created._id,
        },
      });
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "success",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let path = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      path = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: path,
      creator: req.userData.userId,
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((result) => {
      if (result.modifiedCount > 0)
        res.status(200).json({ message: "Update Successful" });
      else res.status(401).json({ message: "Not authorized" });
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) res.status(200).json(post);
    else res.status(404).json({ message: "Post not found" });
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.deleteCount > 0)
        res.status(200).json({ message: "Update Successful" });
      else res.status(401).json({ message: "Not authorized" });
    }
  );
});

module.exports = router;
