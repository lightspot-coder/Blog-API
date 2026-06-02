const { Router } = require("express");
const blogController = require("../controllers/blogController");

const blogRouter = Router();

blogRouter.get("/blogs", blogController.readAllBlogs);
blogRouter.post("/blogs", blogController.createBlog);
blogRouter.get("/blogs/:blogId", blogController.readBlogById);

module.exports = blogRouter;
