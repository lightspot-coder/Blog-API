const prisma = require("../lib/prisma");

async function readPosts(req, res) {
  try {
    console.log("someone trying to see all posts");
    const posts = await prisma.post.findMany({
      where: {
        blogId: +req.params.blogId,
      },
    });
    let onlyPublicPost = true;
    // only the creator of the blog can see all the post(public or not)
    // the rest of the users just can see the public ones
    if (req.user) {
      console.log("user exist");
      const blogUser = await prisma.blog.findFirst({
        where: {
          AND: {
            userId: +req.user.id,
            id: +req.params.blogId,
          },
        },
      });
      if (blogUser) {
        res.json(posts);
        return;
      }
    }
    let publicPosts = [];
    posts.map((post) => {
      if (post.public) {
        publicPosts.push(post);
      }
    });
    res.json(publicPosts);
  } catch (err) {
    console.log(err);
  }
}
async function readPost(req, res) {
  try {
    console.log("someone is trying to read a single post");
    const post = await prisma.post.findFirst({
      where: {
        id: +req.params.postId,
      },
    });
    if (!post) {
      res.json({
        message: "This post does not exist",
      });
    } else {
      res.json(post);
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to check if the user login is allow to CRUD
// the post in the blog given in the req.params

async function createPost(req, res) {
  try {
    const user = req.user;

    // check if user have a blog
    const blog = await prisma.blog.findFirst({
      where: {
        AND: {
          id: +req.params.blogId,
          userId: user.id,
        },
      },
    });
    if (!blog) {
      res.json({
        message: "Blog doesn't found, are you have one already?",
      });
    } else {
      const post = await prisma.post.create({
        data: {
          blogId: +req.params.blogId,
          title: req.body.title,
          text: req.body.text,
          public: req.body.public === "false" ? false : true,
        },
      });
      if (!post) {
        res.json({
          message: "something goes wrong creating the post",
        });
      } else {
        res.json({
          message: "post created",
          post,
        });
      }
    }
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
    res.json({
      message: "post was update",
      post,
    });
  } catch (err) {
    console.log(err);
  }
}

// postExist

// Middleware function to check if the post exist on the blog

async function postExist(req, res, next) {
  const post = await prisma.post.findFirst({
    where: {
      id: +req.params.postId,
      blogId: +req.params.blogId,
    },
  });
  if (!post) {
    res.json({
      message: "This post doesn't exist",
    });
  } else {
    next();
  }
}

async function deletePost(req, res) {
  const post = await prisma.post.delete({
    where: {
      id: +req.params.postId,
    },
  });
  res.json({
    message: "Post was deleted",
    post,
  });
}

module.exports = {
  readPosts,
  readPost,
  createPost,
  updatePost,
  postExist,
  deletePost,
};
