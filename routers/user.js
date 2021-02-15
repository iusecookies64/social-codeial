const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

// handling /user/profile req
router.get("/profile", userController.profile);

// handling /user/sign-up req
router.get("/sign-up", userController.signUp);

// handling /user/sign-in req
router.get("/sign-in", userController.signIn);

// handling /user/create req
router.post("/create", userController.create);

// handling /user/create-session req
router.post("/create-session", userController.createSession);

// handling /user/sign-out req
router.get("/sign-out", userController.signOut);

module.exports = router;
