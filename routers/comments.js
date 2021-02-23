const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments_controller");
const Passport = require("passport");

router.post("/create", Passport.checkAuthentication, commentsController.create);

module.exports = router;
