const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose");
const port = 8000;

let app = express();

// Setting up view engine and views
app.set("view engine", "ejs");
app.set("views", "./views");

// putting all the middleWares
app.use(express.urlencoded());
app.use(express.static());
app.use(cookieParser);
app.use(ejsLayouts);

// setting up router below
app.use("/", "./routers/index");

// listening our server
app.listen(port, function (err) {
  if (err) {
    console.log("error running the server", err);
    return;
  }
  console.log("Express server up and running on port:", port);
});
