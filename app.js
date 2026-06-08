const express = require("express");

const indexRouter = require("./routes/indexRouter.js");

const app = express();
// CORS policy

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use("/blog-api", indexRouter);

app.listen(3000, () => console.log("Listening by the port 3000..."));
