const multer = require("multer");
const express = require("express");
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controller/posts");

const router = express.Router();



router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.createPost
);

router.get("", PostController.getPosts);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.updatePosts
);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
