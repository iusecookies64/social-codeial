// requiring user schema
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

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
module.exports.create = async function (req, res) {
  // checking if password and confirm password is same
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("/user/sign-up");
  }
  try {
    // checking if email is unique
    let user = await User.findOne({ email: req.body.email });

    // if user found return back to sign up page
    if (user) {
      return res.redirect("/user/sign-up");
    }

    // if user not found we create user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // once user created redirect to sign in page
    req.flash("success", "Account Created Successfully");
    return res.redirect("/user/sign-in");
  } catch (error) {
    req.flash("error", "Error Creating User!");
    return res.redirect("back");
  }
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

module.exports.update = async function (req, res) {
  // checking if user authorized to update
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        // updating the user
        user.name = req.body.name;
        user.email = req.body.email;

        // updating profile pic only if user has uploaded
        if (req.file) {
          if (user.avatar) {
            let filePath = path.join(__dirname, "..", user.avatar);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }

        user.save();
        return res.redirect("back");
      });
    } catch (error) {
      console.log(err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Not Authorized!");
    return res.redirect("back");
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
