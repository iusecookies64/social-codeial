const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose");
// const sassMiddleware = require("node-sass-middleware");

// authentication libraries
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const session = require("express-session");

// connect-mongo
const MongoStore = require("connect-mongo")(session);

// connect-flash
const flash = require("connect-flash");

// custom-middlewares
const customMwares = require("./config/middlewares");

// declaring port
const port = 8000;

let app = express();

// Setting up view engine and views
app.set("view engine", "ejs");
app.set("views", "./views");

// parser middleWares
app.use(express.urlencoded());
app.use(express.static("./assets"));
app.use(cookieParser());

// sass middleware

// app.use(
//   sassMiddleware({
//     src: "./assets/scss", // from here scss will be extracted
//     dest: "./assets/css", // here converted css will be posted
//     debug: true, // show error in console (will be disabled in production mode)
//     outputStyle: "extended", // clean multiLine css
//     prefix: "/css", // prefix to be put while linking css in our views
//   })
// );

// ejs layouts
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

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

// adding flash middleware
app.use(flash());
app.use(customMwares.setFlash);

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
