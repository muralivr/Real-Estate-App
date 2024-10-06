const express = require("express");
const {
  signup,
  signin,
  google,
  signout,
} = require("../controllers/AuthController.js");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", google);
authRouter.post("/signout", signout);

module.exports = { authRouter };
