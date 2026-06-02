const prisma = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");

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
  createUser,
};
