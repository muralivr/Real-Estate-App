const express = require("express");
const {
  test,
  updateUser,
  deleteUser,
  getUserList,
  allUsers,
  getUser,
} = require("../controllers/UserController.js");
const { VerifyUser } = require("../middleware/VerifyUser.js");

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.post("/update/:id", VerifyUser, updateUser);
userRouter.delete("/delete/:id", VerifyUser, deleteUser);
userRouter.get("/list/:id", VerifyUser, getUserList)
userRouter.get("/alluser", allUsers)
userRouter.get("/:id", VerifyUser, getUser)

module.exports = { userRouter };
