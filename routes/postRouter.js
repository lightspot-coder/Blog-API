const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController");

postRouter.get("/blogs/:blogId/posts", postController.readPosts);
postRouter.get("/blogs/:blogId/posts/:postId", postController.readPost);
postRouter.post("/blogs/:blogId/posts/", postController.createPost);
postRouter.put("/blogs/:blogId/posts/:postId", postController.updatePost);

module.exports = postRouter;
