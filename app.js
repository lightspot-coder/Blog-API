const express = require("express");
const prisma = require("./lib/prisma.js");
const userRoter = require("./routes/userRouter.js");
const blogRouter = require("./routes/blogRouter.js");
const postRouter = require("./routes/postRouter.js");
const commentRouter = require("./routes/commentRouter.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/*
async function hashSecretKey() {
  return await bcrypt.hash(`${process.env.SECRET_KEY}`);
}
*/

const app = express();

app.use(express.urlencoded({ extended: false }));

// asign a jason web token to the user if exist

app.post("/login", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        name: req.body.name,
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
app.get("/users/:userId", userRoter);
app.post("/users", userRoter);

// REST for blogs
app.get("/blogs", blogRouter);
app.post("/blogs", verifyToken, blogRouter);
app.get("/blogs/:blogId", blogRouter);
app.put("/blogs/:blogId", verifyToken, blogRouter);

// REST for post
app.get("/blogs/:blogId/posts", postRouter);
app.get("/blogs/:blogId/posts/:postId", postRouter);
app.post("/blogs/:blogId/posts/", postRouter);
app.put("/blogs/:blogId/posts/:postId", postRouter);

// REST for comment
app.get("/blogs/:blogId/posts/:postId/comments", commentRouter);
app.get("/blogs/:blogId/posts/:postId/comments/:commentId", commentRouter);
app.post("/blogs/:blogId/posts/:postId/comments", commentRouter);
app.put("/blogs/:blogId/posts/:postId/comments/:commentId", commentRouter);

app.listen(3000, () => console.log("Listening by the port 3000..."));

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
    // Set the token
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
