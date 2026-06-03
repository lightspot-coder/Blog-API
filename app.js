const express = require("express");
const prisma = require("./lib/prisma.js");
const userRoter = require("./routes/userRouter.js");
const blogRouter = require("./routes/blogRouter.js");
const postRouter = require("./routes/postRouter.js");
const commentRouter = require("./routes/commentRouter.js");

const app = express();

app.use(express.urlencoded({ extended: false }));

/*
app.post("/sign-up", async (req, res) => {
  try {
    // create a new user
    const user = await prisma.user.create({
      data: {
        name: "John",
        password: "secret",
        privilege: 1,
      },
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});
*/

// REST for user
app.get("/users/:userId", userRoter);
app.post("/users", userRoter);

// REST for blogs
app.get("/blogs", blogRouter);
app.post("/blogs", blogRouter);
app.get("/blogs/:blogId", blogRouter);
app.put("/blogs/:blogId", blogRouter);

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
