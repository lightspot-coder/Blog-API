const prisma = require("../lib/prisma");

async function readAllComments(req, res) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: +req.params.postId,
      },
    });
    res.json(comments);
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
    });
    res.json(comment);
  } catch (err) {
    console.log(err);
  }
}
async function createComment(req, res) {
  try {
    const comment = await prisma.comment.create({
      data: {
        postId: +req.params.postId,
        userId: +req.body.userId,
        message: req.body.message,
      },
    });
    res.json(comment);
  } catch (err) {
    console.log(err);
  }
}

async function updateComment(req, res) {
  try {
    const comment = await prisma.comment.update({
      where: {
        id: +req.params.commentId,
      },
      data: {
        message: req.body.message,
      },
    });
    res.json(comment);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  readAllComments,
  readComment,
  createComment,
  updateComment,
};
