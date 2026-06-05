const prisma = require("../lib/prisma");

async function readAllComments(req, res) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: +req.params.postId,
      },
      select: {
        id: true,
        postId: true,
        message: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    if (comments.length == 0) {
      res.json({
        message: "There are not comments",
      });
    } else {
      res.json(comments);
    }
  } catch (err) {
    console.log(err);
  }
}
async function readComment(req, res) {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: +req.params.commentId,
      },
      select: {
        id: true,
        postId: true,
        message: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!comment) {
      res.json({
        message: "This comments does not exist",
      });
    } else {
      res.json(comment);
    }
  } catch (err) {
    console.log(err);
  }
}
async function createComment(req, res) {
  const user = req.user;
  try {
    const comment = await prisma.comment.create({
      data: {
        postId: +req.params.postId,
        userId: +user.id,
        message: req.body.message,
      },
    });
    res.json({ message: "comment added", comment });
  } catch (err) {
    console.log(err);
  }
}

async function updateComment(req, res) {
  try {
    // Check if the comment exist
    const commentExist = await prisma.comment.findFirst({
      where: {
        id: +req.params.commentId,
      },
    });
    if (!commentExist) {
      res.json({
        message: "This comment doesn't exist",
      });
    } else {
      // Check id the user can update the comment
      const user = req.user;
      if (commentExist.userId != +user.id) {
        res.json({
          message: "You did not write this comments",
        });
      } else {
        const comment = await prisma.comment.update({
          where: {
            id: +req.params.commentId,
          },
          data: {
            message: req.body.message,
          },
        });
        res.json({ message: "comment update", comment });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function deleteComment(req, res) {
  const user = req.user;
  // Check if the user is the creator of the blog
  const blog = await prisma.blog.findFirst({
    where: {
      id: +req.params.blogId,
    },
  });
  if (!blog) {
    res.json({
      message: "This blog doesn't exist",
    });
  } else {
    if (blog.userId != user.id) {
      res.json({
        message:
          "You can not delete the comment because you are not the creator of the blog",
      });
    } else {
      // Check if the comment exist
      const commentExist = await prisma.comment.findFirst({
        where: {
          id: +req.params.commentId,
        },
      });
      if (!commentExist) {
        res.json({
          message: "Comment was not found,",
        });
      } else {
        const comment = await prisma.comment.delete({
          where: {
            id: +req.params.commentId,
          },
        });
        res.json({
          message: "Comment deleted",
          comment,
        });
      }
    }
  }
}

module.exports = {
  readAllComments,
  readComment,
  createComment,
  updateComment,
  deleteComment,
};
