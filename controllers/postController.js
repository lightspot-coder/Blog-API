const prisma = require("../lib/prisma");

async function readPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        blogId: +req.params.blogId,
      },
    });
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
}
async function readPost(req, res) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        AND: {
          blogId: +req.params.blogId,
          id: +req.params.postId,
        },
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
  }
}
async function createPost(req, res) {
  try {
    const post = await prisma.post.create({
      data: {
        blogId: +req.params.blogId,
        title: req.body.title,
        text: req.body.text,
        public: req.body.public === "false" ? false : true,
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
  }
}
async function updatePost(req, res) {
  try {
    const post = await prisma.post.update({
      where: {
        id: +req.params.postId,
      },
      data: {
        title: req.body.title,
        text: req.body.text,
        public: req.body.public === "false" ? false : true,
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  readPosts,
  readPost,
  createPost,
  updatePost,
};
