const {
  getAll,
  create,
  remove,
  update,
  login,
  logged,
} = require("../controllers/user.controller");
const express = require("express");
const { verifyJWT } = require("../utils/verifyJWT");

const routerUser = express.Router();

routerUser.route("/").get(verifyJWT, getAll).post(create);

routerUser.route("/login").post(login);

routerUser.route("/me").get(verifyJWT, logged);

routerUser.route("/:id")
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

module.exports = routerUser;
