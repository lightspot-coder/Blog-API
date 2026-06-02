const prisma = require("../lib/prisma.js");

async function readAllBlogs(req, res) {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        title: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
}
async function readBlogById(req, res) {
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(req.params.blogId),
      },
      select: {
        title: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(blog);
  } catch (err) {
    console.log(err);
  }
}
async function createBlog(req, res) {
  try {
    const blog = await prisma.blog.create({
      data: {
        title: req.body.title,
        creator: Number(req.body.user),
      },
    });
    res.json(blog);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  readAllBlogs,
  readBlogById,
  createBlog,
};
