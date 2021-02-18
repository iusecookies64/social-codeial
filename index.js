const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose");

// requiring authentication libraries
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const session = require("express-session");

// requiring connect-mongo
const MongoStore = require("connect-mongo")(session);

// declaring port
const port = 8000;

let app = express();

// Setting up view engine and views
app.set("view engine", "ejs");
app.set("views", "./views");

// parser middleWares
app.use(express.urlencoded());
app.use(express.static("assets"));
app.use(cookieParser());

// ejs layouts
app.use(ejsLayouts);
app.set("layouts extractStyles", true);
app.set("layouts extractScripts", true);

// authentication middlewares
app.use(
  session({
    name: "codeial",
    secret: "blahSomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// setting up router below
app.use("/", require("./routers/index"));

// listening our server
app.listen(port, function (err) {
  if (err) {
    console.log("error running the server", err);
    return;
  }
  console.log("Express server up and running on port:", port);
});
