const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const passport = require("passport");

// handling /user/profile req
router.get("/profile/:id", passport.checkAuthentication, userController.profile);
router.get("/profile", passport.checkAuthentication, userController.profile);

// handling /user/sign-up req
router.get("/sign-up", userController.signUp);

// handling /user/sign-in req
router.get("/sign-in", userController.signIn);

// handling /user/create req
router.post("/create", userController.create);

// handling /user/create-session req
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/" }),
  userController.createSession
);

// handling /user/sign-out req
router.get("/sign-out", userController.signOut);

// update user info
router.post("/update/:id", passport.checkAuthentication, userController.update);
module.exports = router;
