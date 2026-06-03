const prisma = require("../lib/prisma.js");
const { dotenv } = require("dotenv/config");
const jwt = require("jsonwebtoken");

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
    const user = req.user;
    if (!user) {
      res.sendStatus(403);
    } else {
      const blogExist = await prisma.blog.findFirst({
        where: {
          userId: +user.id,
        },
      });
      // Only 1 blog for user
      if (blogExist) {
        res.json({
          message: "just 1 blog for user",
        });
      } else {
        const blog = await prisma.blog.create({
          data: {
            title: req.body.title,
            userId: +user.id,
          },
        });
        res.json({
          message: "Blog created",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateBlog(req, res) {
  try {
    const user = req.user;
    if (!user) {
      res.sendStatus(403);
    } else {
      // Check if the blog exist
      const blogExist = await prisma.blog.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (!blogExist) {
        res.json({
          message: "You dont have any blog to update",
        });
      } else {
        const blog = await prisma.blog.update({
          where: {
            id: +req.params.blogId,
          },
          data: {
            title: req.body.title,
          },
        });
        res.json({
          message: "blog title update",
          blog,
        });
      }
    }
  } catch (err) {}
}

module.exports = {
  readAllBlogs,
  readBlogById,
  createBlog,
  updateBlog,
};
