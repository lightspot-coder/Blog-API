const prisma = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");

async function readUser(req, res) {
  try {
    const user = prisma.user.findFirst({
      where: {
        id: req.params.userId,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function createUser(req, res) {
  try {
    // check if the user exist
    console.log("someone is trying to create a new user");
    const userExist = await prisma.user.findFirst({
      where: {
        name: req.body.name,
      },
    });
    if (userExist) {
      res.json({
        message: "user already exist",
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          password: hashedPassword,
        },
      });
      res.json({
        message: "user created successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// Middleware function to check if the user is log in

async function checkUserLogIn(req, res, next) {
  if (!req.user) {
    res.sendStatus(403);
  } else {
    next();
  }
}

module.exports = {
  readUser,
  createUser,
  checkUserLogIn,
};
