const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

// Handling Home Req
router.get("/", homeController.home);

// handling user requests
router.use("/user", require("./user"));

// exporting our router
module.exports = router;
