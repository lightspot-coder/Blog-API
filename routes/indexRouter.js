const prisma = require("../lib/prisma.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userRouter = require("./userRouter.js");
const blogRouter = require("./blogRouter.js");
const postRouter = require("./postRouter.js");
const commentRouter = require("./commentRouter.js");
const { Router } = require("express");

const indexRouter = Router();

// middleware function to check if all the req.params are integer

function checkTypeReqParams(req, res, next) {
  let paramsCorrect = true;
  for (const key of Object.keys(req.params)) {
    //console.log(req.params[key]);
    //console.log(+req.params[key]);
    if (Number.isNaN(+req.params[key])) {
      res.sendStatus(404);
      paramsCorrect = false;
      break;
    }
  }
  if (paramsCorrect) {
    next();
  }
}

// asign a jason web token to the user if exist

indexRouter.post("/login", async (req, res) => {
  try {
    console.log("user try to login");
    console.log(req.body);
    const user = await prisma.user.findFirst({
      where: {
        name: req.body.name,
      },
      include: {
        blog: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) {
      res.status(404).json({
        message: "error: user not found",
      });
    } else {
      // check the password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        res.status(404).json({
          message: "error: password not match",
        });
      }
      // send the token
      else {
        //res.json(user);
        jwt.sign(
          { user },
          process.env.SECRET_KEY,
          { expiresIn: "1 day" },
          (err, token) => {
            res.json({
              name: user.name,
              id: user.id,
              blogId: !user.blog ? null : user.blog.id,
              token,
            });
          },
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// REST for user
indexRouter.get("/users/:userId", checkTypeReqParams, userRouter);
indexRouter.post("/users", userRouter);

// REST for blogs
indexRouter.get("/blogs", blogRouter);
indexRouter.get("/blogs/:blogId", checkTypeReqParams, blogRouter);
indexRouter.post("/blogs", verifyToken, blogRouter);
indexRouter.put("/blogs/:blogId", checkTypeReqParams, verifyToken, blogRouter);
indexRouter.delete(
  "/blogs/:blogId",
  checkTypeReqParams,
  verifyToken,
  blogRouter,
);

// REST for post
indexRouter.get("/blogs/:blogId/posts", checkTypeReqParams, postRouter);
indexRouter.get("/blogs/:blogId/posts/:postId", checkTypeReqParams, postRouter);
indexRouter.post(
  "/blogs/:blogId/posts/",
  checkTypeReqParams,
  verifyToken,
  postRouter,
);
indexRouter.put(
  "/blogs/:blogId/posts/:postId",
  checkTypeReqParams,
  verifyToken,
  postRouter,
);
indexRouter.delete(
  "/blogs/:blogId/posts/:postId",
  checkTypeReqParams,
  verifyToken,
  postRouter,
);

// REST for comment
indexRouter.get(
  "/blogs/:blogId/posts/:postId/comments",
  checkTypeReqParams,
  commentRouter,
);
indexRouter.get(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  checkTypeReqParams,
  commentRouter,
);
indexRouter.post(
  "/blogs/:blogId/posts/:postId/comments",
  checkTypeReqParams,
  verifyToken,
  commentRouter,
);
indexRouter.put(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  checkTypeReqParams,
  verifyToken,
  commentRouter,
);
indexRouter.delete(
  "/blogs/:blogId/posts/:postId/comments/:commentId",
  checkTypeReqParams,
  verifyToken,
  commentRouter,
);

indexRouter.use("/{*splat}", (req, res) => {
  res.sendStatus(404);
});

// FORMAT OF TOKEN
// Authorization: Bearer <acces_token>

function verifyToken(req, res, next) {
  // get the creator header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Verify the token
    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = authData.user;
        next();
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = indexRouter;
