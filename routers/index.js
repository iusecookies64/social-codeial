const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller.js");

// Handling Home Req
router.get("/", homeController.home);

// handling user requests
router.use("/user", require("./user"));

// handling post requests
router.use("/posts", require("./posts"));

// handling comments requests
router.use("/comments", require("./comments"));

// exporting our router
module.exports = router;
