const error = require("../middlewares/error");

const express = require("express");
const cors = require("cors");

const user = require("../routes/user");

module.exports = function (app) {
  app.use(cors());
  app.use(express.static("public/"));
  app.use(express.json({ limit: "50mb" }));
  //app.use(express.urlencoded());
  app.use(express.urlencoded({ extended: true }, { limit: "50mb" }));
  // API
  app.use("/api/v1/users", user);

  app.use(error);
};