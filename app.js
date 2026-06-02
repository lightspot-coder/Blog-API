const express = require("express");
const prisma = require("./lib/prisma.js");
const userRoter = require("./routes/userRouter.js");
const blogRouter = require("./routes/blogRouter.js");

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
app.post("/users", userRoter);

// REST for blogs
app.get("/blogs", blogRouter);
app.post("/blogs", blogRouter);
app.get("/blogs/:blogId", blogRouter);

app.listen(3000, () => console.log("Listening by the port 3000..."));
