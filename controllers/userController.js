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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        password: hashedPassword,
      },
    });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  readUser,
  createUser,
};
