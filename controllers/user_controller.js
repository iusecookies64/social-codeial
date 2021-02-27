// requiring user schema
const User = require("../models/user");

// rendering sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }

  return res.render("sign_up", {
    title: "Codeial : Sign Up",
  });
};

// ============================================================

// rendering sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }

  return res.render("sign-in", {
    title: "Codeial : Sign In",
  });
};

// ============================================================

// processing sign up data
module.exports.create = function (req, res) {
  // checking if password and confirm password is same
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("/user/sign-up");
  }
  // checking if email is unique

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error finding user in sign up");
      return;
    }

    // if user found return back to sign up page

    if (user) {
      return res.redirect("/user/sign-up");
    }

    // if user not found we create user
    else {
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        },
        function (err, user) {
          if (err) {
            console.log("error creating user while signing-up");
            return res.redirect("/user/sign-up");
          }

          // once user created redirect to sign in page
          req.flash("success", "Account Created Successfully");
          return res.redirect("/user/sign-in");
        }
      );
    }
  });
};

// create session req action
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

// profile get req action
module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (user) {
      return res.render("profile", {
        title: "Codeial : User Profile",
        profile_user: user,
      });
    }
  });
};

module.exports.signOut = function (req, res) {
  req.logout();
  req.flash("success", "You Have Logged Out");
  return res.redirect("/user/sign-in");
};

module.exports.update = function (req, res) {
  // checking if user authorized to update
  if (req.user.id == req.body.id) {
    // finding the user and updating
    User.findByIdAndUpdate(
      req.body.id,
      { name: req.body.name, email: req.body.email },
      function (err, user) {
        if (err) {
          req.flash("error", "Error Updating");
          console.log(err);
        } else {
          req.flash("success", "Profile Updated");
        }
        return res.redirect("back");
      }
    );
  }
};

// ============================================================

// // processing sign in form post request
// module.exports.createSession = function (req, res) {
//   // finding user in our db
//   User.findOne({ email: req.body.email }, function (err, user) {
//     if (err) {
//       console.log("Error finding user in sign in");
//       return res.redirect("back");
//     }
//     // in case user is found
//     if (user) {
//       // checking if password entered is correct
//       if (user.password == req.body.password) {
//         // creating a authentication key
//         res.cookie("user_id", user.id);
//         // redirection to /user/profile
//         return res.redirect("/user/profile");
//       } else {
//         return res.redirect("/user/sign-in");
//       }
//     } else {
//       // if user not found or password didn't match
//       return res.redirect("/user/sign-in");
//     }
//   });
// };

// // ============================================================

// // handling /user/profile req

// module.exports.profile = function (req, res) {
//   console.log("cookie in profile", req.cookies);
//   // if user_id prop is present
//   if (req.cookies.user_id) {
//     // checking if such user if present
//     User.findById(req.cookies.user_id, function (err, user) {
//       if (err) {
//         console.log("error in finding user in profile");
//         return;
//       }
//       // if user is found rendering profile page
//       if (user) {
//         return res.render("profile", {
//           title: "Codeial : User Profile",
//           user: user,
//         });
//       } else {
//         return res.redirect("/user/sign-in");
//       }
//     });
//   } else {
//     return res.redirect("/user/sign-in");
//   }
// };

// // ============================================================

// // handling sign out req

// module.exports.signOut = function (req, res) {
//   delete req.cookies.user_id;
//   return res.redirect("/user/sign-in");
// };
