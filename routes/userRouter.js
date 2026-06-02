const { Router } = require("express");
const userController = require("../controllers/userController");

const userRouter = Router();

userRouter.post("/users", userController.createUser);

module.exports = userRouter;
