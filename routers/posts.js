const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts_controller");
const Passport = require("passport");

router.post("/create", Passport.checkAuthentication, postsController.create);

router.get(
  "/destroy/:id",
  Passport.checkAuthentication,
  postsController.destroy
);

module.exports = router;
