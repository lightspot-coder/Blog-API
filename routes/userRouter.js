const { Router } = require("express");
const userController = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/users/:userId", userController.readUser);
userRouter.post("/users", userController.createUser);

module.exports = userRouter;
