const express = require("express");
const { VerifyUser } = require("../middleware/VerifyUser.js");
const {
  createList,
  deleteList,
  editList,
  getList,
  getLists,
} = require("../controllers/ListController.js");

const listRouter = express.Router();

listRouter.post("/create", VerifyUser, createList);
listRouter.delete("/delete/:id", VerifyUser, deleteList);
listRouter.put("/edit/:id", VerifyUser, editList);
listRouter.get("/get/:id", getList);
listRouter.get("/getlist", getLists);

module.exports = { listRouter };
