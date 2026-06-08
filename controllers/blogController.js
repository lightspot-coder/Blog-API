const prisma = require("../lib/prisma.js");
const { dotenv } = require("dotenv/config");
const jwt = require("jsonwebtoken");

async function readAllBlogs(req, res) {
  try {
    console.log("someone trying to see all blogs");
    const blogs = await prisma.blog.findMany({
      select: {
        title: true,
        id: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    });
    if (blogs.length == 0) {
      res.json({
        message: "There are any blog yet",
      });
    } else {
      res.json(blogs);
    }
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
        id: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!blog) {
      res.json({
        message: "This blog does not exist",
      });
    } else {
      res.json(blog);
    }
  } catch (err) {
    console.log(err);
  }
}
async function createBlog(req, res) {
  try {
    const user = req.user;

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
  } catch (err) {
    console.log(err);
  }
}

async function updateBlog(req, res) {
  try {
    const user = req.user;

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
  } catch (err) {}
}

// creatorIsTheUserLogIn

// Middleware function to check if the user login is the creator
// of the blog include on the url params

async function creatorIsTheUserLogIn(req, res, next) {
  const blog = await prisma.blog.findFirst({
    where: {
      AND: {
        id: +req.params.blogId,
        userId: +req.user.id,
      },
    },
  });
  if (!blog) {
    res.json({
      message: "You are not the creator of this blog",
    });
  } else {
    next();
  }
}

async function blogExist(req, res, next) {
  const blog = await prisma.blog.findFirst({
    where: {
      id: +req.params.blogId,
    },
  });
  if (!blog) {
    res.json({
      message: "This blog does not exist",
    });
  } else {
    next();
  }
}
async function deleteBlog(req, res) {
  const blog = await prisma.blog.delete({
    where: {
      id: +req.params.blogId,
    },
  });
  res.json({
    message: "blog delete",
    blog,
  });
}

module.exports = {
  readAllBlogs,
  readBlogById,
  createBlog,
  updateBlog,
  creatorIsTheUserLogIn,
  blogExist,
  deleteBlog,
};
