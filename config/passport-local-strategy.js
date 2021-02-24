const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// creating new local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      // finding a user and establishing an identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          req.flash("error", err);
          return done(err);
        }
        // in case user is found
        if (user) {
          // checking if password entered is same
          if (user.password == password) {
            return done(null, user);
          } else {
            req.flash("error", "Invalid email/password");
            return done(null, false, { message: "Incorrect Password." });
          }
        }
        // if user not found
        else {
          req.flash("error", "Invalid email/password");
          return done(null, false, { message: "User Not Found." });
        }
      });
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
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
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    // allowing req to move further
    next();
  } else {
    // sending back request if user not signed-in
    req.flash("error", "Please Login First");
    return res.redirect("/user/sign-in");
  }
};

// setAuthentication function, this is to be put in index.js
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
