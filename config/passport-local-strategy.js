const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// creating new local strategy
passport.use(
  new LocalStrategy(
    {
      username: "email",
    },
    function (email, password, done) {
      // finding a user and establishing an identity
      console.log("entered local");
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("Error finding user --> Passport");
          return done(err);
        }
        // in case user is found
        if (user) {
          // checking if password entered is same
          if (user.password == password) {
            return done(null, user);
          } else {
            console.log("wrong pass");
            return done(null, false, { message: "Incorrect Password." });
          }
        }
        // if user not found
        else {
          console.log("user not found");
          return done(null, false, { message: "User Not Found." });
        }
      });
    }
  )
);

// serializing id
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

// deserializing id
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("error finding user --> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

// passport checkAuthentication function, this is to be put in profile router
passport.checkAuthentication = function (req, res, next) {
  console.log("checking authentication in profile");
  if (req.isAuthenticated()) {
    // allowing req to move further
    next();
  } else {
    // sending back request
    return res.redirect("/user/sign-in");
  }
};

// setAuthentication function, this is to be put in index.js
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
