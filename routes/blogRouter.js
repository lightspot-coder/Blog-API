const { Router } = require("express");
const blogController = require("../controllers/blogController");
const userController = require("../controllers/userController");

const blogRouter = Router();

blogRouter.get("/blogs", blogController.readAllBlogs);
blogRouter.post(
  "/blogs",
  userController.checkUserLogIn,
  blogController.createBlog,
);
blogRouter.get("/blogs/:blogId", blogController.readBlogById);
blogRouter.put(
  "/blogs/:blogId",
  userController.checkUserLogIn,
  blogController.creatorIsTheUserLogIn,
  blogController.updateBlog,
);
blogRouter.delete(
  "/blogs/:blogId",
  userController.checkUserLogIn,
  blogController.creatorIsTheUserLogIn,
  blogController.blogExist,
  blogController.deleteBlog,
);

module.exports = blogRouter;
