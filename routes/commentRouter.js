const { Router } = require("express");
const commentRouter = Router();
const commentController = require("../controllers/commentController");

commentRouter.get(
  "/blogs/:blogId/posts/:postId/comments",
  commentController.readAllComments,
);
commentRouter.get(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  commentController.readComment,
);
commentRouter.post(
  "/blogs/:blogId/posts/:postId/comments",
  commentController.createComment,
);
commentRouter.put(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  commentController.updateComment,
);
module.exports = commentRouter;
