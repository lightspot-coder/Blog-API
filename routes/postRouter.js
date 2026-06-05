const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const blogController = require("../controllers/blogController");

postRouter.get("/blogs/:blogId/posts", postController.readPosts);
postRouter.get("/blogs/:blogId/posts/:postId", postController.readPost);
postRouter.post(
  "/blogs/:blogId/posts/",
  userController.checkUserLogIn,
  blogController.creatorIsTheUserLogIn,
  postController.createPost,
);
postRouter.put(
  "/blogs/:blogId/posts/:postId",
  userController.checkUserLogIn,
  blogController.creatorIsTheUserLogIn,
  postController.postExist,
  postController.updatePost,
);
postRouter.delete(
  "/blogs/:blogId/posts/:postId",
  userController.checkUserLogIn,
  blogController.creatorIsTheUserLogIn,
  postController.postExist,
  postController.deletePost,
);

module.exports = postRouter;
