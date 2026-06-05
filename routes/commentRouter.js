const { Router } = require("express");
const commentRouter = Router();
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
const blogController = require("../controllers/blogController");
const postController = require("../controllers/postController");

commentRouter.get(
  "/blogs/:blogId/posts/:postId/comments",
  postController.postExist,
  commentController.readAllComments,
);
commentRouter.get(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  commentController.readComment,
);

commentRouter.post(
  "/blogs/:blogId/posts/:postId/comments",
  userController.checkUserLogIn,
  postController.postExist,
  commentController.createComment,
);
commentRouter.put(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  userController.checkUserLogIn,
  commentController.updateComment,
);
commentRouter.delete(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  userController.checkUserLogIn,
  commentController.deleteComment,
);

module.exports = commentRouter;
